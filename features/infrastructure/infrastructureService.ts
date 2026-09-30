/**
 * CIVIQ Infrastructure Profile Service (Phase 6)
 */

import { InfrastructureProfile, InfrastructureGapResult } from "./infrastructureTypes";
import { INFRASTRUCTURE_PROFILES } from "./infrastructureData";
import { calculateInfrastructureGap } from "./gapEngine";

const DEFAULT_PROFILE: InfrastructureProfile = {
  wardId: "ward-default",
  wardName: "Demo Ward Context",
  roadConditionIndex: 50,
  drainageCoverage: 50,
  waterAccessIndex: 50,
  healthcareAccessIndex: 50,
  educationAccessIndex: 50,
  streetlightCoverage: 50,
  wasteManagementIndex: 50,
  publicTransportAccessIndex: 50,
  population: 35000,
  vulnerablePopulation: 10000,
  vulnerabilityIndex: 55,
  existingInvestment: 4.0,
  plannedInvestment: 2.0,
  requiredInvestment: 10.0,
};

export function getWardInfrastructureProfile(wardId: string): InfrastructureProfile {
  const normalizedId = wardId.toLowerCase().replace(/\s+/g, "-");
  return INFRASTRUCTURE_PROFILES[normalizedId] || DEFAULT_PROFILE;
}

export function getAllInfrastructureProfiles(): InfrastructureProfile[] {
  return Object.values(INFRASTRUCTURE_PROFILES);
}

export function getWardGapByCategory(
  wardId: string,
  category: string
): InfrastructureGapResult {
  const profile = getWardInfrastructureProfile(wardId);
  return calculateInfrastructureGap(category, profile);
}
