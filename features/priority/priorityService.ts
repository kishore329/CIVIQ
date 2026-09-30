/**
 * CIVIQ Priority Assessment Service (Phase 6)
 *
 * Connects IssueClusters with Ward Infrastructure Profiles to compute and
 * serve deterministic, explainable priority assessments across the application.
 */

import { DEMO_CLUSTERS } from "@/data/demo/clusters";
import { getWardInfrastructureProfile } from "@/features/infrastructure/infrastructureService";
import { assessClusterPriority } from "./priorityEngine";
import {
  PriorityAssessment,
  PriorityKPISummary,
  PriorityAttentionBand,
} from "./priorityTypes";

export interface PriorityFilterOptions {
  ward?: string;
  category?: string;
  attentionBand?: string;
  status?: string;
  search?: string;
}

// Compute assessments deterministically for all demo clusters
const COMPUTED_ASSESSMENTS: PriorityAssessment[] = DEMO_CLUSTERS.map((cluster) => {
  const profile = getWardInfrastructureProfile(cluster.ward);
  return assessClusterPriority(cluster, profile);
}).sort((a, b) => b.priorityIndex - a.priorityIndex);

export function getAllPriorityAssessments(): PriorityAssessment[] {
  return COMPUTED_ASSESSMENTS;
}

export function getPriorityAssessmentById(id: string): PriorityAssessment | undefined {
  return COMPUTED_ASSESSMENTS.find(
    (a) => a.id === id || a.clusterId === id || a.clusterCode === id
  );
}

export function getTopPriorityAssessments(limit: number = 5): PriorityAssessment[] {
  return COMPUTED_ASSESSMENTS.slice(0, limit);
}

export function getPriorityKPIs(): PriorityKPISummary {
  const total = COMPUTED_ASSESSMENTS.length;
  const highAttention = COMPUTED_ASSESSMENTS.filter(
    (a) => a.attentionBand === "High Attention" || a.attentionBand === "Very High Attention"
  ).length;

  const avgScore =
    total > 0
      ? Math.round(
          COMPUTED_ASSESSMENTS.reduce((sum, a) => sum + a.priorityIndex, 0) / total
        )
      : 0;

  const totalPop = COMPUTED_ASSESSMENTS.reduce(
    (sum, a) => sum + a.affectedPopulation,
    0
  );

  return {
    totalPriorityClusters: total,
    highAttentionCount: highAttention,
    averagePriorityIndex: avgScore,
    totalAffectedPopulation: totalPop,
    topAttentionCategory: COMPUTED_ASSESSMENTS[0]?.category || "Drainage",
  };
}

export function filterPriorityAssessments(
  assessments: PriorityAssessment[],
  filters: PriorityFilterOptions
): PriorityAssessment[] {
  return assessments.filter((item) => {
    if (filters.ward && filters.ward !== "all" && item.ward !== filters.ward) {
      return false;
    }
    if (filters.category && filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    if (
      filters.attentionBand &&
      filters.attentionBand !== "all" &&
      item.attentionBand !== filters.attentionBand
    ) {
      return false;
    }
    if (filters.status && filters.status !== "all" && item.reviewStatus !== filters.status) {
      return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.clusterCode.toLowerCase().includes(q);
      const matchArea = item.area.toLowerCase().includes(q);
      const matchSubcat = item.subcategory.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchArea && !matchSubcat) {
        return false;
      }
    }
    return true;
  });
}
