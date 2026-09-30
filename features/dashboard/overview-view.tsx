"use client";

import React, { useState } from "react";
import { DEMO_OVERVIEW_METRICS } from "@/data/demo-data";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import {
  Radio,
  AlertTriangle,
  CheckSquare,
  Users,
  Download,
  RefreshCw,
} from "lucide-react";
import { MapPreviewSection } from "./map-preview-section";
import { PrioritiesSection } from "./priorities-section";
import { AIInsightSection } from "./ai-insight-section";
import { SignalsFeedSection } from "./signals-feed-section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

export function OverviewView() {
  const [activeTab, setActiveTab] = useState("live");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Infrastructure Intelligence"
        description="AI-assisted insights from citizen signals, infrastructure data and development indicators."
        badge={<DemoDataBadge />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              className="text-xs h-8"
              title="Refresh telemetry streams"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Sync Signals</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="text-xs h-8"
              onClick={() => {
                alert("Executive Civic Intelligence Report (PDF) generated from Phase 1 demo data.");
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Export Brief</span>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Row (4 KPI Cards with deterministic Demo Values) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Citizen Signals */}
        <KpiCard
          title="Citizen Signals"
          value={formatNumber(DEMO_OVERVIEW_METRICS.totalCitizenSignals)}
          subtitle="+12.4% vs last 30d"
          icon={Radio}
          trend={{ value: "+12.4%", positive: true }}
          secondaryBadge="94% Geocoded"
          accentColor="accent"
        />

        {/* KPI 2: Infrastructure Issues */}
        <KpiCard
          title="Infrastructure Issues"
          value={formatNumber(DEMO_OVERVIEW_METRICS.infrastructureIssuesCount)}
          subtitle="38 Critical • 62 In Review"
          icon={AlertTriangle}
          trend={{ value: "38 Critical", positive: false }}
          secondaryBadge="12 Resolved"
          accentColor="critical"
        />

        {/* KPI 3: Priority Projects */}
        <KpiCard
          title="Priority Projects"
          value={formatNumber(DEMO_OVERVIEW_METRICS.priorityProjectsCount)}
          subtitle="$42.5M Est. Budget • 6 Approved"
          icon={CheckSquare}
          trend={{ value: "6 Approved", positive: true }}
          secondaryBadge="Shovel Ready"
          accentColor="primary"
        />

        {/* KPI 4: Population Affected */}
        <KpiCard
          title="Population Affected"
          value={formatNumber(DEMO_OVERVIEW_METRICS.totalPopulationAffected)}
          subtitle="34.2% of ward constituency"
          icon={Users}
          trend={{ value: "34.2% Ward Reach", neutral: true }}
          secondaryBadge="High Density"
          accentColor="warning"
        />
      </div>

      {/* Tabs View to inspect Live Dashboard or Component States */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 flex-wrap gap-2">
          <TabsList>
            <TabsTrigger value="live">Live Intelligence View</TabsTrigger>
            <TabsTrigger value="states">Component Showcase & States</TabsTrigger>
          </TabsList>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            Constituency: <span className="font-semibold text-[var(--text)]">Metro Central Zone</span>
          </div>
        </div>

        {/* Live Intelligence View */}
        <TabsContent value="live" className="space-y-6 mt-4">
          {/* Section 1: Development Intelligence Map */}
          <MapPreviewSection />

          {/* Section 2: AI Insight */}
          <AIInsightSection />

          {/* Section 3 & 4 Grid: Top Development Priorities & Recent Citizen Signals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col">
              <PrioritiesSection />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <SignalsFeedSection />
            </div>
          </div>
        </TabsContent>

        {/* Component Showcase & UI States Tab */}
        <TabsContent value="states" className="space-y-6 mt-4">
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text)]">
                Design System Component States (Phase 1 Validation)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Demonstration of reusable empty states, loading skeletons, error resilience, and accessible feedback components.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Loading State demonstration */}
              <LoadingState
                label="Simulating AI Priority Scoring"
                description="Weighting citizen distress against infrastructure lifespan"
                rows={3}
              />

              {/* Empty State demonstration */}
              <EmptyState
                title="No Pending Grievances in Ward 31"
                description="All geocoded signals in this sector have been clustered into active capital projects."
                action={
                  <Button variant="secondary" size="sm">
                    View Project Backlog
                  </Button>
                }
              />

              {/* Error State demonstration */}
              <ErrorState
                title="SCADA Telemetry Timeout"
                message="Sub-feeder line sensor response exceeded threshold (408). Retrying gateway."
                onRetry={() => alert("Re-querying civic telemetry sensor stream...")}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
