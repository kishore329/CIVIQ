"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getTopPriorityAssessments } from "@/features/priority/priorityService";
import { PriorityAssessment } from "@/features/priority/priorityTypes";
import { PriorityDetailDrawer } from "@/features/priority/ui/priority-detail-drawer";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { formatNumber, cn } from "@/lib/utils";
import {
  Users,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function getAttentionBadge(band: string) {
  switch (band) {
    case "Very High Attention":
    case "High Attention":
      return {
        bg: "bg-[var(--critical-bg)] text-[var(--critical-foreground)] border-[var(--critical-border)]",
        icon: AlertTriangle,
      };
    case "Elevated Attention":
      return {
        bg: "bg-[var(--warning-bg)] text-[var(--warning-foreground)] border-[var(--warning-border)]",
        icon: Clock,
      };
    case "Moderate Attention":
    default:
      return {
        bg: "bg-[var(--info-bg)] text-[var(--info-foreground)] border-[var(--info-border)]",
        icon: CheckCircle2,
      };
  }
}

export function PrioritiesSection() {
  const router = useRouter();
  const topAssessments = getTopPriorityAssessments(5);
  const [selectedAssessment, setSelectedAssessment] = useState<PriorityAssessment | null>(null);

  return (
    <DataCard
      title={
        <div className="flex items-center gap-2">
          <span>TOP DEVELOPMENT PRIORITIES</span>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[var(--primary-subtle)] text-[var(--primary)] border border-[var(--primary)]">
            Transparent Priority Engine
          </span>
        </div>
      }
      subtitle="Data-driven ranking synthesized from citizen distress, infrastructure gap, and vulnerability context"
      action={
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1"
          onClick={() => router.push("/priorities")}
        >
          <span>Full Intelligence Pipeline ({getTopPriorityAssessments(100).length})</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      }
      noPadding
    >
      <div className="divide-y divide-[var(--border-subtle)]">
        {topAssessments.map((assessment, index) => {
          const attentionInfo = getAttentionBadge(assessment.attentionBand);
          const Icon = attentionInfo.icon;
          const rankStr = String(index + 1).padStart(2, "0");

          return (
            <div
              key={assessment.id}
              onClick={() => setSelectedAssessment(assessment)}
              className="p-4 sm:p-5 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Rank, Code, & Title */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text-secondary)] flex items-center justify-center shrink-0 mt-0.5">
                    {rankStr}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-subtle)] px-1.5 py-0.2 rounded border border-[var(--border)]">
                        {assessment.clusterCode}
                      </span>
                      <h4 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors truncate">
                        {assessment.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--info-bg)] px-2 py-0.2 rounded border border-[var(--info-border)]">
                        {assessment.wardName.replace(/ — .*/, "")}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-[var(--text-secondary)] flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-[var(--text)]">
                        <Users className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        {formatNumber(assessment.affectedPopulation)} Beneficiaries
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5 text-[var(--primary)]" />
                        {assessment.signalCount} Corroborating Signals
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-[var(--text-tertiary)]">
                        Gap: {assessment.factors.infrastructureGap}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Horizontal Priority Progress Visualization */}
                <div className="flex items-center gap-4 shrink-0 sm:min-w-[220px] justify-between md:justify-end">
                  <div className="w-full max-w-[160px] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase">
                        Priority Index
                      </span>
                      <span className="font-mono font-bold text-xs text-[var(--text)]">
                        {assessment.priorityIndex} / 100
                      </span>
                    </div>
                    {/* Horizontal Progress Bar */}
                    <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          assessment.priorityIndex >= 80
                            ? "bg-[var(--critical)]"
                            : assessment.priorityIndex >= 70
                            ? "bg-[var(--warning)]"
                            : "bg-[var(--primary)]"
                        )}
                        style={{ width: `${assessment.priorityIndex}%` }}
                      />
                    </div>
                  </div>

                  {/* Priority Status Text & Icon Badge */}
                  <div className="shrink-0 flex flex-col items-end">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border",
                        attentionInfo.bg
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{assessment.attentionBand}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reusable Transparent Priority Detail Drawer */}
      <PriorityDetailDrawer
        assessment={selectedAssessment}
        open={Boolean(selectedAssessment)}
        onOpenChange={(open) => !open && setSelectedAssessment(null)}
      />
    </DataCard>
  );
}
