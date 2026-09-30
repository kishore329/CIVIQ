"use client";

import React from "react";
import { OverviewView } from "./overview-view";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Sliders,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import { SignalsFeedSection } from "./signals-feed-section";
import { MapPreviewSection } from "./map-preview-section";
import { PrioritiesSection } from "./priorities-section";
import { AIInsightSection } from "./ai-insight-section";

interface ViewManagerProps {
  activeView: string;
}

export function ViewManager({ activeView }: ViewManagerProps) {
  switch (activeView) {
    case "citizen-signals":
      return (
        <div className="space-y-6">
          <PageHeader
            title="Citizen Signals Ingestion Stream"
            description="Real-time multi-channel grievances, voice notes, and community requests processed via civic NLP."
            badge={<DemoDataBadge />}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-3.5 h-3.5 mr-1" />
                  Filter Languages
                </Button>
                <Button variant="primary" size="sm">
                  Export CSV
                </Button>
              </div>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Search citizen keywords or tracking ID..."
              leftIcon={<Search className="w-4 h-4" />}
            />
            <Select
              options={[
                { value: "all", label: "All Dialects & Languages (Hindi, Tamil, English)" },
                { value: "tamil", label: "Tamil Voice/SMS" },
                { value: "hindi", label: "Hindi Voice/SMS" },
                { value: "english", label: "English App/Portal" },
              ]}
            />
            <Select
              options={[
                { value: "all", label: "All Severity Levels" },
                { value: "critical", label: "Critical Only (38)" },
                { value: "high", label: "High Urgency" },
              ]}
            />
          </div>
          <SignalsFeedSection />
        </div>
      );

    case "development-map":
      return (
        <div className="space-y-6">
          <PageHeader
            title="Development Intelligence Map"
            description="Geospatial clustering of infrastructure vulnerabilities, citizen demand hotspots, and municipal capital boundaries."
            badge={<DemoDataBadge />}
          />
          <MapPreviewSection />
        </div>
      );

    case "priority-projects":
      return (
        <div className="space-y-6">
          <PageHeader
            title="Priority Development Projects"
            description="Transparent AI-ranked infrastructure interventions combining empirical citizen distress with engineering readiness."
            badge={<DemoDataBadge />}
          />
          <PrioritiesSection />
        </div>
      );

    case "what-if-simulator":
      return (
        <div className="space-y-6">
          <PageHeader
            title="What-If Development Simulator"
            description="Simulate municipal budget reallocations and forecast citizen satisfaction and vulnerability reductions."
            badge={<DemoDataBadge />}
          />
          <DataCard
            title="Scenario Parameters (Phase 2 Preview)"
            subtitle="Configure fiscal envelope and category weighting before executing Monte-Carlo simulations"
          >
            <div className="p-4 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs space-y-4">
              <div className="flex items-center gap-2 text-[var(--accent)] font-semibold">
                <Sliders className="w-4 h-4" />
                <span>Simulation Engine Stage: Model Grounding Ready</span>
              </div>
              <p className="text-[var(--text-secondary)]">
                In Phase 2, this module will enable municipal administrators to adjust $50M capital budgets, simulate monsoon flood scenarios, and forecast ward vulnerability improvements in real time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Target Ward</span>
                  <p className="font-semibold text-sm text-[var(--text)] mt-1">Ward 14 (Old Port)</p>
                </div>
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Budget Envelope</span>
                  <p className="font-semibold text-sm text-[var(--text)] mt-1">$1.45M Allocated</p>
                </div>
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Projected Impact</span>
                  <p className="font-semibold text-sm text-[var(--success)] mt-1">-68% Flood Grievances</p>
                </div>
              </div>
            </div>
          </DataCard>
        </div>
      );

    case "evidence-center":
      return (
        <div className="space-y-6">
          <PageHeader
            title="Evidence Grounding Center"
            description="Verifiable empirical trail linking AI recommendations to citizen voice recordings, municipal GIS, and sensor telemetry."
            badge={<DemoDataBadge />}
          />
          <AIInsightSection />
        </div>
      );

    case "ai-copilot":
      return (
        <div className="space-y-6">
          <PageHeader
            title="Civic AI Copilot"
            description="Evidence-grounded conversational assistant for policymakers, urban planners, and municipal engineers."
            badge={<DemoDataBadge />}
          />
          <DataCard
            title="Conversational Assistant (Phase 2 Preview)"
            subtitle="Grounded directly in monitored ward datasets and municipal infrastructure codes"
          >
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--info-bg)] text-[var(--accent)] flex items-center justify-center mx-auto border border-[var(--info-border)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text)]">
                CIVIQ Evidence-Grounded Copilot
              </h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                Ready to be connected to Google Gemini in Phase 2 with strict RAG constraints against municipal data, ensuring zero hallucinations for civic governance.
              </p>
              <div className="pt-3 flex flex-wrap justify-center gap-2">
                <Button variant="secondary" size="sm" className="text-xs">
                  &ldquo;Why is Ward 14 culvert ranked #1?&rdquo;
                </Button>
                <Button variant="secondary" size="sm" className="text-xs">
                  &ldquo;Summarize water grievances in Sector 9&rdquo;
                </Button>
                <Button variant="secondary" size="sm" className="text-xs">
                  &ldquo;Compare capital cost vs affected residents&rdquo;
                </Button>
              </div>
            </div>
          </DataCard>
        </div>
      );

    case "data-sources":
      return (
        <div className="space-y-6">
          <PageHeader
            title="Civic Data Ingestion Sources"
            description="Active telemetry adapters, citizen grievance feeds, and GIS data layers."
            badge={<DemoDataBadge />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Citizen Voice & Multilingual SMS Gateway",
                type: "Continuous Stream",
                status: "Operational",
                records: "5,284 ingested",
                latency: "42ms",
              },
              {
                name: "Municipal GIS Drainage & Culvert Topology",
                type: "Vector GeoPackage",
                status: "Operational",
                records: "14 layers active",
                latency: "120ms",
              },
              {
                name: "Urban Water Utility SCADA Telemetry",
                type: "MQTT / IoT Sensor Stream",
                status: "Operational",
                records: "48 transducers active",
                latency: "85ms",
              },
              {
                name: "Constituency Census & Demographic Index",
                type: "Demographic Matrix",
                status: "Synchronized",
                records: "82,400 residents mapped",
                latency: "Daily batch",
              },
            ].map((ds, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text)]">{ds.name}</span>
                  <StatusBadge variant="success" label={ds.status} size="sm" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                  <div>
                    <span className="block text-[10px] text-[var(--text-muted)]">Type</span>
                    <span className="font-medium text-[var(--text)]">{ds.type}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--text-muted)]">Volume</span>
                    <span className="font-medium text-[var(--text)]">{ds.records}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--text-muted)]">Telemetry Latency</span>
                    <span className="font-medium text-[var(--text)]">{ds.latency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "ai-status":
      return (
        <div className="space-y-6">
          <PageHeader
            title="Civic AI Engine Status"
            description="Inference health, grounding confidence, latency, and clustering metrics."
            badge={<DemoDataBadge />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Model Provider</span>
              <p className="text-base font-bold text-[var(--text)] mt-1">Google Gemini 2.5 Flash</p>
              <span className="text-[11px] text-[var(--success)] font-medium">Ready for Phase 2 API link</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Cluster Accuracy</span>
              <p className="text-base font-bold text-[var(--text)] mt-1 font-mono">98.4%</p>
              <span className="text-[11px] text-[var(--text-secondary)]">Cosine Sim &gt; 0.86</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Grounding Verification</span>
              <p className="text-base font-bold text-[var(--text)] mt-1 font-mono">100%</p>
              <span className="text-[11px] text-[var(--success)]">Zero Un-evidenced Claims</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Inference Health</span>
              <p className="text-base font-bold text-[var(--text)] mt-1">Optimal</p>
              <span className="text-[11px] text-[var(--text-secondary)]">240ms P95 Latency</span>
            </div>
          </div>
        </div>
      );

    case "settings":
      return (
        <div className="space-y-6">
          <PageHeader
            title="System & Civic Settings"
            description="Municipal jurisdictional parameters, threshold triggers, and UI preferences."
            badge={<DemoDataBadge />}
          />
          <DataCard title="Constituency Parameters" subtitle="Configure active ward monitoring threshold rules">
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">
                  Active Monitoring Jurisdiction
                </label>
                <Select
                  options={[
                    { value: "metro-central", label: "Metro Central Division (Wards 07, 14, 22, 31)" },
                    { value: "metro-north", label: "Metro North Division (Wards 01-06)" },
                  ]}
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">
                  Critical Signal Escalation Threshold
                </label>
                <Input defaultValue="50 duplicate signals within 24 hours" />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">
                  Automated AI Re-scoring Frequency
                </label>
                <Select
                  options={[
                    { value: "hourly", label: "Hourly Dynamic Re-scoring" },
                    { value: "daily", label: "Daily Overnight Recalculation" },
                  ]}
                />
              </div>
              <Button variant="primary" size="sm" onClick={() => alert("Settings saved (demo mode).")}>
                Save Configuration
              </Button>
            </div>
          </DataCard>
        </div>
      );

    case "overview":
    default:
      return <OverviewView />;
  }
}
