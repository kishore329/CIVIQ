"use client";

import React from "react";
import { IssueCluster, SeverityLevel } from "@/types/civic";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Radio,
  Sparkles,
  TrendingUp,
  Type,
  Mic,
  Image as ImageIcon,
  Compass,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

interface ClusterDrilldownModalProps {
  cluster: IssueCluster | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
        label: `CRITICAL (${score}/10)`,
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

export function ClusterDrilldownModal({
  cluster,
  open,
  onOpenChange,
  onNavigateToProjects,
}: ClusterDrilldownModalProps) {
  if (!cluster) return null;

  const sevBadge = getSeverityBadge(cluster.severity, cluster.severityScore);
  const SevIcon = sevBadge.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-6 max-h-[82vh] overflow-y-auto pr-1 text-xs">
        {/* Top Header */}
        <div className="border-b border-[var(--border)] pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-mono text-sm font-bold text-[var(--primary)] bg-[var(--primary-subtle)] px-2.5 py-0.5 rounded border border-[var(--border)]">
              {cluster.clusterCode}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold uppercase tracking-wider text-[11px]">
                High-Priority Cluster
              </span>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-semibold ${sevBadge.bg} ${sevBadge.text} ${sevBadge.border}`}
              >
                <SevIcon className="w-3.5 h-3.5" />
                <span>{sevBadge.label}</span>
              </div>
            </div>
          </div>

          <h2 className="text-base font-bold text-[var(--text)] mt-1">{cluster.title}</h2>

          <div className="flex flex-wrap items-center gap-3 text-[var(--text-secondary)] mt-1.5">
            <span className="flex items-center gap-1 font-medium text-[var(--text)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
              {cluster.wardName} — {cluster.area}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-[var(--primary)]" />
              <strong>{cluster.signalCount}</strong> Verified Signals
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <strong>{cluster.affectedPopulation.toLocaleString()}</strong> Affected
            </span>
          </div>
        </div>

        {/* AI Synthesis & Root Cause Card */}
        <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
              AI Synthesized Root Cause & Context
            </span>
            <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
              Semantic Match: {Math.round(cluster.semanticSimilarity * 100)}%
            </span>
          </div>
          <p className="text-[var(--text)] leading-relaxed">{cluster.aiSynthesis}</p>
        </div>

        {/* Multi-Signal Convergence Evidence Trace */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-[var(--primary)]" />
              Converging Citizen Signals ({cluster.signals.length} representative traces)
            </h3>
            <span className="text-[11px] text-[var(--text-tertiary)]">
              Multi-channel corroboration
            </span>
          </div>

          <div className="space-y-2">
            {cluster.signals.map((sig) => {
              const SourceIcon = sig.source === "voice" ? Mic : sig.source === "image" ? ImageIcon : Type;
              return (
                <div
                  key={sig.id}
                  className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[var(--primary)] text-[11px]">
                        {sig.signalId}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[10px] capitalize font-medium">
                        <SourceIcon className="w-3 h-3 text-[var(--primary)]" />
                        {sig.source} ({sig.language})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {Math.round(sig.similarityScore * 100)}% match
                    </span>
                  </div>
                  <p className="italic text-[var(--text)] leading-relaxed">
                    &ldquo;{sig.excerpt}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Engineering Intervention */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--primary)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5 text-[11px]">
              <Compass className="w-3.5 h-3.5" />
              Recommended Capital Intervention
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold">
              Ready for Budget Allocation
            </span>
          </div>
          <p className="text-[var(--text)] leading-relaxed">{cluster.recommendedIntervention}</p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <span className="text-[11px] text-[var(--text-secondary)]">
            Velocity: <strong className="text-[var(--text)]">{cluster.growthVelocity}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                if (onNavigateToProjects) onNavigateToProjects();
              }}
            >
              View in Priority Projects
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
