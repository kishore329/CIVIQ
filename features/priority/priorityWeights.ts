/**
 * CIVIQ Centralized Priority Weights Configuration (Phase 6)
 *
 * Configurable weights totaling exactly 100% (1.00).
 * Decoupled from the calculation logic to allow future policy adjustments.
 */

import { PriorityWeights, PriorityFactors } from "./priorityTypes";

export const PRIORITY_WEIGHTS: PriorityWeights = {
  citizenDemand: 0.20,       // 20%
  infrastructureGap: 0.20,   // 20%
  severity: 0.15,            // 15%
  urgency: 0.10,             // 10%
  populationImpact: 0.15,    // 15%
  vulnerability: 0.10,       // 10%
  investmentGap: 0.05,       // 5%
  evidenceStrength: 0.05,    // 5%
};

export interface FactorMeta {
  key: keyof PriorityFactors;
  label: string;
  weightPct: number;
  description: string;
  color: string;
}

export const FACTOR_METADATA: FactorMeta[] = [
  {
    key: "citizenDemand",
    label: "Citizen Demand",
    weightPct: 20,
    description: "Volume of multi-dialect reports, frequency velocity, and neighborhood grievance corroboration.",
    color: "#3b82f6", // Blue
  },
  {
    key: "infrastructureGap",
    label: "Infrastructure Gap",
    weightPct: 20,
    description: "Modelled deficit between current asset coverage/condition and municipal benchmark (100 - Coverage).",
    color: "#8b5cf6", // Purple
  },
  {
    key: "severity",
    label: "Severity",
    weightPct: 15,
    description: "Physical asset failure magnitude, structural collapse risks, and public health impact.",
    color: "#ef4444", // Red
  },
  {
    key: "populationImpact",
    label: "Population Impact",
    weightPct: 15,
    description: "Direct and secondary resident population impacted within the immediate catchment area.",
    color: "#f59e0b", // Amber
  },
  {
    key: "urgency",
    label: "Urgency",
    weightPct: 10,
    description: "Temporal necessity to prevent secondary compounding infrastructure failure or monsoon inundation.",
    color: "#f97316", // Orange
  },
  {
    key: "vulnerability",
    label: "Vulnerability Context",
    weightPct: 10,
    description: "Contextual concentration of elderly residents, school children, and low-service transit dependents.",
    color: "#ec4899", // Pink
  },
  {
    key: "investmentGap",
    label: "Investment Gap",
    weightPct: 5,
    description: "Historical under-investment and deficit between required capital allocation and current budget.",
    color: "#06b6d4", // Cyan
  },
  {
    key: "evidenceStrength",
    label: "Evidence Strength",
    weightPct: 5,
    description: "Multi-channel verification across voice transcripts, photographic evidence, and temporal consistency.",
    color: "#10b981", // Emerald
  },
];
