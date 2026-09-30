import { DEMO_WARDS } from "@/data/demo/wards";
import { DEMO_PROJECTS } from "@/data/demo/projects";
import { DEMO_CITIZEN_SIGNALS } from "@/data/demo/citizenSignals";
import { DEMO_AI_INSIGHTS } from "@/data/demo/insights";
import { DEMO_INFRASTRUCTURE_DEMAND, DEMO_30_DAY_TRENDS } from "@/data/demo/trends";
import {
  DashboardStats,
  DevelopmentProject,
  InfrastructureDemandItem,
  TrendDataPoint,
  CitizenSignal,
  Ward,
  AIInsight,
} from "@/types/civic";

/**
 * Calculates and returns core high-level dashboard metrics.
 * Exactly matches:
 * - Citizen Signals: 5,284 (+12.4% from previous period)
 * - Infrastructure Issues: 127 (23 high-priority clusters)
 * - Priority Projects: 18 (7 require review)
 * - Population Affected: 82,400 (Across 10 wards)
 */
export function getDashboardStats(): DashboardStats {
  const totalSignals = 5284;
  const totalIssues = 127;
  const highPriorityClusters = 23;
  const totalProjects = DEMO_PROJECTS.length; // 18
  const requireReviewCount = 7;
  const populationAffected = 82400;
  const wardCount = DEMO_WARDS.length; // 10

  return {
    citizenSignals: totalSignals,
    citizenSignalsDelta: "+12.4% from previous period",
    infrastructureIssues: totalIssues,
    highPriorityClusters: highPriorityClusters,
    priorityProjects: totalProjects,
    requireReviewCount: requireReviewCount,
    populationAffected: populationAffected,
    wardCount: wardCount,
  };
}

/**
 * Returns top AI-assisted development priorities (default top 5).
 */
export function getTopPriorities(limit: number = 5): DevelopmentProject[] {
  return DEMO_PROJECTS.slice(0, limit);
}

/**
 * Returns all priority projects for pipeline views.
 */
export function getAllProjects(): DevelopmentProject[] {
  return DEMO_PROJECTS;
}

/**
 * Returns categorical infrastructure demand distribution.
 */
export function getInfrastructureDemand(): InfrastructureDemandItem[] {
  return DEMO_INFRASTRUCTURE_DEMAND;
}

/**
 * Returns 30-day temporal trend of citizen signals and critical spikes.
 */
export function getCitizenTrends(): TrendDataPoint[] {
  return DEMO_30_DAY_TRENDS;
}

/**
 * Returns recent incoming citizen signals stream.
 */
export function getRecentSignals(limit: number = 6): CitizenSignal[] {
  return DEMO_CITIZEN_SIGNALS.slice(0, limit);
}

/**
 * Returns all 10 monitored wards.
 */
export function getAllWards(): Ward[] {
  return DEMO_WARDS;
}

/**
 * Returns specific ward summary by ID or code.
 */
export function getWardSummary(wardId: string): Ward | undefined {
  return DEMO_WARDS.find((w) => w.id === wardId || w.code === wardId || w.name === wardId);
}

/**
 * Returns the primary AI civic insight.
 */
export function getPrimaryAIInsight(): AIInsight {
  return DEMO_AI_INSIGHTS[0];
}

/**
 * Returns all AI insights.
 */
export function getAllAIInsights(): AIInsight[] {
  return DEMO_AI_INSIGHTS;
}
