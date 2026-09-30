/**
 * Server-side Gemini AI Integration for CIVIQ (Phase 4)
 *
 * Calls Google Gemini using @google/genai with strict JSON schema validation.
 * NEVER exposed to the browser.
 */

import { GoogleGenAI } from "@google/genai";
import {
  CitizenSignalInput,
  CitizenSignalAnalysis,
  CitizenSignalAnalysisSchema,
  CIVIC_CATEGORIES,
  URGENCY_LEVELS,
  EVIDENCE_TYPES,
} from "./schemas";

const GEMINI_SYSTEM_INSTRUCTION = `You are CIVIQ's civic intelligence analysis engine.
Your role is to interpret citizen-submitted infrastructure reports and convert them into structured, actionable civic intelligence for municipal engineers and urban planners.

You must:
1. Identify the likely infrastructure category from ONLY the following allowed values:
   - Roads
   - Drainage
   - Water
   - Healthcare
   - Education
   - Streetlights
   - Waste Management
   - Public Transport
   - Other
2. Identify a descriptive subcategory (e.g., "Stormwater Drainage", "Road Surface Damage", "Street Lighting Failure").
3. Assign an estimated severity on an integer scale of 1 to 10 (1 = minor cosmetic defect, 10 = critical hazard to life/health).
4. Assign an urgency level: "LOW", "MEDIUM", "HIGH", or "CRITICAL".
5. Detect the language used in the citizen's report (e.g., "Tamil", "English", "Hindi", "Telugu", etc.).
6. Extract provided location information:
   - ward: Extract ward number or name if provided (e.g., "Ward 17"), otherwise "N/A".
   - area: Extract locality or landmark (e.g., "Near Government School"), otherwise "Not specified".
7. Identify the primary affected civic group (e.g., "Households", "Commuters", "Pedestrians", "Students", "Patients", "Residents", "Unknown").
8. Summarize the citizen's report factually in clear English (1-2 sentences).
9. Explain your interpretation (reasoning) in 1-2 sentences, detailing how the citizen's input points to this infrastructure category.
10. Suggest a non-binding municipal next step (e.g., "Review stormwater culvert capacity and schedule municipal desilting for the reported corridor").
11. Determine the evidenceType from: "Citizen Report", "Citizen Image", "Citizen Voice", "Citizen Text", or "Multiple Sources".
12. Assign an AI confidence score between 0.0 and 1.0 based on the specificity and clarity of the input.

STRICT CONSTRAINTS (NO HALLUCINATION):
- Do NOT invent government statistics, population figures, budget numbers, or municipal costs.
- Do NOT claim an issue has been officially verified, approved, or resolved.
- Do NOT claim government authorities have taken action.
- Do NOT invent specific GPS coordinates or street addresses not provided by the citizen.
- If information is missing or ambiguous, return conservative estimates and state "Unknown" or "Not specified".
- Do NOT identify individuals, perform facial recognition, or deduce private personal details.
- For image evidence, only describe observable infrastructure conditions using objective phrasing such as "The image appears to show...", "Visual evidence is consistent with...", or "Potentially indicates...". Do NOT state "The image proves...".

Return valid JSON adhering strictly to the requested schema.`;

function parseImageData(dataUrlOrBase64?: string): { mimeType: string; data: string } | null {
  if (!dataUrlOrBase64) return null;

  // Check if it is a data URL (e.g. data:image/jpeg;base64,....)
  const match = dataUrlOrBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    const mimeType = match[1];
    const data = match[2];
    if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(mimeType)) {
      return { mimeType, data };
    }
    return null;
  }

  // Raw base64 string
  return {
    mimeType: "image/jpeg",
    data: dataUrlOrBase64,
  };
}

export async function geminiAnalyzeSignal(
  input: CitizenSignalInput,
  apiKey: string
): Promise<CitizenSignalAnalysis> {
  const ai = new GoogleGenAI({ apiKey });

  // Prepare prompt contents
  const parts: Array<string | { inlineData: { mimeType: string; data: string } }> = [];

  const textComponents = [
    `Citizen Input Details:`,
    `- Source Format: ${input.source || "text"}`,
    input.language ? `- Stated Language: ${input.language}` : `- Stated Language: Auto-detect`,
    input.ward ? `- Target Ward: ${input.ward}` : `- Target Ward: Not specified`,
    input.area ? `- Locality/Landmark: ${input.area}` : `- Locality/Landmark: Not specified`,
    input.category && input.category !== "auto"
      ? `- Pre-selected Category: ${input.category}`
      : `- Pre-selected Category: None (Auto-detect)`,
    input.text ? `\nCitizen Text / Voice Transcript:\n"${input.text}"` : `\nCitizen Text: None provided (Visual image report)`,
  ].join("\n");

  parts.push(textComponents);

  // Multimodal image support
  if (input.image) {
    const imgInfo = parseImageData(input.image);
    if (imgInfo) {
      parts.push({
        inlineData: {
          mimeType: imgInfo.mimeType,
          data: imgInfo.data,
        },
      });
      parts.push(
        "Attached visual evidence: Inspect the image for visible infrastructure distress (e.g. road damage, water stagnation, streetlight defect, waste accumulation). Describe visible observations carefully."
      );
    }
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const fallbackSignalId = input.id || `CIVIQ-SIG-00${randomNum}`;

  // Call Gemini using gemini-2.5-flash
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: parts,
    config: {
      systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      temperature: 0.2, // Low temperature for consistent classification
    },
  });

  const rawText = response.text?.trim();
  if (!rawText) {
    throw new Error("Empty response from Gemini AI");
  }

  // Parse JSON response
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new Error(`Invalid JSON returned by Gemini: ${rawText.slice(0, 100)}`);
  }

  // Ensure signalId is preserved
  if (typeof parsed === "object" && parsed !== null) {
    (parsed as Record<string, unknown>).signalId = fallbackSignalId;
    (parsed as Record<string, unknown>).mode = "gemini";
  }

  // Validate with Zod
  const validation = CitizenSignalAnalysisSchema.safeParse(parsed);
  if (!validation.success) {
    throw new Error(`Schema validation error: ${validation.error.message}`);
  }

  return validation.data;
}
