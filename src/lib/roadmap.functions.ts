import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  AssessmentSchema,
  RoadmapOutputSchema,
  type AssessmentInput,
  type RoadmapOutput,
} from "@/lib/assessment-schema";

function buildSystemPrompt(language: "en" | "es") {
  const lang = language === "es" ? "Spanish" : "English";
  return `You are SettleInValencia's expert relocation planner specialized in moves to Valencia, Spain.
You generate practical, Valencia-specific roadmaps covering visas (NIE/TIE, Digital Nomad, Non-Lucrative, Beckham Law, HQP), housing (Ruzafa, Eixample, El Carmen, Benimaclet, Patacona), banking, padrón, healthcare (SIP card), tax residency, schooling, and lifestyle setup.
Write all output in ${lang}.
Be specific, sequential, and realistic about timing.
Group steps by category (e.g. "Visa & Residency", "Housing", "Banking", "Healthcare", "Tax & Finance", "Daily Life").
ALWAYS include a clear disclaimer in the summary that this is informational guidance and NOT binding legal or tax advice — recommend consulting a licensed Spanish abogado or gestor for legal matters.`;
}

function buildUserPrompt(input: AssessmentInput) {
  return `Generate a personalized Valencia relocation roadmap for the following profile:
- Nationality: ${input.nationality}
- Family situation: ${input.family_situation}
- Profession: ${input.profession}
- Visa pathway: ${input.visa_type}
- Monthly budget (EUR): ${input.budget}
- Target arrival: ${input.arrival_date}
- Spanish level: ${input.language_level}
- Housing preference: ${input.housing_preference}
- Neighborhood notes: ${input.neighborhood_preference || "no preference"}
- Additional notes: ${input.notes || "none"}

Return:
- summary: 2-3 sentence overview ending with the legal/tax disclaimer.
- steps: 8-15 ordered actionable steps with category, title, description, estimated_duration (e.g. "1-2 weeks"), priority.
- recommendations: 3-6 tailored recommendations (neighborhoods, professional services, lifestyle tips).`;
}

export const generateRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AssessmentSchema.parse(input))
  .handler(async ({ data, context }): Promise<{ profileId: string; output: RoadmapOutput }> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { supabase, userId } = context;

    // language from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("language")
      .eq("id", userId)
      .maybeSingle();
    const language = (profile?.language === "es" ? "es" : "en") as "en" | "es";

    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);

    let output: RoadmapOutput;
    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: buildSystemPrompt(language),
        prompt: buildUserPrompt(data),
        experimental_output: Output.object({ schema: RoadmapOutputSchema }),
      });
      output = result.experimental_output as RoadmapOutput;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) throw new Error("AI is rate-limited. Please try again in a minute.");
      if (msg.includes("402"))
        throw new Error("AI credits exhausted. Please add credits in workspace billing.");
      throw new Error(`Roadmap generation failed: ${msg}`);
    }

    // Persist relocation_profiles (one per user - upsert by user_id via delete-then-insert is risky; use latest insert)
    const { data: rp, error: rpErr } = await supabase
      .from("relocation_profiles")
      .insert({
        user_id: userId,
        nationality: data.nationality,
        family_situation: data.family_situation,
        profession: data.profession,
        visa_type: data.visa_type,
        budget: data.budget,
        arrival_date: data.arrival_date.length === 10 ? data.arrival_date : null,
        language_level: data.language_level,
        housing_preference: data.housing_preference,
        neighborhood_preference: data.neighborhood_preference || null,
        extras: { notes: data.notes ?? "" } as never,
        generated_plan: output as never,
      })
      .select("id")
      .single();
    if (rpErr || !rp) throw new Error(`Failed to save plan: ${rpErr?.message}`);

    // Clear previous roadmap/recommendations for clean rerun
    await supabase.from("roadmap_steps").delete().eq("user_id", userId);
    await supabase.from("recommendations").delete().eq("user_id", userId);

    const stepRows = output.steps.map((s, idx) => ({
      user_id: userId,
      relocation_profile_id: rp.id,
      category: s.category,
      title: s.title,
      description: `${s.description}\n\nEstimated duration: ${s.estimated_duration} · Priority: ${s.priority}`,
      status: "todo",
      sort_order: idx,
    }));
    if (stepRows.length) await supabase.from("roadmap_steps").insert(stepRows);

    const recRows = output.recommendations.map((r) => ({
      user_id: userId,
      category: r.category,
      title: r.title,
      description: r.description,
    }));
    if (recRows.length) await supabase.from("recommendations").insert(recRows);

    return { profileId: rp.id, output };
  });
