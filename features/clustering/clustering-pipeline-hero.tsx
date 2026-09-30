"use client";

import React, { useState } from "react";
import { ClusteringPipelineStats } from "@/types/civic";
import {
  Radio,
  Sparkles,
  Layers,
  Network,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ClusteringPipelineHeroProps {
  stats: ClusteringPipelineStats;
  activeStage?: number;
  onSelectStage?: (stage: number) => void;
}

export function ClusteringPipelineHero({
  stats,
  activeStage = 5,
  onSelectStage,
}: ClusteringPipelineHeroProps) {
  const [selectedStage, setSelectedStage] = useState<number>(activeStage);

  const handleStageClick = (idx: number) => {
    setSelectedStage(idx);
    if (onSelectStage) onSelectStage(idx);
  };

  const stages = [
    {
      step: 1,
      metric: stats.totalSignals.toLocaleString(),
      label: "Citizen Signals",
      sublabel: "Multilingual Ingestion",
      icon: Radio,
      detail: "Raw unstructured reports collected via Voice Audio, SMS, Portal, and Visual Photo evidence across 10 wards.",
      accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      step: 2,
      metric: "100%",
      label: "AI Classification",
      sublabel: "Category & Urgency",
      icon: Sparkles,
      detail: "Google Gemini parses dialect, extracts landmarks, estimates severity (1–10), and assigns municipal categories.",
      accent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      step: 3,
      metric: "93%",
      label: "Similarity Matching",
      sublabel: "Location + Semantic",
      icon: Layers,
      detail: "Spatial geofencing within ward boundaries combined with semantic vector cosine similarity across citizen excerpts.",
      accent: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      step: 4,
      metric: stats.clusteredIssuesCount.toString(),
      label: "Infrastructure Issues",
      sublabel: `${stats.compressionRatio} Compression`,
      icon: Network,
      detail: "Redundant and duplicate citizen grievances synthesized into distinct physical infrastructure deficiency assets.",
      accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      step: 5,
      metric: stats.highPriorityClustersCount.toString(),
      label: "High-Priority Clusters",
      sublabel: `${stats.totalAffectedPopulation.toLocaleString()} Beneficiaries`,
      icon: AlertTriangle,
      detail: "Empirically prioritized hotspots exhibiting severe distress velocity, life-safety risk, or cross-demographic impact.",
      accent: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-base font-bold text-[var(--text)] tracking-tight">
              Signal-to-Cluster Intelligence Pipeline
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            How CIVIQ transforms 5,284 noisy citizen inputs into 23 actionable high-priority municipal projects.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] font-mono text-[var(--text-secondary)]">
            Compression: <strong className="text-[var(--primary)]">{stats.compressionRatio}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Pipeline
          </span>
        </div>
      </div>

      {/* 5-Step Pipeline Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = selectedStage === stage.step;
          return (
            <div
              key={stage.step}
              onClick={() => handleStageClick(stage.step)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? "bg-[var(--surface-hover)] border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-sm"
                  : "bg-[var(--surface-subtle)] border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-tertiary)]">
                    STAGE 0{stage.step}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${stage.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="font-mono text-xl font-extrabold text-[var(--text)] tracking-tight">
                  {stage.metric}
                </div>

                <div className="text-xs font-bold text-[var(--text)] mt-1">
                  {stage.label}
                </div>

                <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                  {stage.sublabel}
                </div>
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[var(--text-tertiary)] pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Stage Detail Explanation Bar */}
      {selectedStage && (
        <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex items-start gap-3 text-xs animate-in fade-in-50 duration-200">
          <div className="p-1 rounded bg-[var(--primary-subtle)] text-[var(--primary)] shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">
              Stage 0{selectedStage} Detail:{" "}
            </span>
            <span className="text-[var(--text-secondary)]">
              {stages.find((s) => s.step === selectedStage)?.detail}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
