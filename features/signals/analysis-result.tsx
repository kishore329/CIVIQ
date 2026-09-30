"use client";

import React, { useState } from "react";
import { AIAnalysisResult, SeverityLevel, SignalSource } from "@/types/civic";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  Users,
  Globe2,
  FileCheck2,
  ArrowUpRight,
  RotateCcw,
  HelpCircle,
  Cpu,
  Compass,
  FileText,
  Workflow,
} from "lucide-react";

interface AnalysisResultProps {
  signalId: string;
  source: SignalSource;
  analysis: AIAnalysisResult;
  onReset: () => void;
  onViewHistory: () => void;
}

function getSeverityBadge(severity: SeverityLevel, score?: number) {
  const scoreLabel = score ? `${score}/10` : "";
  switch (severity) {
    case "critical":
    case "high":
      return {
        bg: "bg-[var(--critical-bg)]",
        text: "text-[var(--critical-foreground)]",
        border: "border-[var(--critical-border)]",
        label: scoreLabel ? `HIGH (${scoreLabel})` : "HIGH",
        icon: AlertTriangle,
      };
    case "medium":
      return {
        bg: "bg-[var(--warning-bg)]",
        text: "text-[var(--warning-foreground)]",
        border: "border-[var(--warning-border)]",
        label: scoreLabel ? `MEDIUM (${scoreLabel})` : "MEDIUM",
        icon: Clock,
      };
    case "low":
    default:
      return {
        bg: "bg-[var(--surface-subtle)]",
        text: "text-[var(--text-secondary)]",
        border: "border-[var(--border)]",
        label: scoreLabel ? `LOW (${scoreLabel})` : "LOW",
        icon: CheckCircle2,
      };
  }
}

export function AnalysisResult({
  signalId,
  source,
  analysis,
  onReset,
  onViewHistory,
}: AnalysisResultProps) {
  const [showConfidenceTooltip, setShowConfidenceTooltip] = useState(false);

  const isGemini = analysis.mode === "gemini";
  const sevBadge = getSeverityBadge(analysis.severity, analysis.severityScore);
  const urgBadge = getSeverityBadge(analysis.urgency);
  const SevIcon = sevBadge.icon;
  const UrgIcon = urgBadge.icon;

  const confidencePct = Math.round(analysis.confidence * 100);

  // Pipeline steps: Input → Language → Category → Severity → Urgency → Location → Affected Group
  const pipelineSteps = [
    { step: 1, label: "Input Format", value: source.toUpperCase(), icon: FileCheck2 },
    { step: 2, label: "Language", value: analysis.language, icon: Globe2 },
    { step: 3, label: "Category", value: analysis.category, icon: Layers },
    { step: 4, label: "Severity", value: analysis.severityScore ? `${analysis.severityScore} / 10` : analysis.severity.toUpperCase(), icon: AlertTriangle },
    { step: 5, label: "Urgency", value: analysis.urgency.toUpperCase(), icon: Clock },
    { step: 6, label: "Location", value: `Ward ${analysis.ward}`, icon: MapPin },
    { step: 7, label: "Affected Group", value: analysis.affectedGroup, icon: Users },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Banner with Signal ID and Engine Status */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--primary)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-subtle)] flex items-center justify-center text-[var(--primary)] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                  Signal Ingested
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text)]">
                  {signalId}
                </span>
                {isGemini ? (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                    <Sparkles className="w-3 h-3" /> Live Gemini AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                    <Cpu className="w-3 h-3" /> Demo AI Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Your signal has been added to the CIVIQ intelligence pipeline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onViewHistory} className="text-xs h-8">
              View in Signal History
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
            <Button variant="secondary" size="sm" onClick={onReset} className="text-xs h-8">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Submit Another
            </Button>
          </div>
        </div>
      </div>

      {/* CIVIQ UNDERSTANDING Card */}
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
        {/* Header with Mode Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-subtle)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-sm font-bold text-[var(--text)] tracking-tight">CIVIQ UNDERSTANDING</h3>
          </div>
          <div className="flex items-center gap-2">
            {isGemini ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--primary-subtle)] text-[var(--primary)] border border-[var(--primary)]">
                <Sparkles className="w-3 h-3" />
                AI-ASSISTED ANALYSIS
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--border)]">
                <Cpu className="w-3 h-3" />
                DEMO AI ANALYSIS
              </span>
            )}
          </div>
        </div>

        {/* Intelligence Data Grid */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Detected Issue */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                Issue
              </span>
              <p className="text-sm font-bold text-[var(--text)]">{analysis.category}</p>
            </div>

            {/* Subcategory */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                Subcategory
              </span>
              <p className="text-sm font-semibold text-[var(--text)]">{analysis.subcategory}</p>
            </div>

            {/* Severity */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                Severity
              </span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border border-current">
                <SevIcon className="w-3.5 h-3.5" />
                <span>{analysis.severityScore ? `${analysis.severityScore} / 10` : sevBadge.label}</span>
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                Urgency
              </span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border border-current">
                <UrgIcon className="w-3.5 h-3.5" />
                <span>{urgBadge.label}</span>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                Language
              </span>
              <p className="text-sm font-semibold text-[var(--text)]">{analysis.language}</p>
            </div>

            {/* Ward */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                Ward
              </span>
              <p className="text-sm font-bold text-[var(--text)]">Ward {analysis.ward}</p>
            </div>

            {/* Affected Group */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                Affected Group
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold text-[var(--text)]">
                <Users className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>{analysis.affectedGroup}</span>
              </div>
            </div>

            {/* Confidence with Tooltip */}
            <div className="space-y-1 relative">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                  AI Confidence
                </span>
                <button
                  type="button"
                  onClick={() => setShowConfidenceTooltip((prev) => !prev)}
                  onMouseEnter={() => setShowConfidenceTooltip(true)}
                  onMouseLeave={() => setShowConfidenceTooltip(false)}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text)] transition-colors"
                  aria-label="Confidence tooltip"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>

              {/* Tooltip Overlay */}
              {showConfidenceTooltip && (
                <div className="absolute z-20 left-0 bottom-full mb-1 w-64 p-2 rounded-md bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] text-[var(--text)] shadow-lg leading-tight">
                  Model confidence in its interpretation of the submitted information. It is not a measure of factual verification.
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex-1 max-w-[80px] h-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-[var(--primary)]">{confidencePct}%</span>
              </div>
            </div>
          </div>

          {/* AI Summary Quote */}
          <div className="p-3.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] block">
              Factual Synthesis Summary
            </span>
            <p className="text-xs italic text-[var(--text)] leading-relaxed">
              &ldquo;{analysis.summary}&rdquo;
            </p>
          </div>

          {/* Reasoning & Recommended Next Step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Reasoning */}
            <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-[var(--primary)]" />
                Interpretation Reasoning
              </span>
              <p className="text-xs text-[var(--text)] leading-relaxed">
                {analysis.reasoning || "Interpreted based on reported civic conditions and affected demographic groups."}
              </p>
            </div>

            {/* Recommended Next Step */}
            <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
                Recommended Next Step
              </span>
              <p className="text-xs text-[var(--text)] leading-relaxed">
                {analysis.recommendedNextStep || "Review infrastructure telemetry and field records for the reported area."}
              </p>
              <span className="text-[10px] text-[var(--text-tertiary)] block mt-1">
                * Non-binding advisory next step; not an official government decision.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HOW CIVIQ INTERPRETED THIS SIGNAL Pipeline Section */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--primary)]" />
            How CIVIQ Interpreted This Signal
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Sequential intelligence transformation from unstructured citizen communication into structured civic telemetry:
          </p>
        </div>

        {/* Visual Pipeline / Progression */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[var(--text-tertiary)]">
                      0{step.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-[var(--primary)]" />
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] block font-medium">
                    {step.label}
                  </span>
                </div>
                <p className="text-xs font-bold text-[var(--text)] mt-2 truncate">
                  {step.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsible AI Notice */}
      <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text)]">Responsible AI Notice:</strong> CIVIQ uses AI to interpret submitted citizen signals and synthesize civic priorities. AI-generated analysis is an advisory decision-support tool and does not constitute an official municipal approval, budgetary allocation, or verified legal finding.
        </p>
      </div>
    </div>
  );
}
