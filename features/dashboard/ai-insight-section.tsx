"use client";

import React, { useState } from "react";
import { DEMO_AI_INSIGHTS } from "@/data/demo-data";
import { DataCard } from "@/components/ui/data-card";
import { Sparkles, ShieldCheck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIInsightSection() {
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);
  const currentInsight = DEMO_AI_INSIGHTS[activeInsightIndex];

  return (
    <DataCard
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <span>Evidence-Grounded AI Civic Synthesis</span>
        </div>
      }
      subtitle="Automated cross-lingual synthesis linking citizen voice to municipal telemetry and engineering risks"
      action={
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--info-bg)] text-[var(--info-foreground)] border border-[var(--info-border)]">
            Grounding Confidence: {((currentInsight.confidenceScore ?? currentInsight.confidence) * 100).toFixed(0)}%
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Insight Header Selector */}
        <div className="flex gap-2 border-b border-[var(--border)] pb-3 overflow-x-auto">
          {DEMO_AI_INSIGHTS.map((insight, idx) => (
            <button
              key={insight.id}
              onClick={() => setActiveInsightIndex(idx)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all shrink-0 cursor-pointer",
                activeInsightIndex === idx
                  ? "bg-[var(--primary)] text-white shadow-2xs font-semibold"
                  : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
              )}
            >
              <div className="truncate max-w-[220px]">{insight.title}</div>
            </button>
          ))}
        </div>

        {/* Executive Headline & Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-base font-bold text-[var(--text)] leading-snug">
              {currentInsight.headline}
            </h4>
            <span className="text-[11px] text-[var(--text-secondary)] font-medium">
              Ingested {currentInsight.timestamp}
            </span>
          </div>

          <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--surface-subtle)] p-3.5 rounded-lg border border-[var(--border)]">
            {currentInsight.summaryText}
          </p>
        </div>

        {/* Key Drivers & Telemetry Corroboration */}
        <div>
          <h5 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Identified Empirical Drivers:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(currentInsight.keyDrivers ?? []).map((driver: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs flex items-start gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[var(--success)] shrink-0 mt-0.5" />
                <span className="text-[var(--text)] leading-tight">{driver}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Intervention Box */}
        <div className="p-3.5 rounded-lg bg-[var(--info-bg)] border border-[var(--info-border)] text-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-[var(--info-foreground)] uppercase tracking-wider text-[10px]">
              AI Recommended Civic Action
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
              Wards: {(currentInsight.affectedWards ?? []).join(", ")}
            </span>
          </div>
          <p className="text-[var(--text)] font-medium leading-relaxed">
            {currentInsight.recommendedIntervention}
          </p>
        </div>

        {/* Grounding Attribution Footnote */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-semibold text-[var(--text)]">Corroborated Sources:</span>
            <span>{currentInsight.groundingSources.join(" • ")}</span>
          </div>
          <span className="font-semibold text-[var(--text)]">
            {currentInsight.evidenceCount} verified signals
          </span>
        </div>
      </div>
    </DataCard>
  );
}
