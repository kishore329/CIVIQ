"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { DataCard } from "@/components/ui/data-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Settings, Save, Sliders, Bell } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell
      pageTitle="System & Civic Settings"
      pageDescription="Configure municipal jurisdictional thresholds, telemetry refresh cycles, and administrative preferences."
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title="System & Civic Settings"
          description="Manage municipal jurisdiction parameters, AI prioritization thresholds, and interface settings."
          badge={<DemoDataBadge label="DEMO DATA" />}
          actions={
            <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5 h-8">
              <Save className="w-3.5 h-3.5" />
              <span>{saved ? "Saved" : "Save Changes"}</span>
            </Button>
          }
        />

        {/* Section 1: Constituency Parameters */}
        <DataCard
          title="Constituency Parameters"
          subtitle="Configure active monitoring zone and boundary mappings"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text)] mb-1">
                Monitored Constituency
              </label>
              <Select
                options={[
                  { value: "demo-constituency", label: "Demo Constituency (10 Wards Monitored)" },
                  { value: "metro-north", label: "Metro North Division (Wards 01-06)" },
                  { value: "metro-south", label: "Metro South Division (Wards 25-36)" },
                ]}
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--text)] mb-1">
                Critical Grievance Escalation Threshold
              </label>
              <Input defaultValue="50 recurring signals within 24 hours" />
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Triggers an automated high-priority notification to the municipal urban works commissioner.
              </p>
            </div>
          </div>
        </DataCard>

        {/* Section 2: AI Scoring Weighting */}
        <DataCard
          title="AI Scoring Weights (Phase 2 Simulation Model)"
          subtitle="Adjust relative influence of citizen demand vs infrastructure gap"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
              <span className="font-semibold text-[var(--text)] block mb-1">Citizen Signal Volume Weight</span>
              <span className="font-mono text-base font-bold text-[var(--accent)]">45%</span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Weighting placed on frequency and multi-dialect clustering.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
              <span className="font-semibold text-[var(--text)] block mb-1">Infrastructure Deficit Gap Weight</span>
              <span className="font-mono text-base font-bold text-[var(--primary)]">55%</span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Weighting placed on asset age, physical condition, and historical under-investment.
              </p>
            </div>
          </div>
        </DataCard>

        {/* Section 3: Interface & Theme */}
        <DataCard
          title="Display & Accessibility"
          subtitle="Customize interface theme and visual preferences"
        >
          <div className="space-y-3 text-xs max-w-xs">
            <label className="block font-semibold text-[var(--text)]">Platform Theme</label>
            <ThemeSwitcher />
          </div>
        </DataCard>
      </div>
    </AppShell>
  );
}
