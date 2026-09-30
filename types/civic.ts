// ─── Core Enumerations ───────────────────────────────────────────────────────

export type SeverityLevel = "low" | "medium" | "high" | "critical";
export type DemandLevel = "Low" | "Medium" | "High";
export type PriorityLevel = "Low" | "Medium" | "High" | "Critical";
export type ProjectStatus =
  | "approved"
  | "in_progress"
  | "under_review"
  | "planned"
  | "completed"
  | "draft";

// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Ward {
  id: string;
  code: string;
  name: string;
  constituency: string;
  population: number;
  citizenSignals: number;
  infrastructureGap: number; // percentage 0–100
  investmentCoverage: number; // percentage 0–100
  priorityIssueCount: number;
  topIssue: string;
  demandLevel: DemandLevel;
  priorityLevel: PriorityLevel;
  trend: string;
  gridArea?: {
    col: number;
    row: number;
    colSpan?: number;
    rowSpan?: number;
  };
  // Extended / legacy fields (optional)
  areaKm2?: number;
  vulnerabilityIndex?: number;
  activeIssuesCount?: number;
}

export interface CitizenSignal {
  id: string;
  trackingNumber: string;
  category: string;
  description: string;
  ward: string;
  language: string;
  severity: SeverityLevel;
  timestamp: string;
  status: "received" | "clustered" | "verified" | "escalated";
  location?: string;
  upvotes?: number;
  // Extended fields for richer signal feeds
  channel?: string;
  originalLanguage?: string;
  translatedText?: string;
  rawExcerpt?: string;
  wardName?: string;
  wardId?: string;
  locationDescription?: string;
  duplicateClusterCount?: number;
  upvotesCount?: number;
  coordinates?: { lat: number; lng: number };
}

// ─── Phase 3: Citizen Signal Submission Types ─────────────────────────────────

export type SignalStatus =
  | "received"
  | "analyzed"
  | "clustered"
  | "under_review"
  | "validated"
  | "resolved";

export type SignalSource = "text" | "voice" | "image";

export type SignalInputLanguage =
  | "auto"
  | "english"
  | "tamil"
  | "hindi"
  | "telugu"
  | "kannada"
  | "malayalam"
  | "bengali";

export interface AIAnalysisResult {
  category: string;
  subcategory: string;
  severity: SeverityLevel;
  severityScore?: number; // 1-10 integer
  urgency: SeverityLevel;
  language: string;
  ward: string;
  affectedGroup: string;
  summary: string;
  confidence: number; // 0–1
  reasoning?: string;
  recommendedNextStep?: string;
  evidenceType?: string;
  mode?: "gemini" | "demo";
  location?: {
    ward: string;
    area: string;
  };
}

export interface CiviqSignal {
  id: string;
  signalId: string; // e.g. CIVIQ-SIG-001283
  source: SignalSource;
  text?: string;
  language: SignalInputLanguage;
  category: string; // "auto" or specific
  subcategory?: string;
  severity?: SeverityLevel;
  urgency?: SeverityLevel;
  ward: string;
  area?: string;
  imageUrl?: string;
  transcript?: string;
  aiAnalysis?: AIAnalysisResult;
  confidence?: number;
  clusterId?: string;
  status: SignalStatus;
  timestamp: string;
}

export interface InfrastructureIssue {
  id: string;
  code: string;
  category: string;
  ward: string;
  title: string;
  reportCount: number;
  severity: SeverityLevel;
  affectedPopulation: number;
  status:
    | "investigating"
    | "engineering_review"
    | "prioritized"
    | "scheduled"
    | "resolved";
  clusterRisk: "moderate" | "severe" | "critical";
  // Extended fields
  wardId?: string;
  wardName?: string;
  citizenSignalsCount?: number;
  duplicateReportsCount?: number;
  estimatedAffectedPopulation?: number;
  firstReportedDate?: string;
  lastSignalDate?: string;
  urgencyScore?: number;
  infrastructureRisk?: "moderate" | "severe" | "critical";
  location?: { address: string; lat: number; lng: number };
}

export interface ClusterSignalRef {
  id: string;
  signalId: string;
  source: "text" | "voice" | "image";
  language: string;
  excerpt: string;
  timestamp: string;
  similarityScore: number;
}

export interface IssueCluster {
  id: string;
  clusterCode: string; // e.g. "CLUST-W17-DRN-01"
  title: string;
  category: string;
  subcategory: string;
  ward: string;
  wardName: string;
  area: string;
  signalCount: number;
  affectedPopulation: number;
  severity: SeverityLevel;
  severityScore: number; // 1-10
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "investigating" | "engineering_review" | "prioritized" | "scheduled" | "resolved";
  clusterRisk: "moderate" | "severe" | "critical";
  isHighPriority: boolean;
  semanticSimilarity: number; // e.g. 0.94
  growthVelocity: string; // e.g. "+24% this week"
  signals: ClusterSignalRef[];
  aiSynthesis: string;
  recommendedIntervention: string;
  firstReported: string;
  lastReported: string;
  // Phase 6 Priority Integration
  priorityAssessmentId?: string;
  priorityIndex?: number;
  priorityBand?: string;
  priorityConfidence?: number;
}

export interface ClusteringPipelineStats {
  totalSignals: number;
  aiClassifiedCount: number;
  clusteredIssuesCount: number;
  highPriorityClustersCount: number;
  totalAffectedPopulation: number;
  compressionRatio: string;
  avgSimilarityConfidence: number;
}

export interface DevelopmentProject {
  id: string;
  code: string;
  name: string;
  category: string;
  ward: string;
  priorityIndex: number; // 0–100
  affectedPopulation: number;
  evidenceCount: number;
  estimatedCost: number;
  status: string; // e.g. "AI-assisted recommendation"
  urgency: SeverityLevel;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  relatedWard: string;
  evidence: {
    reportCount: number;
    infrastructureGap: number;
    investmentCoverage: number;
  };
  type: string;
  confidence: number;
  groundingSources: string[];
  // Extended fields for richer insight cards
  headline?: string;
  category?: string;
  timestamp?: string;
  confidenceScore?: number;
  summaryText?: string;
  keyDrivers?: string[];
  recommendedIntervention?: string;
  affectedWards?: string[];
  evidenceCount?: number;
}

// ─── Metric / Overview Types ──────────────────────────────────────────────────

export interface MetricOverview {
  totalCitizenSignals: number;
  citizenSignalsGrowthPct: number;
  infrastructureIssuesCount: number;
  criticalIssuesCount: number;
  priorityProjectsCount: number;
  approvedProjectsCount: number;
  totalPopulationAffected: number;
  constituencyCoveragePct: number;
}

export interface PriorityProject {
  id: string;
  projectCode: string;
  title: string;
  shortSummary: string;
  category: string;
  wardId: string;
  wardName: string;
  priorityScore: number;
  estimatedCostUSD: number;
  beneficiariesCount: number;
  status: ProjectStatus | string;
  urgencyLevel: SeverityLevel;
  readinessLevel: string;
  primaryEvidence: string;
  citizenDemandIndex: number;
}

// ─── Chart / Visualisation Types ─────────────────────────────────────────────

export interface InfrastructureDemandItem {
  category: string;
  percentage: number;
  signalCount: number;
  color: string;
}

export interface TrendDataPoint {
  day: string;
  date: string;
  signals: number;
  critical: number;
}

export interface DashboardStats {
  citizenSignals: number;
  citizenSignalsDelta: string;
  infrastructureIssues: number;
  highPriorityClusters: number;
  priorityProjects: number;
  requireReviewCount: number;
  populationAffected: number;
  wardCount: number;
}
