"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw, AlertTriangle, Layers } from "lucide-react";
import { WARD_OPTIONS, CATEGORY_OPTIONS } from "@/features/signals/location-selector";

interface ClusterFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  ward: string;
  onWardChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  priorityOnly: boolean;
  onPriorityOnlyToggle: () => void;
  onReset: () => void;
  totalFiltered: number;
  totalClusters: number;
}

export function ClusterFilterBar({
  search,
  onSearchChange,
  ward,
  onWardChange,
  category,
  onCategoryChange,
  priorityOnly,
  onPriorityOnlyToggle,
  onReset,
  totalFiltered,
  totalClusters,
}: ClusterFilterBarProps) {
  const hasActiveFilters = Boolean(search || ward !== "all" || category !== "all" || !priorityOnly);

  return (
    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <Input
          placeholder="Search by cluster code, locality, title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        {/* Ward Filter */}
        <Select
          value={ward}
          onChange={(e) => onWardChange(e.target.value)}
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

        {/* Category Filter */}
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={[
            { value: "all", label: "All Infrastructure Categories" },
            { value: "Drainage", label: "Drainage & Stormwater" },
            { value: "Roads", label: "Roads & Transit" },
            { value: "Water", label: "Water Supply" },
            { value: "Healthcare", label: "Healthcare Access" },
            { value: "Streetlights", label: "Streetlights" },
            { value: "Waste Management", label: "Waste Management" },
            { value: "Public Transport", label: "Public Transport" },
          ]}
        />

        {/* Priority Toggle Button */}
        <Button
          type="button"
          variant={priorityOnly ? "primary" : "outline"}
          onClick={onPriorityOnlyToggle}
          className="text-xs h-9 justify-center gap-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {priorityOnly ? "23 High-Priority Clusters" : "All 127 Issues"}
        </Button>
      </div>

      {/* Filter status row */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">
        <span>
          Displaying <strong className="text-[var(--text)]">{totalFiltered}</strong> of {totalClusters} issue clusters
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-[var(--primary)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
