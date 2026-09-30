import { z } from "zod";

export const CIVIC_CATEGORIES = [
  "Roads",
  "Drainage",
  "Water",
  "Healthcare",
  "Education",
  "Streetlights",
  "Waste Management",
  "Public Transport",
  "Other",
] as const;

export type CivicCategory = (typeof CIVIC_CATEGORIES)[number];

export const URGENCY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const EVIDENCE_TYPES = [
  "Citizen Report",
  "Citizen Image",
  "Citizen Voice",
  "Citizen Text",
  "Multiple Sources",
] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const AFFECTED_GROUPS = [
  "Households",
  "Pedestrians",
  "Students",
  "Patients",
  "Drivers",
  "Businesses",
  "Residents",
  "Commuters",
  "Unknown",
] as const;

/**
 * Zod schema for validating Gemini or Mock AI structured outputs
 */
export const CitizenSignalAnalysisSchema = z.object({
  signalId: z.string().default("CIVIQ-SIG-001283"),
  category: z.enum(CIVIC_CATEGORIES).catch("Other"),
  subcategory: z.string().min(1).catch("General Civic Infrastructure"),
  severity: z.number().int().min(1).max(10).catch(5),
  urgency: z.enum(URGENCY_LEVELS).catch("MEDIUM"),
  language: z.string().catch("English"),
  location: z.object({
    ward: z.string().catch("N/A"),
    area: z.string().catch("Not specified"),
  }),
  affectedGroup: z.string().catch("Residents"),
  summary: z.string().min(1).catch("Citizen submitted infrastructure observation."),
  evidenceType: z.enum(EVIDENCE_TYPES).catch("Citizen Report"),
  confidence: z.number().min(0).max(1).catch(0.85),
  reasoning: z.string().min(1).catch("Interpreted based on reported civic conditions."),
  recommendedNextStep: z
    .string()
    .min(1)
    .catch("Review infrastructure telemetry and field records for the reported area."),
  mode: z.enum(["gemini", "demo"]).default("demo"),
});

export type CitizenSignalAnalysis = z.infer<typeof CitizenSignalAnalysisSchema>;

/**
 * Input payload sent from the frontend to /api/analyze-signal
 */
export interface CitizenSignalInput {
  id?: string;
  text?: string;
  language?: string;
  ward?: string;
  area?: string;
  category?: string;
  source?: "text" | "voice" | "image";
  image?: string; // base64 or data URL
  imageMimeType?: string;
}

/**
 * Schema for validating incoming request to /api/analyze-signal
 */
export const CitizenSignalInputSchema = z.object({
  id: z.string().optional(),
  text: z.string().max(2000).optional(),
  language: z.string().max(50).optional(),
  ward: z.string().max(50).optional(),
  area: z.string().max(200).optional(),
  category: z.string().max(50).optional(),
  source: z.enum(["text", "voice", "image"]).optional(),
  image: z.string().max(10 * 1024 * 1024).optional(), // Max 10MB base64
  imageMimeType: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"]).optional(),
});
