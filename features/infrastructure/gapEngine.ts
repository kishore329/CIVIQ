/**
 * CIVIQ Infrastructure Gap Engine (Phase 6)
 *
 * Implements deterministic calculation:
 * Infrastructure Gap = 100 - Infrastructure Coverage / Condition
 *
 * Uses careful advisory language without asserting unverified government claims.
 */

import { InfrastructureProfile, InfrastructureGapResult } from "./infrastructureTypes";

export const CATEGORY_METRIC_MAP: Record<string, keyof InfrastructureProfile> = {
  roads: "roadConditionIndex",
  drainage: "drainageCoverage",
  water: "waterAccessIndex",
  healthcare: "healthcareAccessIndex",
  education: "educationAccessIndex",
  streetlights: "streetlightCoverage",
  "waste management": "wasteManagementIndex",
  "public transport": "publicTransportAccessIndex",
};

/**
 * Calculates the infrastructure deficit gap for a given category and ward profile.
 */
export function calculateInfrastructureGap(
  category: string,
  profile: InfrastructureProfile
): InfrastructureGapResult {
  const normalizedCat = category.trim().toLowerCase();
  const metricKey = CATEGORY_METRIC_MAP[normalizedCat] || "drainageCoverage";

  const rawCoverage = profile[metricKey];
  const currentIndex = typeof rawCoverage === "number" ? rawCoverage : 50;

  // Gap = 100 - Current Index (0–100)
  const gapIndex = Math.max(0, Math.min(100, 100 - currentIndex));

  let severityDescriptor = "moderate";
  if (gapIndex >= 75) severityDescriptor = "substantially elevated";
  else if (gapIndex >= 60) severityDescriptor = "relatively higher";
  else if (gapIndex <= 35) severityDescriptor = "relatively lower";

  const interpretation = `Modelled baseline data indicates a ${severityDescriptor} ${category.toLowerCase()} infrastructure gap (${gapIndex}/100) in ${profile.wardName}.`;

  return {
    category,
    metricKey,
    currentIndex,
    gapIndex,
    interpretation,
    isSyntheticDemoData: true,
  };
}
