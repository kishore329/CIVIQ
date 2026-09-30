"use client";

import React, { useState } from "react";
import { PriorityAssessment } from "../priorityTypes";
import { ContributionChart } from "./contribution-chart";
import { EvidenceChain } from "./evidence-chain";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DEMO_CLUSTERS } from "@/data/demo/clusters";
import { getWardInfrastructureProfile } from "@/features/infrastructure/infrastructureService";
import { calculateInfrastructureGap } from "@/features/infrastructure/gapEngine";
import {
  MapPin,
  Users,
  Radio,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Compass,
  FileCheck2,
  DollarSign,
  Type,
  Mic,
  Image as ImageIcon,
} from "lucide-react";

interface PriorityDetailDrawerProps {
  assessment: PriorityAssessment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getAttentionBadge(band: string) {
  switch (band) {
    case "Very High Attention":
    case "High Attention":
      return {
        bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: AlertTriangle,
      };
    case "Elevated Attention":
      return {
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: Clock,
      };
    case "Moderate Attention":
    default:
      return {
        bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: CheckCircle2,
      };
  }
}

export function PriorityDetailDrawer({
  assessment,
  open,
  onOpenChange,
}: PriorityDetailDrawerProps) {
  const [showConfidenceTooltip, setShowConfidenceTooltip] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<string>("Requires Review");

  if (!assessment) return null;

  const attentionBadge = getAttentionBadge(assessment.attentionBand);
  const AttentionIcon = attentionBadge.icon;

  // Retrieve matching cluster for raw signals
  const cluster = DEMO_CLUSTERS.find(
    (c) => c.id === assessment.clusterId || c.clusterCode === assessment.clusterCode
  );

  // Retrieve ward profile for investment & gap details
  const profile = getWardInfrastructureProfile(assessment.ward);
  const gapResult = calculateInfrastructureGap(assessment.category, profile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-1 text-xs">
        {/* Header Section */}
        <div className="border-b border-[var(--border)] pb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-sm font-bold text-[var(--primary)] bg-[var(--primary-subtle)] px-2.5 py-0.5 rounded border border-[var(--border)]">
              {assessment.clusterCode}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--primary-subtle)] text-[var(--primary)] border border-[var(--primary)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI-ASSISTED ANALYSIS
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${attentionBadge.bg}`}
              >
                <AttentionIcon className="w-3.5 h-3.5" />
                {assessment.attentionBand}
              </span>
            </div>
          </div>

          <h2 className="text-base font-bold text-[var(--text)]">{assessment.title}</h2>

          <div className="flex flex-wrap items-center gap-3 text-[var(--text-secondary)]">
            <span className="flex items-center gap-1 font-medium text-[var(--text)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
              {assessment.wardName} — {assessment.area}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-[var(--primary)]" />
              {assessment.signalCount} Signals
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {assessment.affectedPopulation.toLocaleString()} Residents
            </span>
          </div>

          {/* Primary Score & Confidence Banner */}
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-subtle)] flex flex-col items-center justify-center border border-[var(--primary)]">
                <span className="font-mono text-xl font-black text-[var(--primary)] leading-none">
                  {assessment.priorityIndex}
                </span>
                <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase mt-0.5">
                  / 100
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text)]">
                  AI-Assisted Priority Index
                </span>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Modelled decision-support score synthesized from 8 multi-source factors.
                </p>
              </div>
            </div>

            {/* Confidence Tooltip Pill */}
            <div className="flex items-center gap-3 relative">
              <div className="space-y-0.5 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-[11px] text-[var(--text-secondary)]">Model Consistency:</span>
                  <button
                    type="button"
                    onClick={() => setShowConfidenceTooltip((p) => !p)}
                    onMouseEnter={() => setShowConfidenceTooltip(true)}
                    onMouseLeave={() => setShowConfidenceTooltip(false)}
                    className="text-[var(--text-tertiary)] hover:text-[var(--text)]"
                    aria-label="Confidence explanation"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-[var(--text)]">
                  {Math.round(assessment.confidence * 100)}% Input Consistency
                </div>
              </div>

              {showConfidenceTooltip && (
                <div className="absolute right-0 bottom-full mb-2 w-64 p-2.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] text-[var(--text)] shadow-xl leading-relaxed z-30">
                  This indicates confidence in the consistency of the available inputs, not factual verification.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Human Review Banner (Requirement 23) */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide text-[11px]">
                Human Review Required
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]">
                Status: {reviewStatus}
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              CIVIQ prioritizes infrastructure attention based on configurable analytical models. This is an advisory decision-support tool and does NOT represent an official municipal funding approval.
            </p>
          </div>
        </div>

        {/* 1. Issue Overview & AI Synthesis */}
        <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            1. Issue Overview & Context Synthesis
          </h4>
          <p className="text-[var(--text)] leading-relaxed">{assessment.aiSynthesis}</p>
        </div>

        {/* 2. Audit Evidence Chain */}
        <EvidenceChain assessment={assessment} />

        {/* 3. "Why This Score?" Recharts Contribution Breakdown */}
        <ContributionChart assessment={assessment} />

        {/* 4. Contextual Factor Grids (Demographics, Gap, Investment) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Infrastructure Gap */}
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] block">
              Infrastructure Gap
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-[var(--text)]">
                {assessment.factors.infrastructureGap}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">/ 100</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {gapResult.interpretation}
            </p>
          </div>

          {/* Vulnerability & Population */}
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] block">
              Vulnerability Context
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-[var(--text)]">
                {assessment.factors.vulnerability}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">/ 100</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Modelled demographic sensitivity indicating {profile.vulnerablePopulation.toLocaleString()} elderly and high-dependency residents.
            </p>
          </div>

          {/* Investment Gap Context */}
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] block">
              Capital Investment Deficit
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-[var(--text)]">
                ₹{(profile.requiredInvestment - (profile.existingInvestment + profile.plannedInvestment)).toFixed(1)} Cr
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Committed: ₹{(profile.existingInvestment + profile.plannedInvestment).toFixed(1)} Cr vs Required: ₹{profile.requiredInvestment.toFixed(1)} Cr.
            </p>
          </div>
        </div>

        {/* 5. Representative Citizen Signals Corroboration */}
        {cluster && cluster.signals && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold uppercase tracking-wider text-[var(--text)] text-[11px] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[var(--primary)]" />
                Representative Citizen Telemetry Traces
              </h4>
              <span className="text-[10px] text-[var(--text-tertiary)]">
                {cluster.signals.length} Corroborating Samples
              </span>
            </div>
            <div className="space-y-2">
              {cluster.signals.map((sig) => {
                const SourceIcon = sig.source === "voice" ? Mic : sig.source === "image" ? ImageIcon : Type;
                return (
                  <div
                    key={sig.id}
                    className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[var(--primary)]">
                          {sig.signalId}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[10px] capitalize">
                          <SourceIcon className="w-3 h-3 text-[var(--primary)]" />
                          {sig.source} ({sig.language})
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {Math.round(sig.similarityScore * 100)}% Match
                      </span>
                    </div>
                    <p className="text-xs italic text-[var(--text)] leading-relaxed">
                      &ldquo;{sig.excerpt}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Recommended Actionable Next Step */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--primary)] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5 text-[11px]">
              <Compass className="w-3.5 h-3.5" />
              Recommended Capital Intervention
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
              Advisory Next Step
            </span>
          </div>
          <p className="text-xs text-[var(--text)] leading-relaxed">
            {assessment.recommendedNextStep}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setReviewStatus((prev) =>
                  prev === "Reviewed" ? "Requires Review" : "Reviewed"
                )
              }
              className="text-xs"
            >
              {reviewStatus === "Reviewed" ? "Mark as Requires Review" : "Mark as Reviewed"}
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Close Drawer
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
