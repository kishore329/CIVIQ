"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { KpiCard } from "@/components/ui/kpi-card";
import { getDashboardStats } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/utils";
import {
  Radio,
  AlertTriangle,
  CheckSquare,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import { DevelopmentIntelligenceSection } from "@/features/dashboard/development-intelligence-section";
import { CiviqAiInsightCard } from "@/features/dashboard/civiq-ai-insight-card";
import { PrioritiesSection } from "@/features/dashboard/priorities-section";
import { InfrastructureDemandSection } from "@/features/dashboard/infrastructure-demand-section";
import { CitizenTrendsSection } from "@/features/dashboard/citizen-trends-section";
import { RecentSignalsFeed } from "@/features/dashboard/recent-signals-feed";
import { QuickActionsBar } from "@/features/dashboard/quick-actions-bar";

export default function DashboardPage() {
  const stats = getDashboardStats();

  return (
    <AppShell
      pageTitle="CIVIQ Intelligence Hub"
      pageDescription="Understand citizen demand, infrastructure gaps and emerging development priorities."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title="CIVIQ Intelligence Hub"
          description="Understand citizen demand, infrastructure gaps and emerging development priorities."
          badge={<DemoDataBadge label="DEMO DATA" />}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Constituency Placeholder */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                <span className="text-[var(--text-secondary)]">Constituency:</span>
                <span>Demo Constituency</span>
              </div>

              {/* Period Placeholder */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]">
                <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                <span className="text-[var(--text-secondary)]">Period:</span>
                <span>Last 30 Days</span>
              </div>
            </div>
          }
        />

        {/* Primary KPI Section (Derived from centralized demo-data model) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CARD 1: Citizen Signals */}
          <KpiCard
            title="Citizen Signals"
            value={formatNumber(stats.citizenSignals)}
            subtitle={stats.citizenSignalsDelta}
            icon={Radio}
            trend={{ value: "+12.4%", positive: true }}
            accentColor="accent"
          />

          {/* CARD 2: Infrastructure Issues */}
          <KpiCard
            title="Infrastructure Issues"
            value={formatNumber(stats.infrastructureIssues)}
            subtitle={`${stats.highPriorityClusters} high-priority clusters`}
            icon={AlertTriangle}
            trend={{ value: "23 Clusters", positive: false }}
            accentColor="critical"
          />

          {/* CARD 3: Priority Projects */}
          <KpiCard
            title="Priority Projects"
            value={formatNumber(stats.priorityProjects)}
            subtitle={`${stats.requireReviewCount} require review`}
            icon={CheckSquare}
            trend={{ value: "7 in Review", neutral: true }}
            accentColor="primary"
          />

          {/* CARD 4: Population Affected */}
          <KpiCard
            title="Population Affected"
            value={formatNumber(stats.populationAffected)}
            subtitle={`Across ${stats.wardCount} wards`}
            icon={Users}
            trend={{ value: "10 Wards", neutral: true }}
            accentColor="warning"
          />
        </div>

        {/* Quick Actions Bar */}
        <QuickActionsBar />

        {/* PRIMARY INTELLIGENCE SECTION: Two-column Development Intelligence (Map + Constituency Snapshot) */}
        <DevelopmentIntelligenceSection />

        {/* PROMINENT AI INSIGHT */}
        <CiviqAiInsightCard />

        {/* PRIORITY PROJECTS & INFRASTRUCTURE DEMAND ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <PrioritiesSection />
          </div>
          <div className="lg:col-span-5">
            <InfrastructureDemandSection />
          </div>
        </div>

        {/* CITIZEN SIGNAL TRENDS & RECENT ACTIVITY ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <CitizenTrendsSection />
          </div>
          <div className="lg:col-span-5">
            <RecentSignalsFeed />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
