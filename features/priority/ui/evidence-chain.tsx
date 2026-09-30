"use client";

import React from "react";
import { PriorityAssessment } from "../priorityTypes";
import { Radio, Layers, Activity, Users, CheckSquare, ArrowRight } from "lucide-react";

interface EvidenceChainProps {
  assessment: PriorityAssessment;
}

export function EvidenceChain({ assessment }: EvidenceChainProps) {
  const steps = [
    {
      step: 1,
      label: "Citizen Signals",
      value: `${assessment.signalCount} Reports`,
      subtext: "Voice, SMS & photo corroborated",
      icon: Radio,
    },
    {
      step: 2,
      label: "Synthesized Cluster",
      value: assessment.clusterCode,
      subtext: assessment.subcategory,
      icon: Layers,
    },
    {
      step: 3,
      label: "Infrastructure Gap",
      value: `${assessment.factors.infrastructureGap} / 100`,
      subtext: "Modelled ward deficit",
      icon: Activity,
    },
    {
      step: 4,
      label: "Population Impact",
      value: `${assessment.affectedPopulation.toLocaleString()}`,
      subtext: "Impact score: " + assessment.factors.populationImpact + "/100",
      icon: Users,
    },
    {
      step: 5,
      label: "Priority Index",
      value: `${assessment.priorityIndex} / 100`,
      subtext: assessment.attentionBand,
      icon: CheckSquare,
      highlight: true,
    },
  ];

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-3">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Audit Evidence Chain
        </h4>
        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
          Step-by-step evidence progression from raw citizen telemetry to the final attention index:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className={`p-3 rounded-lg border relative flex flex-col justify-between ${
                st.highlight
                  ? "bg-[var(--surface)] border-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                  : "bg-[var(--surface)] border-[var(--border)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-tertiary)]">
                    STEP 0{st.step}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      st.highlight ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"
                    }`}
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--text-secondary)] block">
                  {st.label}
                </span>
                <span
                  className={`text-xs font-bold mt-1 block truncate ${
                    st.highlight ? "text-[var(--primary)] font-mono text-sm" : "text-[var(--text)]"
                  }`}
                >
                  {st.value}
                </span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)] mt-2 block truncate">
                {st.subtext}
              </span>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[var(--text-tertiary)] pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
