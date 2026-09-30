"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { CiviqAiInsightCard } from "@/features/dashboard/civiq-ai-insight-card";
import { DataCard } from "@/components/ui/data-card";
import { ShieldCheck, FileText, CheckCircle2, Database } from "lucide-react";

export default function EvidencePage() {
  return (
    <AppShell
      pageTitle="Evidence Center"
      pageDescription="Verifiable empirical trail linking AI recommendations to raw citizen voice recordings, municipal GIS, and sensor telemetry."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Evidence Grounding Center"
          description="Every AI recommendation is traced to verified empirical records—ensuring accountability and zero hallucinations in public governance."
          badge={<DemoDataBadge label="DEMO DATA" />}
        />

        {/* Primary AI Insight with Grounding Evidence */}
        <CiviqAiInsightCard />

        {/* Audit Trail & Citations */}
        <DataCard
          title="Constituency Empirical Audit Trail"
          subtitle="Direct link between citizen grievances and municipal infrastructure records"
        >
          <div className="space-y-3 text-xs">
            {[
              {
                source: "Citizen Grievance Stream #98421",
                type: "Multilingual Voice/SMS (Tamil)",
                ward: "Ward 17",
                finding: "Culvert capacity reduced by siltation leading to backwater inundation",
                verified: true,
              },
              {
                source: "Municipal GIS Drainage Asset Layer",
                type: "Vector GeoPackage",
                ward: "Ward 17 / Ward 14",
                finding: "Box culvert constructed 2004; scheduled for overhaul in 2022 (deferred)",
                verified: true,
              },
              {
                source: "Public Works Sensor Telemetry",
                type: "SCADA Pressure/Flow",
                ward: "Ward 07",
                finding: "Line F-12 sustained 40% pressure drop during peak evening consumption",
                verified: true,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text)]">{item.source}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--accent)]">{item.ward}</span>
                  </div>
                  <p className="text-[var(--text-secondary)]">{item.finding}</p>
                </div>
                <div className="flex items-center gap-1 text-[var(--success)] shrink-0 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Grounding Verified</span>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </AppShell>
  );
}
