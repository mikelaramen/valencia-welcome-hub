import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { generateRoadmap } from "@/lib/roadmap.functions";
import { AssessmentSchema, type AssessmentInput } from "@/lib/assessment-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Free Valencia relocation plan — Assessment" },
      {
        name: "description",
        content:
          "Answer six quick questions and get a personalized AI-powered relocation roadmap for Valencia.",
      },
    ],
  }),
  component: AssessmentPage,
});

const STORAGE_KEY = "siv_assessment_draft";

const emptyDraft: Partial<AssessmentInput> = {
  nationality: "",
  family_situation: "single",
  profession: "",
  visa_type: "unsure",
  budget: "1500_2500",
  arrival_date: "",
  language_level: "none",
  housing_preference: "rent_apartment",
  neighborhood_preference: "",
  notes: "",
};

function AssessmentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();
  const runGenerate = useServerFn(generateRoadmap);

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<AssessmentInput>>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDraft({ ...emptyDraft, ...JSON.parse(raw) });
    } catch {
      /* noop */
    }
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* noop */
    }
  }, [draft]);

  const steps = useMemo(
    () => [
      "profile",
      "family",
      "visa",
      "budget",
      "housing",
      "review",
    ],
    [],
  );
  const totalSteps = steps.length;

  function set<K extends keyof AssessmentInput>(key: K, value: AssessmentInput[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleGenerate() {
    const parsed = AssessmentSchema.safeParse(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete all fields.");
      return;
    }

    if (!authed) {
      // Persist and redirect to /auth, then user can return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
      } catch {
        /* noop */
      }
      navigate({ to: "/auth" });
      return;
    }

    setSubmitting(true);
    try {
      await runGenerate({ data: parsed.data });
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
      router.invalidate();
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="font-serif text-xl font-medium">
            SettleIn<span className="text-terracotta">Valencia</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            {t("assessment.stepLabel", { current: step + 1, total: totalSteps })}
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-terracotta transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        {step === 0 ? (
          <Section title={t("assessment.s1.title")} body={t("assessment.s1.body")}>
            <Field label={t("assessment.nationality")}>
              <Input
                value={draft.nationality ?? ""}
                onChange={(e) => set("nationality", e.target.value)}
                placeholder="e.g. United States, Mexico, UK"
              />
            </Field>
            <Field label={t("assessment.profession")}>
              <Input
                value={draft.profession ?? ""}
                onChange={(e) => set("profession", e.target.value)}
                placeholder="e.g. Remote software engineer"
              />
            </Field>
          </Section>
        ) : null}

        {step === 1 ? (
          <Section title={t("assessment.s2.title")} body={t("assessment.s2.body")}>
            <Field label={t("assessment.family")}>
              <Select
                value={draft.family_situation}
                onChange={(v) => set("family_situation", v as AssessmentInput["family_situation"])}
                options={[
                  { v: "single", l: t("assessment.familyOpt.single") },
                  { v: "couple", l: t("assessment.familyOpt.couple") },
                  { v: "family_kids", l: t("assessment.familyOpt.familyKids") },
                  { v: "family_no_kids", l: t("assessment.familyOpt.familyNoKids") },
                ]}
              />
            </Field>
            <Field label={t("assessment.language")}>
              <Select
                value={draft.language_level}
                onChange={(v) => set("language_level", v as AssessmentInput["language_level"])}
                options={[
                  { v: "none", l: t("assessment.langOpt.none") },
                  { v: "basic", l: t("assessment.langOpt.basic") },
                  { v: "intermediate", l: t("assessment.langOpt.intermediate") },
                  { v: "fluent", l: t("assessment.langOpt.fluent") },
                ]}
              />
            </Field>
          </Section>
        ) : null}

        {step === 2 ? (
          <Section title={t("assessment.s3.title")} body={t("assessment.s3.body")}>
            <Field label={t("assessment.visa")}>
              <Select
                value={draft.visa_type}
                onChange={(v) => set("visa_type", v as AssessmentInput["visa_type"])}
                options={[
                  { v: "eu_citizen", l: t("assessment.visaOpt.eu") },
                  { v: "digital_nomad", l: t("assessment.visaOpt.digitalNomad") },
                  { v: "non_lucrative", l: t("assessment.visaOpt.nonLucrative") },
                  { v: "highly_qualified", l: t("assessment.visaOpt.hqp") },
                  { v: "student", l: t("assessment.visaOpt.student") },
                  { v: "family_reunification", l: t("assessment.visaOpt.family") },
                  { v: "unsure", l: t("assessment.visaOpt.unsure") },
                ]}
              />
            </Field>
            <Field label={t("assessment.arrival")}>
              <Input
                type="date"
                value={draft.arrival_date ?? ""}
                onChange={(e) => set("arrival_date", e.target.value)}
              />
            </Field>
          </Section>
        ) : null}

        {step === 3 ? (
          <Section title={t("assessment.s4.title")} body={t("assessment.s4.body")}>
            <Field label={t("assessment.budget")}>
              <Select
                value={draft.budget}
                onChange={(v) => set("budget", v as AssessmentInput["budget"])}
                options={[
                  { v: "under_1500", l: "< €1,500" },
                  { v: "1500_2500", l: "€1,500 – €2,500" },
                  { v: "2500_4000", l: "€2,500 – €4,000" },
                  { v: "4000_plus", l: "€4,000+" },
                ]}
              />
            </Field>
          </Section>
        ) : null}

        {step === 4 ? (
          <Section title={t("assessment.s5.title")} body={t("assessment.s5.body")}>
            <Field label={t("assessment.housing")}>
              <Select
                value={draft.housing_preference}
                onChange={(v) =>
                  set("housing_preference", v as AssessmentInput["housing_preference"])
                }
                options={[
                  { v: "rent_apartment", l: t("assessment.housingOpt.rentApt") },
                  { v: "rent_house", l: t("assessment.housingOpt.rentHouse") },
                  { v: "buy", l: t("assessment.housingOpt.buy") },
                  { v: "short_term", l: t("assessment.housingOpt.short") },
                ]}
              />
            </Field>
            <Field label={t("assessment.neighborhood")}>
              <Input
                value={draft.neighborhood_preference ?? ""}
                onChange={(e) => set("neighborhood_preference", e.target.value)}
                placeholder="e.g. Ruzafa, Eixample, near a school"
              />
            </Field>
          </Section>
        ) : null}

        {step === 5 ? (
          <Section title={t("assessment.s6.title")} body={t("assessment.s6.body")}>
            <Field label={t("assessment.notes")}>
              <Textarea
                rows={5}
                value={draft.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={t("assessment.notesPlaceholder") ?? ""}
              />
            </Field>
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              {t("assessment.disclaimer")}
            </div>
          </Section>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 0 || submitting}>
            {t("assessment.back")}
          </Button>
          {step < totalSteps - 1 ? (
            <Button onClick={next}>{t("assessment.next")}</Button>
          ) : (
            <Button onClick={handleGenerate} disabled={submitting}>
              {submitting
                ? t("assessment.generating")
                : authed
                  ? t("assessment.generate")
                  : t("assessment.signupAndGenerate")}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function Section({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-serif text-3xl font-medium tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{body}</p>
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  options: Array<{ v: string; l: string }>;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  );
}
