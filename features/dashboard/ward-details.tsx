"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Ward } from "@/types/civic";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import {
  Users,
  Radio,
  AlertTriangle,
  PieChart,
  Layers,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export interface WardDetailsProps {
  ward: Ward;
  onViewIntelligence?: () => void;
  className?: string;
}

export function WardDetails({ ward, onViewIntelligence, className }: WardDetailsProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    if (onViewIntelligence) {
      onViewIntelligence();
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
                {ward.code}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                {ward.constituency}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mt-0.5 tracking-tight">
              {ward.name}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge
              severity={
                ward.priorityLevel === "Critical"
                  ? "critical"
                  : ward.priorityLevel === "High"
                  ? "high"
                  : ward.priorityLevel === "Medium"
                  ? "medium"
                  : "low"
              }
              label={`${ward.priorityLevel} Priority`}
              size="sm"
            />
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              {ward.demandLevel} Demand
            </span>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 py-4">
          {/* Population */}
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-[11px] font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>Population</span>
            </div>
            <p className="text-base font-bold text-[var(--text)] mt-1 font-mono">
              {formatNumber(ward.population)}
            </p>
          </div>

          {/* Citizen Signals */}
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-[11px] font-medium">
              <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Citizen Signals</span>
            </div>
            <p className="text-base font-bold text-[var(--text)] mt-1 font-mono">
              {formatNumber(ward.citizenSignals)}
            </p>
          </div>

          {/* Infrastructure Gap */}
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-medium">
              <span>Infrastructure Gap</span>
              <span className="text-[var(--critical)] font-bold">{ward.infrastructureGap}%</span>
            </div>
            <div className="w-full bg-[var(--border)] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[var(--critical)] h-full rounded-full"
                style={{ width: `${ward.infrastructureGap}%` }}
              />
            </div>
          </div>

          {/* Investment Coverage */}
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-medium">
              <span>Investment Coverage</span>
              <span className="text-[var(--success)] font-bold">{ward.investmentCoverage}%</span>
            </div>
            <div className="w-full bg-[var(--border)] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[var(--success)] h-full rounded-full"
                style={{ width: `${ward.investmentCoverage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Focus Area & Priority Issues */}
        <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-[var(--text-secondary)]">Priority Issues:</span>
            <span className="font-semibold text-[var(--text)] font-mono">
              {ward.priorityIssueCount} Critical Clusters
            </span>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-[var(--text-secondary)]">Top Infrastructure Need:</span>
            <span className="font-bold text-[var(--primary)] px-2 py-0.5 rounded bg-[var(--info-bg)] border border-[var(--info-border)]">
              {ward.topIssue}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-[var(--text-secondary)]">Telemetry Trajectory:</span>
            <span className="font-medium text-[var(--text-secondary)] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--accent)]" />
              {ward.trend}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenDialog}
          className="w-full text-xs font-semibold py-2 justify-center"
        >
          <span>View Ward Intelligence</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      {/* Ward Intelligence Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">{ward.code}</span>
            <StatusBadge
              severity={ward.priorityLevel === "Critical" ? "critical" : "high"}
              label={`${ward.priorityLevel} Priority Zone`}
              size="sm"
            />
          </div>
          <DialogTitle>{ward.name} — Civic Intelligence Dossier</DialogTitle>
          <DialogDescription>
            Synthetic municipal telemetry and aggregated citizen grievances for {ward.constituency}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Citizen Volume</span>
              <p className="text-base font-bold text-[var(--text)] mt-0.5 font-mono">
                {formatNumber(ward.citizenSignals)} reports
              </p>
              <p className="text-[11px] text-[var(--accent)] mt-0.5">{ward.trend}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Infrastructure Gap</span>
              <p className="text-base font-bold text-[var(--critical)] mt-0.5 font-mono">
                {ward.infrastructureGap}% Deficit
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Existing Coverage: {ward.investmentCoverage}%
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--info-bg)] border border-[var(--info-border)] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--info-foreground)]">
              <ShieldAlert className="w-4 h-4" />
              <span>Recommended Next Municipal Intervention</span>
            </div>
            <p className="text-[var(--text)] leading-relaxed">
              Prioritize {ward.topIssue} rehabilitation under FY26 capital works. Ward signals indicate severe community distress affecting {formatNumber(Math.round(ward.population * 0.4))} residents across low-lying sub-sectors.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setDialogOpen(false);
              router.push("/priorities");
            }}
          >
            Review Priority Pipeline
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
