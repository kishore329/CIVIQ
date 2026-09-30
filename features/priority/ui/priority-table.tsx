"use client";

import React, { useState, useMemo } from "react";
import { PriorityAssessment } from "../priorityTypes";
import { PriorityDetailDrawer } from "./priority-detail-drawer";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  MapPin,
  Radio,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface PriorityTableProps {
  assessments: PriorityAssessment[];
}

type SortField = "priorityIndex" | "signalCount" | "infrastructureGap" | "affectedPopulation";
type SortOrder = "asc" | "desc";

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

export function PriorityTable({ assessments }: PriorityTableProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<PriorityAssessment | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [bandFilter, setBandFilter] = useState("all");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("priorityIndex");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    return assessments
      .filter((item) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCode = item.clusterCode.toLowerCase().includes(q);
          const matchArea = item.area.toLowerCase().includes(q);
          const matchSubcat = item.subcategory.toLowerCase().includes(q);
          if (!matchTitle && !matchCode && !matchArea && !matchSubcat) return false;
        }
        if (wardFilter !== "all" && item.ward !== wardFilter) return false;
        if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
        if (bandFilter !== "all" && item.attentionBand !== bandFilter) return false;
        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortField === "priorityIndex") {
          valA = a.priorityIndex;
          valB = b.priorityIndex;
        } else if (sortField === "signalCount") {
          valA = a.signalCount;
          valB = b.signalCount;
        } else if (sortField === "infrastructureGap") {
          valA = a.factors.infrastructureGap;
          valB = b.factors.infrastructureGap;
        } else if (sortField === "affectedPopulation") {
          valA = a.affectedPopulation;
          valB = b.affectedPopulation;
        }
        return sortOrder === "asc" ? valA - valB : valB - valA;
      });
  }, [assessments, search, wardFilter, categoryFilter, bandFilter, sortField, sortOrder]);

  const handleResetFilters = () => {
    setSearch("");
    setWardFilter("all");
    setCategoryFilter("all");
    setBandFilter("all");
  };

  const hasActiveFilters = search || wardFilter !== "all" || categoryFilter !== "all" || bandFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search by issue title, cluster code, locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            options={[
              { value: "all", label: "All 10 Wards" },
              { value: "ward-01", label: "Ward 01 — Anna Nagar" },
              { value: "ward-02", label: "Ward 02 — T. Nagar" },
              { value: "ward-04", label: "Ward 04 — Adyar" },
              { value: "ward-05", label: "Ward 05 — Velachery" },
              { value: "ward-08", label: "Ward 08 — Kodambakkam" },
              { value: "ward-09", label: "Ward 09 — Alandur" },
              { value: "ward-10", label: "Ward 10 — Perungudi" },
              { value: "ward-17", label: "Ward 17 — Sholinganallur" },
            ]}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "all", label: "All Infrastructure Categories" },
              { value: "Drainage", label: "Drainage & Stormwater" },
              { value: "Roads", label: "Roads & Pavements" },
              { value: "Water", label: "Water Supply" },
              { value: "Healthcare", label: "Healthcare Access" },
              { value: "Streetlights", label: "Streetlights" },
              { value: "Waste Management", label: "Waste Management" },
              { value: "Public Transport", label: "Public Transport" },
            ]}
          />

          <Select
            value={bandFilter}
            onChange={(e) => setBandFilter(e.target.value)}
            options={[
              { value: "all", label: "All Attention Bands" },
              { value: "High Attention", label: "High Attention (75–89)" },
              { value: "Very High Attention", label: "Very High Attention (90–100)" },
              { value: "Elevated Attention", label: "Elevated Attention (60–74)" },
              { value: "Moderate Attention", label: "Moderate Attention (40–59)" },
            ]}
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <span>
              Showing <strong className="text-[var(--text)]">{filteredAndSorted.length}</strong> of {assessments.length} prioritised interventions
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[var(--primary)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table for Desktop & Tablet */}
      <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Issue & Cluster</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Ward</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort("priorityIndex")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Priority Index</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Attention Band</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort("signalCount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Signals</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort("infrastructureGap")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Modelled Gap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort("affectedPopulation")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Beneficiaries</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((item) => {
                  const attentionBadge = getAttentionBadge(item.attentionBand);
                  const AttentionIcon = attentionBadge.icon;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedAssessment(item)}
                      className="hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group"
                    >
                      {/* Issue & Code */}
                      <td className="py-3.5 px-4 max-w-[260px]">
                        <span className="font-mono text-[10px] text-[var(--primary)] font-bold block mb-0.5">
                          {item.clusterCode}
                        </span>
                        <div className="font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {item.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[11px] font-medium text-[var(--text)]">
                          {item.category}
                        </span>
                      </td>

                      {/* Ward */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium text-[var(--text)]">
                          <MapPin className="w-3 h-3 text-[var(--accent)] shrink-0" />
                          <span>{item.wardName.replace(/ — .*/, "")}</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-tertiary)] truncate block max-w-[130px]">
                          {item.area}
                        </span>
                      </td>

                      {/* Priority Index */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono">
                        <span className="text-sm font-extrabold text-[var(--primary)] px-2 py-0.5 rounded bg-[var(--primary-subtle)] border border-[var(--border)]">
                          {item.priorityIndex} / 100
                        </span>
                      </td>

                      {/* Attention Band */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${attentionBadge.bg}`}
                        >
                          <AttentionIcon className="w-3 h-3" />
                          <span>{item.attentionBand}</span>
                        </span>
                      </td>

                      {/* Signals Count */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-medium text-[var(--text)]">
                        <div className="flex items-center justify-end gap-1">
                          <Radio className="w-3 h-3 text-[var(--primary)]" />
                          <span>{item.signalCount}</span>
                        </div>
                      </td>

                      {/* Infrastructure Gap */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-medium text-[var(--text)]">
                        <span>{item.factors.infrastructureGap} / 100</span>
                      </td>

                      {/* Beneficiaries */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-medium text-[var(--text)]">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="w-3 h-3 text-[var(--text-secondary)]" />
                          <span>{item.affectedPopulation.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Review Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {item.reviewStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAssessment(item);
                          }}
                          className="h-7 px-2 text-xs text-[var(--text-secondary)] group-hover:text-[var(--primary)]"
                          aria-label={`View analysis for ${item.clusterCode}`}
                        >
                          Analysis
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-sm text-[var(--text-secondary)]">
                    No infrastructure priorities matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <PriorityDetailDrawer
        assessment={selectedAssessment}
        open={Boolean(selectedAssessment)}
        onOpenChange={(open) => !open && setSelectedAssessment(null)}
      />
    </div>
  );
}
