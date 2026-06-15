import { z } from "zod";

export const AssessmentSchema = z.object({
  nationality: z.string().min(2).max(80),
  family_situation: z.enum(["single", "couple", "family_kids", "family_no_kids"]),
  profession: z.string().min(2).max(120),
  visa_type: z.enum([
    "eu_citizen",
    "digital_nomad",
    "non_lucrative",
    "highly_qualified",
    "student",
    "family_reunification",
    "unsure",
  ]),
  budget: z.enum(["under_1500", "1500_2500", "2500_4000", "4000_plus"]),
  arrival_date: z.string().min(4).max(20),
  language_level: z.enum(["none", "basic", "intermediate", "fluent"]),
  housing_preference: z.enum(["rent_apartment", "rent_house", "buy", "short_term"]),
  neighborhood_preference: z.string().max(200).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
});

export type AssessmentInput = z.infer<typeof AssessmentSchema>;

export const RoadmapStepSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  estimated_duration: z.string(),
  priority: z.enum(["high", "medium", "low"]),
});

export const RecommendationSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
});

export const RoadmapOutputSchema = z.object({
  summary: z.string(),
  steps: z.array(RoadmapStepSchema).min(5).max(25),
  recommendations: z.array(RecommendationSchema).min(2).max(10),
});

export type RoadmapOutput = z.infer<typeof RoadmapOutputSchema>;
