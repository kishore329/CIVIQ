"use client";

import React from "react";
import { CiviqSignal, SeverityLevel, SignalStatus } from "@/types/civic";
import { Dialog } from "@/components/ui/dialog";
import {
  Type,
  Mic,
  Image as ImageIcon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  FileText,
  HelpCircle,
  Tag,
  Globe2,
} from "lucide-react";

interface SignalDetailModalProps {
  signal: CiviqSignal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getSeverityBadge(severity?: SeverityLevel) {
  switch (severity) {
    case "critical":
    case "high":
      return {
        bg: "bg-[var(--critical-bg)]",
        text: "text-[var(--critical-foreground)]",
        border: "border-[var(--critical-border)]",
        label: severity.toUpperCase(),
        icon: AlertTriangle,
      };
    case "medium":
      return {
        bg: "bg-[var(--warning-bg)]",
        text: "text-[var(--warning-foreground)]",
        border: "border-[var(--warning-border)]",
        label: "MEDIUM",
        icon: Clock,
      };
    case "low":
    default:
      return {
        bg: "bg-[var(--surface-subtle)]",
        text: "text-[var(--text-secondary)]",
        border: "border-[var(--border)]",
        label: (severity || "LOW").toUpperCase(),
        icon: CheckCircle2,
      };
  }
}

function getStatusBadge(status: SignalStatus) {
  switch (status) {
    case "received":
      return { label: "Received", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" };
    case "analyzed":
      return { label: "Analyzed", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" };
    case "clustered":
      return { label: "Clustered", bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" };
    case "under_review":
      return { label: "Under Review", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
    case "validated":
      return { label: "Validated", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
    case "resolved":
      return { label: "Resolved", bg: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" };
    default:
      return { label: status, bg: "bg-gray-500/10 text-gray-600 border-gray-500/20" };
  }
}

export function SignalDetailModal({ signal, open, onOpenChange }: SignalDetailModalProps) {
  if (!signal) return null;

  const sevBadge = getSeverityBadge(signal.severity);
  const SevIcon = sevBadge.icon;
  const statusBadge = getStatusBadge(signal.status);

  const formattedDate = new Date(signal.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-6 max-h-[82vh] overflow-y-auto pr-1">
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-mono text-sm font-bold text-[var(--primary)] bg-[var(--primary-subtle)] px-2.5 py-0.5 rounded border border-[var(--border)]">
              {signal.signalId}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusBadge.bg}`}>
                {statusBadge.label}
              </span>
              <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border font-semibold ${sevBadge.bg} ${sevBadge.text} ${sevBadge.border}`}>
                <SevIcon className="w-3 h-3" />
                <span>{sevBadge.label}</span>
              </div>
            </div>
          </div>
          <h2 className="text-base font-bold text-[var(--text)]">
            {signal.subcategory || signal.category}
          </h2>
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-1.5 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
              {signal.ward.replace("ward-", "Ward ")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* SECTION 1: CITIZEN-PROVIDED INFORMATION */}
        <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              Citizen-Provided Information
            </h3>
            <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide">
              Raw Citizen Input
            </span>
          </div>

          {/* Input Format & Language Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]">
              {signal.source === "voice" ? <Mic className="w-3 h-3 text-[var(--primary)]" /> : signal.source === "image" ? <ImageIcon className="w-3 h-3 text-[var(--primary)]" /> : <Type className="w-3 h-3 text-[var(--primary)]" />}
              Source: <strong className="capitalize">{signal.source}</strong>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]">
              <Globe2 className="w-3 h-3 text-[var(--primary)]" />
              Language: <strong className="capitalize">{signal.language}</strong>
            </span>
            {signal.area && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]">
                <MapPin className="w-3 h-3 text-[var(--accent)]" />
                Area: <strong>{signal.area}</strong>
              </span>
            )}
          </div>

          {/* Original Text or Voice Transcript */}
          {(signal.text || signal.transcript) && (
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                {signal.source === "voice" ? "Audio Transcript:" : "Description:"}
              </span>
              <p className="text-xs p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text)] leading-relaxed">
                {signal.transcript || signal.text}
              </p>
            </div>
          )}

          {/* Image Evidence Preview */}
          {signal.imageUrl && (
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                Visual Evidence Attached:
              </span>
              <div className="relative rounded-lg overflow-hidden border border-[var(--border)] bg-black/10 max-h-48 flex items-center justify-center p-2">
                <img
                  src={signal.imageUrl}
                  alt="Visual evidence submitted with civic signal"
                  className="max-h-44 object-contain rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: AI-GENERATED INTERPRETATION */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--primary)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Generated Interpretation
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--border)]">
              DEMO AI ANALYSIS
            </span>
          </div>

          {signal.aiAnalysis ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] block">Category</span>
                  <span className="font-bold text-[var(--text)]">{signal.aiAnalysis.category}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] block">Subcategory</span>
                  <span className="font-semibold text-[var(--text)]">{signal.aiAnalysis.subcategory}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] block">Affected Group</span>
                  <span className="font-semibold text-[var(--text)]">{signal.aiAnalysis.affectedGroup}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] block">Urgency</span>
                  <span className="font-bold text-[var(--text)] uppercase">{signal.aiAnalysis.urgency}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] block">Grounding Confidence</span>
                  <span className="font-mono font-bold text-[var(--primary)]">
                    {Math.round(signal.aiAnalysis.confidence * 100)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-tertiary)] block">Normalized Ward</span>
                  <span className="font-bold text-[var(--text)]">Ward {signal.aiAnalysis.ward}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">
                  AI Synthesized Summary
                </span>
                <p className="text-xs text-[var(--text)] leading-relaxed italic">
                  &ldquo;{signal.aiAnalysis.summary}&rdquo;
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-secondary)]">
              AI analysis queued. Scheduled for clustering in next batch.
            </p>
          )}

          <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5 pt-1 border-t border-[var(--border-subtle)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
            <span>AI analysis is not an official government verdict and requires field engineering review.</span>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
