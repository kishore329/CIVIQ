"use client";

import React, { useState } from "react";
import { IssueCluster, SeverityLevel } from "@/types/civic";
import { ClusterDrilldownModal } from "./cluster-drilldown-modal";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Radio,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react";

interface ClustersGridProps {
  clusters: IssueCluster[];
  onNavigateToProjects?: () => void;
}

function getSeverityBadge(severity: SeverityLevel, score: number) {
  switch (severity) {
    case "critical":
    case "high":
      return {
        bg: "bg-[var(--critical-bg)]",
        text: "text-[var(--critical-foreground)]",
        border: "border-[var(--critical-border)]",
        label: `${severity.toUpperCase()} (${score}/10)`,
        icon: AlertTriangle,
      };
    case "medium":
      return {
        bg: "bg-[var(--warning-bg)]",
        text: "text-[var(--warning-foreground)]",
        border: "border-[var(--warning-border)]",
        label: `MEDIUM (${score}/10)`,
        icon: Clock,
      };
    case "low":
    default:
      return {
        bg: "bg-[var(--surface-subtle)]",
        text: "text-[var(--text-secondary)]",
        border: "border-[var(--border)]",
        label: `LOW (${score}/10)`,
        icon: CheckCircle2,
      };
  }
}

export function ClustersGrid({ clusters, onNavigateToProjects }: ClustersGridProps) {
  const [selectedCluster, setSelectedCluster] = useState<IssueCluster | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster) => {
          const sevBadge = getSeverityBadge(cluster.severity, cluster.severityScore);
          const SevIcon = sevBadge.icon;

          return (
            <div
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster)}
              className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Cluster Code + Severity Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--primary)] bg-[var(--primary-subtle)] px-2 py-0.5 rounded border border-[var(--border)]">
                    {cluster.clusterCode}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-semibold ${sevBadge.bg} ${sevBadge.text} ${sevBadge.border}`}
                  >
                    <SevIcon className="w-3 h-3" />
                    <span>{sevBadge.label}</span>
                  </div>
                </div>

                {/* Title & Subcategory */}
                <div>
                  <h3 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                    {cluster.title}
                  </h3>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--accent)] shrink-0" />
                    <span className="truncate">{cluster.wardName}</span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <div className="p-2 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-tertiary)] block">
                      Citizen Distress
                    </span>
                    <div className="flex items-center gap-1 font-bold text-[var(--text)] mt-0.5">
                      <Radio className="w-3 h-3 text-[var(--primary)]" />
                      <span>{cluster.signalCount} signals</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-tertiary)] block">
                      Affected Residents
                    </span>
                    <div className="flex items-center gap-1 font-bold text-[var(--text)] mt-0.5">
                      <Users className="w-3 h-3 text-[var(--text-secondary)]" />
                      <span>{cluster.affectedPopulation.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* AI Synthesis Excerpt */}
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {cluster.aiSynthesis}
                </p>
              </div>

              {/* Bottom Card Footer: Match Rate & Action */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[var(--text-tertiary)] text-[11px]">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>{cluster.growthVelocity}</span>
                </div>

                <span className="text-[var(--primary)] font-semibold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-xs">
                  Inspect Signals
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drilldown Modal */}
      <ClusterDrilldownModal
        cluster={selectedCluster}
        open={Boolean(selectedCluster)}
        onOpenChange={(open) => !open && setSelectedCluster(null)}
        onNavigateToProjects={onNavigateToProjects}
      />
    </div>
  );
}
