/**
 * CIVIQ Signal Analysis Abstraction Layer (Phase 4)
 *
 * Calls CIVIQ's secure server-side API (/api/analyze-signal) powered by Gemini,
 * with seamless fallback to deterministic mock analysis if offline or unconfigured.
 */

import { AIAnalysisResult, SeverityLevel } from "@/types/civic";

export interface SignalInput {
  text?: string;
  language: string;
  ward: string;
  area?: string;
  category: string;
  source?: "text" | "voice" | "image";
  image?: string | null;
  imageAttached?: boolean;
  voiceTranscript?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapSeverityScoreToLevel(score: number): SeverityLevel {
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function mapUrgencyToLevel(urgency: string): SeverityLevel {
  const u = urgency.toLowerCase();
  if (u === "critical" || u === "high") return "high";
  if (u === "medium") return "medium";
  return "low";
}

// ─── Deterministic Mock Fallback ─────────────────────────────────────────────

const CATEGORY_RULES: Array<{
  keywords: string[];
  category: string;
  subcategory: string;
  affectedGroup: string;
  baseSeverity: number;
}> = [
  {
    keywords: ["drain", "flood", "water accumulation", "overflow", "stormwater", "waterlogged", "rain", "தண்ணீர்", "வெள்ளம்", "बाढ़"],
    category: "Drainage",
    subcategory: "Stormwater Drainage",
    affectedGroup: "Households",
    baseSeverity: 8,
  },
  {
    keywords: ["road", "pothole", "sinkhole", "crack", "asphalt", "pavement", "broken road", "தார்சாலை", "गड्ढा"],
    category: "Roads",
    subcategory: "Road Surface Damage",
    affectedGroup: "Commuters",
    baseSeverity: 7,
  },
  {
    keywords: ["water supply", "pipeline", "tap", "pressure", "contamination", "drinking water", "குழாய்", "पानी"],
    category: "Water",
    subcategory: "Water Supply Disruption",
    affectedGroup: "Households",
    baseSeverity: 7,
  },
  {
    keywords: ["streetlight", "light", "dark", "lamp", "broken light", "மின்சாரம்", "street lamp"],
    category: "Streetlights",
    subcategory: "Street Lighting Failure",
    affectedGroup: "Pedestrians",
    baseSeverity: 6,
  },
  {
    keywords: ["waste", "garbage", "trash", "dump", "sanitation", "கழிவு", "कचरा"],
    category: "Waste Management",
    subcategory: "Waste Collection",
    affectedGroup: "Residents",
    baseSeverity: 6,
  },
  {
    keywords: ["hospital", "health", "clinic", "medicine", "doctor"],
    category: "Healthcare",
    subcategory: "Healthcare Access",
    affectedGroup: "Patients",
    baseSeverity: 7,
  },
  {
    keywords: ["school", "education", "classroom", "teacher", "learning"],
    category: "Education",
    subcategory: "Educational Infrastructure",
    affectedGroup: "Students",
    baseSeverity: 6,
  },
  {
    keywords: ["bus", "transport", "transit", "shelter", "stop", "பேருந்து"],
    category: "Public Transport",
    subcategory: "Public Transport Connectivity",
    affectedGroup: "Commuters",
    baseSeverity: 5,
  },
];

const LANGUAGE_DISPLAY: Record<string, string> = {
  tamil: "Tamil",
  hindi: "Hindi",
  telugu: "Telugu",
  kannada: "Kannada",
  malayalam: "Malayalam",
  bengali: "Bengali",
  english: "English",
  auto: "Auto-detected",
};

function detectCategory(text: string): { category: string; subcategory: string; affectedGroup: string; baseSeverity: number } {
  const lower = text.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return {
        category: rule.category,
        subcategory: rule.subcategory,
        affectedGroup: rule.affectedGroup,
        baseSeverity: rule.baseSeverity,
      };
    }
  }
  return {
    category: "Other",
    subcategory: "General Infrastructure Observation",
    affectedGroup: "Residents",
    baseSeverity: 4,
  };
}

function detectSeverity(text: string): SeverityLevel {
  const lower = text.toLowerCase();
  if (
    lower.includes("danger") ||
    lower.includes("emergency") ||
    lower.includes("severe") ||
    lower.includes("hazard") ||
    lower.includes("urgent") ||
    lower.includes("flooding into homes") ||
    lower.includes("life")
  ) {
    return "high";
  }
  if (
    lower.includes("broken") ||
    lower.includes("pothole") ||
    lower.includes("overflow") ||
    lower.includes("blocking") ||
    lower.includes("no light")
  ) {
    return "high";
  }
  return "medium";
}

function detectUrgency(severity: SeverityLevel, category: string): SeverityLevel {
  if (severity === "critical" || severity === "high") return "high";
  if (category === "Drainage" || category === "Roads") return "high";
  return "medium";
}

function detectLanguageFromText(text: string): string {
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";
  return "English";
}

function generateSummary(
  category: string,
  subcategory: string,
  language: string,
  area?: string
): string {
  const locStr = area ? ` near ${area}` : "";
  switch (category) {
    case "Drainage":
      return `Citizen reports recurring water accumulation during rainfall${locStr}, indicating a potential stormwater drainage issue requiring infrastructure intervention.`;
    case "Roads":
      return `Citizen reports significant road surface deterioration and potholes${locStr}, creating traffic hazards and requiring priority maintenance.`;
    case "Streetlights":
      return `Citizen reports non-functional street lighting${locStr}, posing nighttime safety risks for pedestrians and commuters.`;
    case "Water":
      return `Citizen reports disruption in piped water supply${locStr}, requiring municipal pressure testing and valve inspection.`;
    case "Waste Management":
      return `Citizen reports uncollected municipal solid waste${locStr}, requiring immediate sanitation clearance.`;
    default:
      return `Citizen submitted an infrastructure observation${locStr} regarding ${subcategory.toLowerCase()}. Verified for municipal review.`;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Analyze a citizen signal via CIVIQ's secure server-side Gemini API.
 * Gracefully falls back to deterministic local analysis if the network or API fails.
 */
export async function analyzeCitizenSignal(input: SignalInput): Promise<AIAnalysisResult> {
  try {
    const payload = {
      text: input.text || input.voiceTranscript || undefined,
      language: input.language,
      ward: input.ward,
      area: input.area,
      category: input.category,
      source: input.source || (input.image ? "image" : input.voiceTranscript ? "voice" : "text"),
      image: input.image || undefined,
    };

    const res = await fetch("/api/analyze-signal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        const d = json.data;
        const sevLevel = mapSeverityScoreToLevel(d.severity);
        const urgLevel = mapUrgencyToLevel(d.urgency);

        return {
          category: d.category,
          subcategory: d.subcategory,
          severity: sevLevel,
          severityScore: d.severity,
          urgency: urgLevel,
          language: d.language,
          ward: (d.location?.ward || input.ward).replace(/[^0-9]/g, "") || "N/A",
          affectedGroup: d.affectedGroup,
          summary: d.summary,
          confidence: d.confidence,
          reasoning: d.reasoning,
          recommendedNextStep: d.recommendedNextStep,
          evidenceType: d.evidenceType,
          mode: d.mode || "gemini",
          location: d.location,
        };
      }
    }
  } catch (err) {
    console.warn("[CIVIQ] Network error calling /api/analyze-signal, using local fallback", err);
  }

  // Local fallback
  return mockAIAnalysis(input);
}

async function mockAIAnalysis(input: SignalInput): Promise<AIAnalysisResult> {
  // Natural delay for realistic experience
  await new Promise((r) => setTimeout(r, 1400));

  const fullText = [input.text, input.voiceTranscript, input.area].filter(Boolean).join(" ");

  let category: string;
  let subcategory: string;
  let affectedGroup: string;
  let baseSev = 6;

  if (input.category && input.category !== "auto") {
    const matched = CATEGORY_RULES.find(
      (r) => r.category.toLowerCase() === input.category.toLowerCase()
    );
    category = input.category;
    subcategory = matched?.subcategory ?? `${input.category} Infrastructure`;
    affectedGroup = matched?.affectedGroup ?? "Residents";
    baseSev = matched?.baseSeverity ?? 6;
  } else {
    const detected = detectCategory(fullText);
    category = detected.category;
    subcategory = detected.subcategory;
    affectedGroup = detected.affectedGroup;
    baseSev = detected.baseSeverity;
  }

  const severity = detectSeverity(fullText);
  const urgency = detectUrgency(severity, category);

  let resolvedLanguage: string;
  if (input.language === "auto") {
    resolvedLanguage = detectLanguageFromText(fullText);
  } else {
    resolvedLanguage = LANGUAGE_DISPLAY[input.language] ?? input.language;
  }

  const summary = generateSummary(category, subcategory, resolvedLanguage, input.area);

  let confidence = 0.88;
  if (fullText.length > 50) confidence += 0.04;
  if (input.imageAttached || input.image) confidence += 0.04;
  if (input.voiceTranscript) confidence += 0.02;
  confidence = Math.min(confidence, 0.96);

  const wardNum = input.ward.replace(/[^0-9]/g, "") || "N/A";
  const sevScore = severity === "high" || severity === "critical" ? Math.max(baseSev, 8) : baseSev;

  return {
    category,
    subcategory,
    severity,
    severityScore: sevScore,
    urgency,
    language: resolvedLanguage,
    ward: wardNum,
    affectedGroup,
    summary,
    confidence: Math.round(confidence * 100) / 100,
    reasoning: `Analysis identified indicators of ${subcategory.toLowerCase()} affecting ${affectedGroup.toLowerCase()}.`,
    recommendedNextStep: `Review infrastructure records and schedule engineering verification for ${input.area || `Ward ${wardNum}`}.`,
    evidenceType: input.image ? "Citizen Image" : input.voiceTranscript ? "Citizen Voice" : "Citizen Text",
    mode: "demo",
    location: {
      ward: `Ward ${wardNum}`,
      area: input.area || "Not specified",
    },
  };
}
