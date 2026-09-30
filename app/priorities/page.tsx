"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { PriorityKPICards } from "@/features/priority/ui/priority-kpi-cards";
import { PriorityTable } from "@/features/priority/ui/priority-table";
import {
  getAllPriorityAssessments,
  getPriorityKPIs,
} from "@/features/priority/priorityService";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, ShieldCheck, Network, Info } from "lucide-react";
import Link from "next/link";

export default function PrioritiesPage() {
  const assessments = getAllPriorityAssessments();
  const summary = getPriorityKPIs();

  return (
    <AppShell
      pageTitle="Priority Intelligence"
      pageDescription="Transparent, evidence-based infrastructure attention analysis."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Priority Intelligence"
          description="Transparent, evidence-based infrastructure attention analysis."
          badge={<DemoDataBadge label="SYNTHETIC DEMO DATA" />}
          actions={
            <div className="flex items-center gap-2">
              <Link href="/clustering">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Network className="w-3.5 h-3.5 text-[var(--primary)]" />
                  Signal Clusters (23)
                </Button>
              </Link>
              <Button variant="primary" size="sm" className="h-8 text-xs gap-1.5">
                <Download className="w-3.5 h-3.5 mr-1" />
                Export Prioritization Matrix
              </Button>
            </div>
          }
        />

        {/* Top Information Banner (Requirement 16) */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--primary)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] flex items-center justify-center text-[var(--primary)] shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  AI-Assisted Priority Analysis
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] font-semibold text-[var(--text-secondary)]">
                  Human Review Required
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                CIVIQ combines citizen demand, infrastructure gaps, impact context, and evidence strength to produce a transparent attention index.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Top KPI Cards (Requirement 17) */}
        <PriorityKPICards summary={summary} />

        {/* Full Analytical Priority Matrix Table (Requirement 18) */}
        <PriorityTable assessments={assessments} />

        {/* Responsible AI Notice: About CIVIQ Priority Analysis (Requirement 29) */}
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[var(--primary)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              About CIVIQ Priority Analysis
            </h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            CIVIQ uses configurable analytical factors to help organize infrastructure attention. Scores are modelled outputs based on available citizen signals and synthetic contextual data. They are not official government decisions and should be reviewed by responsible decision-makers.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
