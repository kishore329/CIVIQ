"use client";

import React, { useState } from "react";
import { Ward } from "@/types/civic";
import { getAllWards } from "@/lib/data/dashboard";
import { WardDetails } from "./ward-details";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  MapPin,
  Layers,
  Info,
  Maximize2,
  TrendingUp,
  AlertTriangle,
  Flame,
} from "lucide-react";

export function DevelopmentIntelligenceSection() {
  const wards = getAllWards();
  const [selectedWardId, setSelectedWardId] = useState<string>("ward-17");

  const selectedWard = wards.find((w) => w.id === selectedWardId) || wards[0];

  const getHeatIntensityStyle = (ward: Ward, isSelected: boolean) => {
    // Determine heat styling based on priority level and infrastructure gap
    if (ward.priorityLevel === "Critical") {
      return isSelected
        ? "bg-[var(--critical-bg)] border-[var(--critical)] ring-2 ring-[var(--critical)] shadow-md"
        : "bg-[var(--critical-bg)]/60 border-[var(--critical-border)] hover:border-[var(--critical)] hover:bg-[var(--critical-bg)]";
    }
    if (ward.priorityLevel === "High") {
      return isSelected
        ? "bg-[var(--warning-bg)] border-[var(--warning)] ring-2 ring-[var(--warning)] shadow-md"
        : "bg-[var(--warning-bg)]/50 border-[var(--warning-border)] hover:border-[var(--warning)] hover:bg-[var(--warning-bg)]";
    }
    if (ward.priorityLevel === "Medium") {
      return isSelected
        ? "bg-[var(--info-bg)] border-[var(--info)] ring-2 ring-[var(--info)] shadow-md"
        : "bg-[var(--info-bg)]/40 border-[var(--info-border)] hover:border-[var(--info)] hover:bg-[var(--info-bg)]";
    }
    return isSelected
      ? "bg-[var(--surface-subtle)] border-[var(--primary)] ring-2 ring-[var(--primary)] shadow-md"
      : "bg-[var(--surface-subtle)]/60 border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]";
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Primary Intelligence Section
          </h2>
          <p className="text-xl font-extrabold text-[var(--text)] tracking-tight">
            DEVELOPMENT INTELLIGENCE
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--critical)]" />
            Priority Heat: Active
          </span>
          <span className="text-[11px] font-semibold text-[var(--text)]">
            10 Monitored Wards
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT: Geographic Ward Visualization */}
        <div className="lg:col-span-8 flex flex-col rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm overflow-hidden">
          {/* Visualization Header / Legend */}
          <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-xs font-bold text-[var(--text)]">
                Constituency Geographic Grid (10 Wards)
              </span>
            </div>

            {/* Subtle Heat Intensity Legend */}
            <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--critical-border)] border border-[var(--critical)]" />
                <span>Critical Gap (&gt;75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--warning-border)] border border-[var(--warning)]" />
                <span>High Gap (60-75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--info-border)] border border-[var(--info)]" />
                <span>Moderate Gap (&lt;60%)</span>
              </div>
            </div>
          </div>

          {/* Interactive Geographic Map Canvas */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center bg-[var(--surface-subtle)]/40 relative">
            {/* Background GIS Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(var(--text) 1px, transparent 1px), linear-gradient(to right, var(--text) 1px, transparent 1px), linear-gradient(to bottom, var(--text) 1px, transparent 1px)`,
                backgroundSize: "20px 20px, 80px 80px, 80px 80px",
              }}
            />

            {/* 10 Wards Visual Region Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
              {wards.map((ward) => {
                const isSelected = selectedWardId === ward.id;
                const heatStyle = getHeatIntensityStyle(ward, isSelected);

                return (
                  <button
                    key={ward.id}
                    onClick={() => setSelectedWardId(ward.id)}
                    className={cn(
                      "flex flex-col justify-between p-3.5 rounded-lg border text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] relative group",
                      heatStyle
                    )}
                  >
                    {/* Ward Top Row */}
                    <div className="flex items-start justify-between gap-1 w-full">
                      <span className="text-xs font-extrabold text-[var(--text)] tracking-tight">
                        {ward.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)]">
                        {ward.code}
                      </span>
                    </div>

                    {/* Ward Demand & Gap */}
                    <div className="my-2.5 space-y-1 w-full">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-secondary)]">Demand:</span>
                        <span
                          className={cn(
                            "font-bold",
                            ward.demandLevel === "High"
                              ? "text-[var(--critical)]"
                              : ward.demandLevel === "Medium"
                              ? "text-[var(--warning)]"
                              : "text-[var(--text-secondary)]"
                          )}
                        >
                          {ward.demandLevel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-secondary)]">Infra Gap:</span>
                        <span className="font-mono font-bold text-[var(--text)]">
                          {ward.infrastructureGap}%
                        </span>
                      </div>
                      {/* Gap Visual Progress Bar */}
                      <div className="w-full bg-[var(--border)] h-1 rounded-full overflow-hidden mt-1">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            ward.infrastructureGap >= 75
                              ? "bg-[var(--critical)]"
                              : ward.infrastructureGap >= 55
                              ? "bg-[var(--warning)]"
                              : "bg-[var(--info)]"
                          )}
                          style={{ width: `${ward.infrastructureGap}%` }}
                        />
                      </div>
                    </div>

                    {/* Ward Bottom Row: Top Issue & Status */}
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between w-full text-[10px]">
                      <span className="font-semibold text-[var(--text-secondary)] truncate">
                        {ward.topIssue}
                      </span>
                      <span
                        className={cn(
                          "px-1.5 py-0.2 rounded font-semibold uppercase text-[9px]",
                          ward.priorityLevel === "Critical"
                            ? "bg-[var(--critical-bg)] text-[var(--critical-foreground)] border border-[var(--critical-border)]"
                            : ward.priorityLevel === "High"
                            ? "bg-[var(--warning-bg)] text-[var(--warning-foreground)] border border-[var(--warning-border)]"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"
                        )}
                      >
                        {ward.priorityLevel}
                      </span>
                    </div>

                    {/* Active Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Geographic Insight Footer */}
            <div className="mt-4 pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>
                  Click any ward to inspect localized citizen demand, infrastructure deficit, and priority projects.
                </span>
              </div>
              <span className="font-medium text-[var(--text)]">
                Selected: <strong className="text-[var(--accent)]">{selectedWard.name}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Constituency Snapshot / Ward Details Panel */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 px-1">
            Constituency Snapshot
          </div>
          <div className="flex-1">
            <WardDetails ward={selectedWard} />
          </div>
        </div>
      </div>
    </section>
  );
}
