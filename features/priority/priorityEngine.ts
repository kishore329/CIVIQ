/**
 * CIVIQ Transparent Priority Engine (Phase 6)
 *
 * Implements deterministic calculation:
 * Priority Index = sum(normalized_factor * weight)
 *
 * NO Math.random(). NO arbitrary values.
 * All factors normalized strictly between 0 and 100.
 */

import { IssueCluster } from "@/types/civic";
import { InfrastructureProfile } from "@/features/infrastructure/infrastructureTypes";
import { calculateInfrastructureGap } from "@/features/infrastructure/gapEngine";
import {
  PriorityFactors,
  PriorityWeightedContributions,
  PriorityAssessment,
  PriorityAttentionBand,
} from "./priorityTypes";
import { PRIORITY_WEIGHTS } from "./priorityWeights";

/**
 * Normalizes citizen demand into a 0–100 scale using logarithmic scaling
 * to ensure high responsiveness without disproportionate outlier distortion.
 */
export function calculateCitizenDemandScore(signalCount: number): number {
  if (signalCount <= 0) return 0;
  // 10 signals ~ 40, 50 signals ~ 60, 150 signals ~ 75, 300+ signals ~ 85-95
  const normalized = Math.min(100, Math.round(20 * Math.log2(signalCount + 1)));
  return Math.max(10, Math.min(100, normalized));
}

/**
 * Normalizes population impact relative to the ward demographic scale.
 */
export function calculatePopulationImpactScore(
  affectedPop: number,
  wardPop: number
): number {
  if (affectedPop <= 0 || wardPop <= 0) return 20;
  const ratio = affectedPop / wardPop;
  // If > 25% of ward affected => 85+, 10-25% => 65-85, <10% => 40-65
  const rawScore = Math.round(ratio * 200 + 35);
  return Math.max(10, Math.min(100, rawScore));
}

/**
 * Calculates evidence strength combining report count, source diversity, and semantic similarity.
 */
export function calculateEvidenceStrengthScore(cluster: IssueCluster): number {
  let score = 50;

  // Signal volume contribution (up to 20 pts)
  if (cluster.signalCount > 200) score += 20;
  else if (cluster.signalCount > 100) score += 15;
  else if (cluster.signalCount > 30) score += 10;

  // Source diversity contribution (up to 15 pts)
  const sources = new Set(cluster.signals.map((s) => s.source));
  if (sources.size >= 3) score += 15;
  else if (sources.size === 2) score += 10;
  else score += 5;

  // Semantic similarity bonus (up to 15 pts)
  score += Math.round((cluster.semanticSimilarity || 0.8) * 15);

  return Math.max(10, Math.min(100, score));
}

/**
 * Normalizes urgency string into 0–100 scale.
 */
export function calculateUrgencyScore(urgency: string): number {
  switch (urgency.toUpperCase()) {
    case "CRITICAL":
      return 95;
    case "HIGH":
      return 75;
    case "MEDIUM":
      return 55;
    case "LOW":
    default:
      return 35;
  }
}

/**
 * Normalizes investment gap into 0–100 scale based on required vs existing+planned capital.
 */
export function calculateInvestmentGapScore(profile: InfrastructureProfile): number {
  const committed = profile.existingInvestment + profile.plannedInvestment;
  const deficit = Math.max(0, profile.requiredInvestment - committed);
  const ratio = deficit / Math.max(1, profile.requiredInvestment);
  const rawScore = Math.round(ratio * 80 + 20);
  return Math.max(10, Math.min(100, rawScore));
}

/**
 * Assigns descriptive attention bands according to the calculated index.
 */
export function getAttentionBand(score: number): PriorityAttentionBand {
  if (score >= 90) return "Very High Attention";
  if (score >= 75) return "High Attention";
  if (score >= 60) return "Elevated Attention";
  if (score >= 40) return "Moderate Attention";
  return "Lower Attention";
}

/**
 * Evaluates primary drivers for human-readable evidence summaries.
 */
function identifyPrimaryDrivers(
  contributions: PriorityWeightedContributions
): string[] {
  const sorted = Object.entries(contributions).sort(([, a], [, b]) => b - a);
  const driverLabels: Record<string, string> = {
    citizenDemand: "high citizen report frequency",
    infrastructureGap: "significant infrastructure deficit",
    severity: "acute physical severity",
    urgency: "near-term temporal urgency",
    populationImpact: "broad population impact",
    vulnerability: "demographic vulnerability context",
    investmentGap: "historical capital under-investment",
    evidenceStrength: "multi-channel verification",
  };
  return sorted.slice(0, 3).map(([key]) => driverLabels[key] || key);
}

/**
 * Core Assessment Function: Evaluates an IssueCluster against its Ward Infrastructure Profile.
 */
export function assessClusterPriority(
  cluster: IssueCluster,
  profile: InfrastructureProfile
): PriorityAssessment {
  // 1. Calculate each normalized factor (0–100)
  const citizenDemand = calculateCitizenDemandScore(cluster.signalCount);
  const gapResult = calculateInfrastructureGap(cluster.category, profile);
  const infrastructureGap = gapResult.gapIndex;
  const severity = Math.min(100, Math.max(10, cluster.severityScore * 10));
  const urgency = calculateUrgencyScore(cluster.urgency);
  const populationImpact = calculatePopulationImpactScore(
    cluster.affectedPopulation,
    profile.population
  );
  const vulnerability = profile.vulnerabilityIndex;
  const investmentGap = calculateInvestmentGapScore(profile);
  const evidenceStrength = calculateEvidenceStrengthScore(cluster);

  const factors: PriorityFactors = {
    citizenDemand,
    infrastructureGap,
    severity,
    urgency,
    populationImpact,
    vulnerability,
    investmentGap,
    evidenceStrength,
  };

  // 2. Calculate exact weighted contributions: factor * weight
  const weightedContributions: PriorityWeightedContributions = {
    citizenDemand: Math.round(citizenDemand * PRIORITY_WEIGHTS.citizenDemand * 100) / 100,
    infrastructureGap: Math.round(infrastructureGap * PRIORITY_WEIGHTS.infrastructureGap * 100) / 100,
    severity: Math.round(severity * PRIORITY_WEIGHTS.severity * 100) / 100,
    urgency: Math.round(urgency * PRIORITY_WEIGHTS.urgency * 100) / 100,
    populationImpact: Math.round(populationImpact * PRIORITY_WEIGHTS.populationImpact * 100) / 100,
    vulnerability: Math.round(vulnerability * PRIORITY_WEIGHTS.vulnerability * 100) / 100,
    investmentGap: Math.round(investmentGap * PRIORITY_WEIGHTS.investmentGap * 100) / 100,
    evidenceStrength: Math.round(evidenceStrength * PRIORITY_WEIGHTS.evidenceStrength * 100) / 100,
  };

  // 3. Compute final Priority Index (Sum of contributions, rounded)
  const sumContribution = Object.values(weightedContributions).reduce(
    (acc, val) => acc + val,
    0
  );
  const priorityIndex = Math.min(100, Math.max(0, Math.round(sumContribution)));
  const attentionBand = getAttentionBand(priorityIndex);

  // 4. Input consistency confidence score
  const confidence = Math.min(
    0.95,
    Math.round(((evidenceStrength + cluster.semanticSimilarity * 100) / 200) * 100) / 100
  );

  const primaryDrivers = identifyPrimaryDrivers(weightedContributions);

  return {
    id: `pa-${cluster.id}`,
    clusterId: cluster.id,
    clusterCode: cluster.clusterCode,
    title: cluster.title,
    category: cluster.category,
    subcategory: cluster.subcategory,
    ward: cluster.ward,
    wardName: cluster.wardName,
    area: cluster.area,
    priorityIndex,
    attentionBand,
    factors,
    weightedContributions,
    weights: PRIORITY_WEIGHTS,
    confidence,
    recommendation: "Requires Human Review",
    reviewStatus: "Requires Review",
    signalCount: cluster.signalCount,
    affectedPopulation: cluster.affectedPopulation,
    aiSynthesis: cluster.aiSynthesis,
    recommendedNextStep: cluster.recommendedIntervention,
    evidenceChain: {
      rawSignalsCount: cluster.signalCount,
      clusterTitle: cluster.title,
      infrastructureGap,
      populationImpact,
      priorityScore: priorityIndex,
      primaryDrivers,
    },
    lastUpdated: cluster.lastReported,
  };
}
