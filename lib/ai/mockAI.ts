/**
 * Deterministic Mock AI Engine for CIVIQ (Phase 4 Fallback)
 *
 * Activated automatically when GEMINI_API_KEY is not configured,
 * when rate limits or network issues occur, or during offline testing.
 */

import {
  CitizenSignalInput,
  CitizenSignalAnalysis,
  CivicCategory,
  UrgencyLevel,
  EvidenceType,
} from "./schemas";

interface CategoryRule {
  keywords: string[];
  category: CivicCategory;
  subcategory: string;
  affectedGroup: string;
  baseSeverity: number; // 1-10
  baseUrgency: UrgencyLevel;
  nextStep: string;
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    keywords: [
      "drain",
      "flood",
      "water accumulation",
      "overflow",
      "stormwater",
      "waterlogged",
      "rain",
      "water stagnation",
      "stagnant water",
      "தண்ணீர்",
      "வெள்ளம்",
      "வடிகால்",
      "பாசி",
      "बाढ़",
      "जलभराव",
    ],
    category: "Drainage",
    subcategory: "Stormwater Drainage",
    affectedGroup: "Households",
    baseSeverity: 8,
    baseUrgency: "HIGH",
    nextStep: "Review stormwater culvert capacity and schedule municipal desilting for the reported corridor.",
  },
  {
    keywords: [
      "road",
      "pothole",
      "sinkhole",
      "crack",
      "asphalt",
      "pavement",
      "broken road",
      "tar road",
      "தார்சாலை",
      "பள்ளம்",
      "சாலை",
      "गड्ढा",
      "सड़क",
    ],
    category: "Roads",
    subcategory: "Road Surface Damage",
    affectedGroup: "Commuters",
    baseSeverity: 7,
    baseUrgency: "HIGH",
    nextStep: "Dispatch road inspection team to assess pavement depression depth and schedule asphalt patching.",
  },
  {
    keywords: [
      "water supply",
      "drinking water",
      "pipeline",
      "tap",
      "pressure",
      "contamination",
      "leakage",
      "குழாய்",
      "குடிநீர்",
      "தண்ணீர் விநியோகம்",
      "पानी",
      "पेयजल",
    ],
    category: "Water",
    subcategory: "Water Supply Disruption",
    affectedGroup: "Households",
    baseSeverity: 7,
    baseUrgency: "MEDIUM",
    nextStep: "Cross-reference municipal valve telemetry and test local distribution pipeline pressure.",
  },
  {
    keywords: [
      "streetlight",
      "street light",
      "light",
      "dark",
      "lamp",
      "broken light",
      "bulb",
      "மின்விளக்கு",
      "தெருவிளக்கு",
      "வெளிச்சம்",
      "இருட்டு",
      "बिजली",
      "स्ट्रीट लाइट",
    ],
    category: "Streetlights",
    subcategory: "Street Lighting Failure",
    affectedGroup: "Pedestrians",
    baseSeverity: 6,
    baseUrgency: "MEDIUM",
    nextStep: "Schedule electrical maintenance inspection for feeder pillar circuit in the reported sector.",
  },
  {
    keywords: [
      "waste",
      "garbage",
      "trash",
      "dump",
      "sanitation",
      "bin",
      "smell",
      "odour",
      "debris",
      "கழிவு",
      "குப்பை",
      "துப்புரவு",
      "कचरा",
      "गंदगी",
    ],
    category: "Waste Management",
    subcategory: "Solid Waste Accumulation",
    affectedGroup: "Residents",
    baseSeverity: 6,
    baseUrgency: "MEDIUM",
    nextStep: "Alert zonal conservancy contractor for priority compactor bin clearance.",
  },
  {
    keywords: [
      "hospital",
      "clinic",
      "health",
      "doctor",
      "medicine",
      "primary healthcare",
      "phc",
      "ambulance",
      "மருத்துவமனை",
      "சுகாதாரம்",
      "மருந்து",
      "अस्पताल",
      "स्वास्थ्य",
    ],
    category: "Healthcare",
    subcategory: "Primary Healthcare Access",
    affectedGroup: "Patients",
    baseSeverity: 7,
    baseUrgency: "HIGH",
    nextStep: "Evaluate distance to nearest urban primary health centre and mobile health unit routing.",
  },
  {
    keywords: [
      "school",
      "classroom",
      "teacher",
      "education",
      "student",
      "playground",
      "பள்ளி",
      "கல்வி",
      "மாணவர்",
      "स्कूल",
      "शिक्षा",
    ],
    category: "Education",
    subcategory: "Educational Infrastructure",
    affectedGroup: "Students",
    baseSeverity: 6,
    baseUrgency: "MEDIUM",
    nextStep: "Submit facility assessment request to municipal school infrastructure division.",
  },
  {
    keywords: [
      "bus",
      "transit",
      "transport",
      "bus stop",
      "shelter",
      "traffic",
      "பேருந்து",
      "போக்குவரத்து",
      "बस",
      "परिवहन",
    ],
    category: "Public Transport",
    subcategory: "Transit Connectivity",
    affectedGroup: "Commuters",
    baseSeverity: 5,
    baseUrgency: "MEDIUM",
    nextStep: "Coordinate with transport corporation regarding route frequency and shelter condition.",
  },
];

const LANGUAGE_PATTERNS: Array<{ lang: string; test: RegExp }> = [
  { lang: "Tamil", test: /[\u0B80-\u0BFF]/ },
  { lang: "Hindi", test: /[\u0900-\u097F]/ },
  { lang: "Telugu", test: /[\u0C00-\u0C7F]/ },
  { lang: "Kannada", test: /[\u0C80-\u0CFF]/ },
  { lang: "Malayalam", test: /[\u0D00-\u0D7F]/ },
  { lang: "Bengali", test: /[\u0980-\u09FF]/ },
];

function detectLanguage(text: string, declaredLanguage?: string): string {
  if (declaredLanguage && declaredLanguage !== "auto") {
    const map: Record<string, string> = {
      english: "English",
      tamil: "Tamil",
      hindi: "Hindi",
      telugu: "Telugu",
      kannada: "Kannada",
      malayalam: "Malayalam",
      bengali: "Bengali",
    };
    return map[declaredLanguage.toLowerCase()] ?? declaredLanguage;
  }

  for (const { lang, test } of LANGUAGE_PATTERNS) {
    if (test.test(text)) return lang;
  }
  return "English";
}

function resolveEvidenceType(input: CitizenSignalInput): EvidenceType {
  const hasImg = Boolean(input.image);
  const hasVoice = input.source === "voice";
  const hasText = Boolean(input.text && input.text.trim().length > 0);

  const sourcesCount = [hasImg, hasVoice, hasText].filter(Boolean).length;
  if (sourcesCount > 1) return "Multiple Sources";
  if (hasImg) return "Citizen Image";
  if (hasVoice) return "Citizen Voice";
  if (hasText) return "Citizen Text";
  return "Citizen Report";
}

export async function mockAIAnalyze(input: CitizenSignalInput): Promise<CitizenSignalAnalysis> {
  // Deterministic processing simulation
  const fullText = [input.text, input.area].filter(Boolean).join(" ").trim();
  const lower = fullText.toLowerCase();

  // 1. Language detection
  const detectedLang = detectLanguage(fullText, input.language);

  // 2. Category matching
  let matchedRule: CategoryRule | undefined;

  // Check explicit category first
  if (input.category && input.category !== "auto") {
    matchedRule = CATEGORY_RULES.find(
      (r) => r.category.toLowerCase() === input.category?.toLowerCase()
    );
  }

  // Fallback to keyword scan
  if (!matchedRule) {
    matchedRule = CATEGORY_RULES.find((rule) =>
      rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))
    );
  }

  // 3. Evidence type
  const evidenceType = resolveEvidenceType(input);

  // 4. Default / Ambiguous handling
  const isAmbiguous =
    !matchedRule &&
    (lower.includes("bad") ||
      lower.includes("problem") ||
      lower.includes("issue") ||
      fullText.length < 20);

  const category: CivicCategory = matchedRule ? matchedRule.category : "Other";
  const subcategory = matchedRule
    ? matchedRule.subcategory
    : isAmbiguous
    ? "Unclassified Civic Issue"
    : "General Infrastructure Observation";

  const affectedGroup = matchedRule ? matchedRule.affectedGroup : "Residents";
  const severity = matchedRule ? matchedRule.baseSeverity : 4;
  const urgency = matchedRule ? matchedRule.baseUrgency : "MEDIUM";
  const recommendedNextStep = matchedRule
    ? matchedRule.nextStep
    : "Request additional localized context or photographic evidence from community observers.";

  // 5. Reasoning
  let reasoning = "";
  if (matchedRule) {
    reasoning = `The report describes conditions consistent with ${matchedRule.subcategory.toLowerCase()} affecting local ${affectedGroup.toLowerCase()}.`;
    if (input.image) {
      reasoning += " Visual evidence submitted is consistent with observed infrastructure distress.";
    }
  } else {
    reasoning =
      "Input contains generic descriptions without specific municipal asset mentions; classified conservatively as Other.";
  }

  // 6. Summary
  let summary = "";
  if (matchedRule) {
    summary = `Citizen reports ${matchedRule.subcategory.toLowerCase()} concerns in ${
      input.area ? input.area : "the locality"
    }, indicating potential ${category.toLowerCase()} maintenance needs.`;
  } else {
    summary = `Citizen noted general civic dissatisfaction requiring localized clarification in ${
      input.area || "the ward"
    }.`;
  }

  // 7. Confidence
  let confidence = 0.88;
  if (matchedRule) confidence += 0.05;
  if (input.image) confidence += 0.04;
  if (fullText.length > 50) confidence += 0.02;
  if (category === "Other") confidence = 0.65;
  confidence = Math.min(confidence, 0.98);

  const normalizedWard = (input.ward || "N/A").replace(/ward-/i, "Ward ");
  const normalizedArea = input.area?.trim() || "Not specified";

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const signalId = input.id || `CIVIQ-SIG-00${randomNum}`;

  return {
    signalId,
    category,
    subcategory,
    severity,
    urgency,
    language: detectedLang,
    location: {
      ward: normalizedWard,
      area: normalizedArea,
    },
    affectedGroup,
    summary,
    evidenceType,
    confidence: Math.round(confidence * 100) / 100,
    reasoning,
    recommendedNextStep,
    mode: "demo",
  };
}
