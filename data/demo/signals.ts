/**
 * Demo signal history data for Phase 3 - CIVIQ Citizen Signals.
 * Deterministic synthetic data — do not represent as real government statistics.
 */

import { CiviqSignal, AIAnalysisResult } from "@/types/civic";

const mkAnalysis = (
  category: string,
  subcategory: string,
  severity: AIAnalysisResult["severity"],
  urgency: AIAnalysisResult["urgency"],
  language: string,
  ward: string,
  affectedGroup: string,
  summary: string,
  confidence: number
): AIAnalysisResult => ({
  category, subcategory, severity, urgency, language, ward, affectedGroup, summary, confidence,
});

export const DEMO_SIGNAL_HISTORY: CiviqSignal[] = [
  {
    id: "sh-001",
    signalId: "CIVIQ-SIG-001280",
    source: "voice",
    text: "எங்கள் பகுதியில் மழை பெய்யும் போது தண்ணீர் தேங்குகிறது. வீட்டுக்கு போக முடியவில்லை.",
    transcript: "எங்கள் பகுதியில் மழை பெய்யும் போது தண்ணீர் தேங்குகிறது. வீட்டுக்கு போக முடியவில்லை.",
    language: "tamil",
    category: "Drainage",
    subcategory: "Stormwater Drainage",
    severity: "high",
    urgency: "high",
    ward: "ward-17",
    area: "Near Government School, Sector 4",
    status: "analyzed",
    timestamp: "2026-09-29T08:14:00Z",
    confidence: 0.91,
    aiAnalysis: mkAnalysis(
      "Drainage", "Stormwater Drainage", "high", "high",
      "Tamil", "17", "Households",
      "Citizen reports recurring water accumulation during rainfall near Government School, indicating a stormwater drainage issue requiring infrastructure intervention.",
      0.91
    ),
  },
  {
    id: "sh-002",
    signalId: "CIVIQ-SIG-001281",
    source: "text",
    text: "There is a large pothole on the main road near the bus stop. Vehicles are swerving and it is dangerous.",
    language: "english",
    category: "Roads",
    subcategory: "Road Surface Damage",
    severity: "medium",
    urgency: "medium",
    ward: "ward-08",
    area: "Main Road, Bus Stop 7",
    status: "analyzed",
    timestamp: "2026-09-29T06:42:00Z",
    confidence: 0.85,
    aiAnalysis: mkAnalysis(
      "Roads", "Road Surface Damage", "medium", "medium",
      "English", "8", "Commuters",
      "Citizen reports a significant pothole near the bus stop causing traffic hazards. Structural road damage requiring priority inspection.",
      0.85
    ),
  },
  {
    id: "sh-003",
    signalId: "CIVIQ-SIG-001282",
    source: "image",
    language: "tamil",
    category: "Streetlights",
    subcategory: "Street Lighting Failure",
    severity: "high",
    urgency: "high",
    ward: "ward-04",
    area: "Temple Street, Block 3",
    imageUrl: "/demo/streetlight-issue.jpg",
    status: "under_review",
    timestamp: "2026-09-28T21:18:00Z",
    confidence: 0.78,
    aiAnalysis: mkAnalysis(
      "Streetlights", "Street Lighting Failure", "high", "high",
      "Tamil", "4", "Pedestrians",
      "Image evidence shows multiple non-functional streetlights along Temple Street creating safety concerns for night-time pedestrians.",
      0.78
    ),
  },
  {
    id: "sh-004",
    signalId: "CIVIQ-SIG-001283",
    source: "text",
    text: "The water supply pipeline near our society has been leaking for 3 days. There is no pressure in residential taps.",
    language: "english",
    category: "Water",
    subcategory: "Water Supply Disruption",
    severity: "medium",
    urgency: "medium",
    ward: "ward-09",
    area: "Residential Society Block B",
    status: "analyzed",
    timestamp: "2026-09-28T15:30:00Z",
    confidence: 0.83,
    aiAnalysis: mkAnalysis(
      "Water", "Water Supply Disruption", "medium", "medium",
      "English", "9", "Households",
      "Citizen reports a 3-day pipeline leak causing low water pressure in residential taps. Requires urgent plumbing inspection and repair.",
      0.83
    ),
  },
  {
    id: "sh-005",
    signalId: "CIVIQ-SIG-001279",
    source: "voice",
    text: "हमारे मोहल्ले में कचरा एक हफ्ते से नहीं उठाया गया। बहुत बदबू आ रही है।",
    transcript: "हमारे मोहल्ले में कचरा एक हफ्ते से नहीं उठाया गया। बहुत बदबू आ रही है।",
    language: "hindi",
    category: "Waste Management",
    subcategory: "Waste Collection",
    severity: "medium",
    urgency: "medium",
    ward: "ward-12",
    area: "Colony Road, Sector 7",
    status: "clustered",
    timestamp: "2026-09-28T10:05:00Z",
    confidence: 0.79,
    clusterId: "cluster-wm-012-01",
    aiAnalysis: mkAnalysis(
      "Waste Management", "Waste Collection", "medium", "medium",
      "Hindi", "12", "Residents",
      "Citizen reports one week of uncollected waste causing hygiene concerns. Signal has been clustered with 4 related reports from the same ward.",
      0.79
    ),
  },
  {
    id: "sh-006",
    signalId: "CIVIQ-SIG-001278",
    source: "text",
    text: "Drainage canal near the market overflowed last night. Shops were damaged and the road is blocked.",
    language: "english",
    category: "Drainage",
    subcategory: "Stormwater Drainage",
    severity: "critical",
    urgency: "critical",
    ward: "ward-14",
    area: "Old Market Road, Junction 3",
    status: "validated",
    timestamp: "2026-09-27T23:55:00Z",
    confidence: 0.94,
    aiAnalysis: mkAnalysis(
      "Drainage", "Stormwater Drainage", "critical", "critical",
      "English", "14", "Households",
      "Critical drainage overflow at Old Market Road. Commercial and residential properties affected. Validated and escalated for immediate engineering review.",
      0.94
    ),
  },
];

// ─── Demo content constants ───────────────────────────────────────────────────

export const DEMO_REPORT_TEXT =
  "Our street floods whenever it rains and there is no proper drainage. The water enters our houses and makes it impossible to walk on the road.";

export const DEMO_VOICE_TRANSCRIPT =
  "எங்கள் பகுதியில் மழை பெய்யும் போது தண்ணீர் தேங்குகிறது. வீட்டுக்கு போக முடியவில்லை.";

export const DEMO_SIGNAL_ID_COUNTER = 1284; // next signal will be CIVIQ-SIG-001284

export function generateSignalId(): string {
  const base = DEMO_SIGNAL_ID_COUNTER + Math.floor(Math.random() * 3);
  return `CIVIQ-SIG-${String(base).padStart(6, "0")}`;
}

export function formatSignalTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSignalSourceLabel(source: CiviqSignal["source"]): string {
  return { text: "Text", voice: "Voice", image: "Image" }[source];
}

export function getStatusLabel(status: CiviqSignal["status"]): string {
  return {
    received: "Received",
    analyzed: "Analyzed",
    clustered: "Clustered",
    under_review: "Under Review",
    validated: "Validated",
    resolved: "Resolved",
  }[status];
}

export function getLanguageLabel(lang: string): string {
  return {
    auto: "Auto-detect",
    english: "English",
    tamil: "Tamil",
    hindi: "Hindi",
    telugu: "Telugu",
    kannada: "Kannada",
    malayalam: "Malayalam",
    bengali: "Bengali",
  }[lang] ?? lang;
}
