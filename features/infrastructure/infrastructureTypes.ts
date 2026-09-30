/**
 * CIVIQ Infrastructure Gap Intelligence Types (Phase 6)
 *
 * All metrics represent synthetic demo data for decision-support modeling.
 * Do not represent as official government census or audit records.
 */

export interface InfrastructureProfile {
  wardId: string;
  wardName: string;

  // Infrastructure Baseline Coverage / Condition Indices (0–100, higher = better)
  roadConditionIndex: number;
  drainageCoverage: number;
  waterAccessIndex: number;
  healthcareAccessIndex: number;
  educationAccessIndex: number;
  streetlightCoverage: number;
  wasteManagementIndex: number;
  publicTransportAccessIndex: number;

  // Demographic & Contextual Baseline (Ward-Level Synthetic)
  population: number;
  vulnerablePopulation: number;
  vulnerabilityIndex: number; // 0–100

  // Capital Investment Context (in ₹ Crores)
  existingInvestment: number;
  plannedInvestment: number;
  requiredInvestment: number;
}

export interface InfrastructureGapResult {
  category: string;
  metricKey: keyof InfrastructureProfile;
  currentIndex: number; // 0–100
  gapIndex: number; // 0–100 (Gap = 100 - currentIndex)
  interpretation: string;
  isSyntheticDemoData: true;
}
