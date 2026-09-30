"use client";

import React from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Tag, ShieldCheck } from "lucide-react";

export const WARD_OPTIONS = [
  { value: "", label: "Select a Ward (Required)..." },
  { value: "ward-01", label: "Ward 01 — Anna Nagar" },
  { value: "ward-02", label: "Ward 02 — T. Nagar" },
  { value: "ward-03", label: "Ward 03 — Mylapore" },
  { value: "ward-04", label: "Ward 04 — Adyar" },
  { value: "ward-05", label: "Ward 05 — Velachery" },
  { value: "ward-06", label: "Ward 06 — Guindy" },
  { value: "ward-07", label: "Ward 07 — Saidapet" },
  { value: "ward-08", label: "Ward 08 — Kodambakkam" },
  { value: "ward-09", label: "Ward 09 — Alandur" },
  { value: "ward-10", label: "Ward 10 — Perungudi" },
  { value: "ward-17", label: "Ward 17 — Sholinganallur" },
];

export const CATEGORY_OPTIONS = [
  { value: "auto", label: "Let CIVIQ determine automatically (Recommended)" },
  { value: "Roads", label: "Roads & Pavements" },
  { value: "Drainage", label: "Drainage & Stormwater" },
  { value: "Water", label: "Water Supply & Quality" },
  { value: "Healthcare", label: "Healthcare Facilities" },
  { value: "Education", label: "Schools & Educational Infrastructure" },
  { value: "Streetlights", label: "Streetlights & Electrical" },
  { value: "Waste Management", label: "Waste Management & Sanitation" },
  { value: "Public Transport", label: "Public Transport & Bus Shelters" },
  { value: "Other", label: "Other Civic Infrastructure" },
];

interface LocationSelectorProps {
  ward: string;
  onWardChange: (ward: string) => void;
  area: string;
  onAreaChange: (area: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  wardError?: string;
}

export function LocationSelector({
  ward,
  onWardChange,
  area,
  onAreaChange,
  category,
  onCategoryChange,
  wardError,
}: LocationSelectorProps) {
  return (
    <div className="space-y-4 p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[var(--text)]">Where is the issue?</h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Geographic context enables CIVIQ to cross-reference historical ward telemetry and cluster nearby signals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ward Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="ward-select" className="block text-xs font-medium text-[var(--text)]">
            Ward <span className="text-[var(--critical)]">*</span>
          </label>
          <Select
            id="ward-select"
            value={ward}
            onChange={(e) => onWardChange(e.target.value)}
            options={WARD_OPTIONS}
            error={wardError}
            aria-required="true"
            aria-invalid={!!wardError}
          />
        </div>

        {/* Area / Locality */}
        <div className="space-y-1.5">
          <label htmlFor="area-input" className="block text-xs font-medium text-[var(--text)]">
            Area / Locality <span className="text-[var(--text-tertiary)] font-normal">(Optional landmark)</span>
          </label>
          <Input
            id="area-input"
            value={area}
            onChange={(e) => onAreaChange(e.target.value)}
            placeholder="e.g. Near Government School, 4th Cross"
            maxLength={100}
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-1.5 pt-1 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <label htmlFor="category-select" className="flex items-center gap-1.5 text-xs font-medium text-[var(--text)]">
            <Tag className="w-3.5 h-3.5 text-[var(--text-secondary)]" aria-hidden="true" />
            Infrastructure Category <span className="text-[var(--text-tertiary)] font-normal">(Optional)</span>
          </label>
        </div>
        <Select
          id="category-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={CATEGORY_OPTIONS}
        />
        <p className="text-[11px] text-[var(--text-secondary)]">
          CIVIQ AI automatically detects categories from descriptions, transcripts, or visual evidence.
        </p>
      </div>

      {/* Privacy Guarantee Reassurance */}
      <div className="flex items-center gap-2 pt-2 text-[11px] text-[var(--text-tertiary)] border-t border-[var(--border-subtle)]">
        <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)] shrink-0" aria-hidden="true" />
        <span>Privacy conscious: No personal identity, phone, or Aadhaar required.</span>
      </div>
    </div>
  );
}
