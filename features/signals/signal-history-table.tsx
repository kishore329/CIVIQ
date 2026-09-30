"use client";

import React, { useState, useMemo } from "react";
import { CiviqSignal, SeverityLevel, SignalStatus, SignalSource } from "@/types/civic";
import { SignalDetailModal } from "./signal-detail-modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Type,
  Mic,
  Image as ImageIcon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Globe2,
  RotateCcw,
} from "lucide-react";

interface SignalHistoryTableProps {
  signals: CiviqSignal[];
}

function getSeverityBadge(severity?: SeverityLevel) {
  switch (severity) {
    case "critical":
    case "high":
      return {
        bg: "bg-[var(--critical-bg)]",
        text: "text-[var(--critical-foreground)]",
        border: "border-[var(--critical-border)]",
        label: (severity || "high").toUpperCase(),
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
        label: (severity || "low").toUpperCase(),
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

function getSourceIcon(source: SignalSource) {
  switch (source) {
    case "voice":
      return Mic;
    case "image":
      return ImageIcon;
    case "text":
    default:
      return Type;
  }
}

export function SignalHistoryTable({ signals }: SignalHistoryTableProps) {
  const [selectedSignal, setSelectedSignal] = useState<CiviqSignal | null>(null);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filteredSignals = useMemo(() => {
    return signals.filter((sig) => {
      // Search text
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesId = sig.signalId.toLowerCase().includes(q);
        const matchesCategory = sig.category.toLowerCase().includes(q);
        const matchesSubcategory = sig.subcategory?.toLowerCase().includes(q);
        const matchesText = sig.text?.toLowerCase().includes(q);
        const matchesTranscript = sig.transcript?.toLowerCase().includes(q);
        const matchesArea = sig.area?.toLowerCase().includes(q);
        if (!matchesId && !matchesCategory && !matchesSubcategory && !matchesText && !matchesTranscript && !matchesArea) {
          return false;
        }
      }

      // Ward filter
      if (wardFilter !== "all" && sig.ward !== wardFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && sig.status !== statusFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter !== "all" && sig.source !== sourceFilter) {
        return false;
      }

      return true;
    });
  }, [signals, search, wardFilter, statusFilter, sourceFilter]);

  const resetFilters = () => {
    setSearch("");
    setWardFilter("all");
    setStatusFilter("all");
    setSourceFilter("all");
  };

  const hasActiveFilters = search || wardFilter !== "all" || statusFilter !== "all" || sourceFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search Signal ID, keyword, locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            options={[
              { value: "all", label: "All Wards" },
              { value: "ward-01", label: "Ward 01 — Anna Nagar" },
              { value: "ward-04", label: "Ward 04 — Adyar" },
              { value: "ward-08", label: "Ward 08 — Kodambakkam" },
              { value: "ward-09", label: "Ward 09 — Alandur" },
              { value: "ward-10", label: "Ward 10 — Perungudi" },
              { value: "ward-17", label: "Ward 17 — Sholinganallur" },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "All Telemetry Statuses" },
              { value: "received", label: "Received" },
              { value: "analyzed", label: "Analyzed" },
              { value: "clustered", label: "Clustered" },
              { value: "under_review", label: "Under Review" },
              { value: "validated", label: "Validated" },
              { value: "resolved", label: "Resolved" },
            ]}
          />

          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            options={[
              { value: "all", label: "All Input Sources" },
              { value: "text", label: "Text Messages" },
              { value: "voice", label: "Voice Recordings" },
              { value: "image", label: "Visual Images" },
            ]}
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">
              Showing {filteredSignals.length} of {signals.length} signals
            </span>
            <button
              onClick={resetFilters}
              className="text-[var(--primary)] hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Signals Table */}
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Signal ID</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Ward</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredSignals.length > 0 ? (
                filteredSignals.map((signal) => {
                  const sevBadge = getSeverityBadge(signal.severity);
                  const SevIcon = sevBadge.icon;
                  const statusBadge = getStatusBadge(signal.status);
                  const SourceIcon = getSourceIcon(signal.source);

                  const timeString = new Date(signal.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={signal.id}
                      onClick={() => setSelectedSignal(signal)}
                      className="hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group"
                    >
                      {/* Signal ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[var(--primary)] whitespace-nowrap">
                        {signal.signalId}
                      </td>

                      {/* Issue */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[var(--text)]">
                          {signal.category}
                        </div>
                        {signal.subcategory && (
                          <div className="text-[11px] text-[var(--text-secondary)] truncate max-w-[180px]">
                            {signal.subcategory}
                          </div>
                        )}
                      </td>

                      {/* Ward */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[var(--text)] font-medium">
                          <MapPin className="w-3 h-3 text-[var(--accent)] shrink-0" />
                          <span>{signal.ward.replace("ward-", "Ward ")}</span>
                        </div>
                        {signal.area && (
                          <div className="text-[10px] text-[var(--text-tertiary)] truncate max-w-[140px]">
                            {signal.area}
                          </div>
                        )}
                      </td>

                      {/* Language */}
                      <td className="py-3.5 px-4 capitalize text-[var(--text-secondary)] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Globe2 className="w-3 h-3 text-[var(--text-tertiary)]" />
                          <span>{signal.language}</span>
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${sevBadge.bg} ${sevBadge.text} ${sevBadge.border}`}
                        >
                          <SevIcon className="w-3 h-3" />
                          {sevBadge.label}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[var(--text)] font-medium capitalize">
                          <SourceIcon className="w-3.5 h-3.5 text-[var(--primary)]" />
                          <span>{signal.source}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                        {timeString}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSignal(signal);
                          }}
                          className="h-7 px-2 text-xs text-[var(--text-secondary)] group-hover:text-[var(--primary)]"
                          aria-label={`View details for ${signal.signalId}`}
                        >
                          Details
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sm text-[var(--text-secondary)]">
                    No citizen signals matched your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <SignalDetailModal
        signal={selectedSignal}
        open={Boolean(selectedSignal)}
        onOpenChange={(open) => !open && setSelectedSignal(null)}
      />
    </div>
  );
}
