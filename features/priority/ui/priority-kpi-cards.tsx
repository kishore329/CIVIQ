"use client";

import React from "react";
import { PriorityKPISummary } from "../priorityTypes";
import { CheckSquare, AlertTriangle, Activity, Users, ShieldAlert } from "lucide-react";

interface PriorityKPICardsProps {
  summary: PriorityKPISummary;
}

export function PriorityKPICards({ summary }: PriorityKPICardsProps) {
  const cards = [
    {
      label: "Priority Clusters",
      value: summary.totalPriorityClusters.toString(),
      sublabel: "Synthesized from 127 issues",
      icon: CheckSquare,
      accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "High Attention",
      value: summary.highAttentionCount.toString(),
      sublabel: "Index ≥ 75 requires priority review",
      icon: AlertTriangle,
      accent: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      label: "Average Priority Index",
      value: `${summary.averagePriorityIndex}/100`,
      sublabel: "Weighted multi-factor average",
      icon: Activity,
      accent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Modelled Beneficiaries",
      value: summary.totalAffectedPopulation.toLocaleString(),
      sublabel: "Across 10 constituency wards",
      icon: Users,
      accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                {card.label}
              </span>
              <div className="font-mono text-2xl font-extrabold text-[var(--text)] mt-1 tracking-tight">
                {card.value}
              </div>
              <span className="text-[11px] text-[var(--text-tertiary)] block mt-0.5">
                {card.sublabel}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border ${card.accent} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
