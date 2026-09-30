"use client";

import React from "react";
import { getInfrastructureDemand } from "@/lib/data/dashboard";
import { DataCard } from "@/components/ui/data-card";
import { formatNumber } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export function InfrastructureDemandSection() {
  const demandItems = getInfrastructureDemand();

  return (
    <DataCard
      title={
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
          <span>INFRASTRUCTURE DEMAND</span>
        </div>
      }
      subtitle="Which infrastructure categories generate the most citizen demand?"
      action={
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          100% Categorized
        </span>
      }
    >
      <div className="space-y-3.5">
        {demandItems.map((item) => {
          return (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text)]">{item.category}</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    ({formatNumber(item.signalCount)} reports)
                  </span>
                </div>
                <span className="font-mono font-bold text-xs text-[var(--text)]">
                  {item.percentage}%
                </span>
              </div>

              {/* Clean Horizontal Bar Chart */}
              <div className="w-full bg-[var(--surface-subtle)] border border-[var(--border)] h-3 rounded-md overflow-hidden relative">
                <div
                  className="h-full rounded-sm transition-all duration-500 ease-out"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
        <span>Source: 5,284 geocoded citizen reports</span>
        <span className="font-medium text-[var(--accent)]">Roads & Drainage = 50%</span>
      </div>
    </DataCard>
  );
}
