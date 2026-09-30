"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Sliders, Play, RotateCcw, TrendingDown, Users, ShieldAlert, Sparkles } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function SimulatorPage() {
  const [budgetAllocation, setBudgetAllocation] = useState(1450000);
  const [focusSector, setFocusSector] = useState("Drainage & Stormwater");
  const [simulated, setSimulated] = useState(false);

  return (
    <AppShell
      pageTitle="What-If Development Simulator"
      pageDescription="Simulate municipal budget reallocations and forecast citizen satisfaction and vulnerability reductions."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="What-If Development Simulator"
          description="Simulate capital reallocation trade-offs and forecast demographic distress alleviation."
          badge={<DemoDataBadge label="DEMO DATA" />}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setBudgetAllocation(1450000);
                  setSimulated(false);
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset Parameters
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setSimulated(true)}
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Run Simulation
              </Button>
            </div>
          }
        />

        {/* Interactive Scenario Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DataCard
            title="Capital Budget Allocation"
            subtitle="Adjust targeted infrastructure envelope for Ward 17"
            className="md:col-span-2"
          >
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text)]">Allocated Outlay:</span>
                <span className="font-mono font-bold text-base text-[var(--accent)]">
                  {formatCurrency(budgetAllocation)}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="250000"
                value={budgetAllocation}
                onChange={(e) => {
                  setBudgetAllocation(Number(e.target.value));
                  setSimulated(true);
                }}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono">
                <span>$500k (Minor Relining)</span>
                <span>$2.5M (Culvert Expansion)</span>
                <span>$5.0M (Full Basin Re-engineering)</span>
              </div>
            </div>
          </DataCard>

          <DataCard title="Target Sector" subtitle="Select infrastructure domain to stress-test">
            <div className="space-y-2 text-xs">
              {["Drainage & Stormwater", "Roads & Transit", "Drinking Water Mains"].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setFocusSector(sec);
                    setSimulated(true);
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left font-medium transition-colors cursor-pointer ${
                    focusSector === sec
                      ? "bg-[var(--primary)] text-white border-transparent"
                      : "bg-[var(--surface-subtle)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Projected Simulation Results */}
        <DataCard
          title="Projected Policy Impact"
          subtitle={`Forecasted civic changes in Ward 17 under ${formatCurrency(budgetAllocation)} allocation`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--success)] text-xs font-semibold">
                <TrendingDown className="w-4 h-4" />
                <span>Grievance Reduction</span>
              </div>
              <p className="text-2xl font-bold font-mono text-[var(--text)] mt-1">
                -{Math.min(88, Math.round((budgetAllocation / 5000000) * 85 + 25))}%
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Estimated ~{Math.round((budgetAllocation / 1450000) * 320)} fewer flood reports per rainfall
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--accent)] text-xs font-semibold">
                <Users className="w-4 h-4" />
                <span>Protected Residents</span>
              </div>
              <p className="text-2xl font-bold font-mono text-[var(--text)] mt-1">
                {formatNumber(Math.min(42800, Math.round((budgetAllocation / 5000000) * 30000 + 12400)))}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Across low-lying settlement blocks in Ward 17
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--primary)] text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Civic ROI Index</span>
              </div>
              <p className="text-2xl font-bold font-mono text-[var(--text)] mt-1">
                8.4 / 10
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Cost-benefit ratio for municipal public health & transit
              </p>
            </div>
          </div>
        </DataCard>
      </div>
    </AppShell>
  );
}
