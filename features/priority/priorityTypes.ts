/**
 * CIVIQ Transparent Priority Engine Types (Phase 6)
 *
 * Implements full explainability data models for AI-Assisted Priority Index.
 * All assessments are advisory decision-support outputs requiring human review.
 */

import { SeverityLevel } from "@/types/civic";

export type PriorityAttentionBand =
  | "Very High Attention"
  | "High Attention"
  | "Elevated Attention"
  | "Moderate Attention"
  | "Lower Attention";

export interface PriorityFactors {
  citizenDemand: number;       // 0–100 (volume, velocity, channel corroboration)
  infrastructureGap: number;   // 0–100 (100 - baseline coverage)
  severity: number;            // 0–100 (structural & hazard depth)
  urgency: number;             // 0–100 (temporal necessity)
  populationImpact: number;    // 0–100 (affected population relative to ward)
  vulnerability: number;       // 0–100 (demographic sensitivity context)
  investmentGap: number;       // 0–100 (capital deficit ratio)
  evidenceStrength: number;    // 0–100 (multi-source diversity & temporal consistency)
}

export type PriorityWeightedContributions = Record<keyof PriorityFactors, number>;

export type PriorityWeights = Record<keyof PriorityFactors, number>;

export interface PriorityEvidenceChain {
  rawSignalsCount: number;
  clusterTitle: string;
  infrastructureGap: number;
  populationImpact: number;
  priorityScore: number;
  primaryDrivers: string[];
}

export interface PriorityAssessment {
  id: string;
  clusterId: string;
  clusterCode: string;
  title: string;
  category: string;
  subcategory: string;
  ward: string;
  wardName: string;
  area: string;

  // The Primary Explainable Metric (0–100)
  priorityIndex: number;
  attentionBand: PriorityAttentionBand;

  // Granular Explainability
  factors: PriorityFactors;
  weightedContributions: PriorityWeightedContributions;
  weights: PriorityWeights;

  confidence: number; // 0–1 (Input consistency confidence, NOT accuracy)
  recommendation: "Requires Human Review";
  reviewStatus: "Requires Review" | "Under Review" | "Reviewed" | "Archived";

  // Contextual metadata
  signalCount: number;
  affectedPopulation: number;
  aiSynthesis: string;
  recommendedNextStep: string;
  evidenceChain: PriorityEvidenceChain;
  lastUpdated: string;
}

export interface PriorityKPISummary {
  totalPriorityClusters: number;
  highAttentionCount: number;
  averagePriorityIndex: number;
  totalAffectedPopulation: number;
  topAttentionCategory: string;
}
