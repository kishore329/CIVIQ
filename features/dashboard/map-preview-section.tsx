"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { DataCard } from "@/components/ui/data-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SeverityLevel } from "@/types/civic";
import {
  ZoomIn,
  ZoomOut,
  Filter,
  Navigation,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapPreviewSection() {
  const [activeLayer, setActiveLayer] = useState<"all" | "drainage" | "water" | "roads" | "power">("all");
  const [selectedPin, setSelectedPin] = useState<string | null>("pin-1");

  const pins = [
    {
      id: "pin-1",
      title: "Ward 14 Culvert Overflow",
      ward: "Ward 14 (Old Port)",
      category: "drainage",
      severity: "critical",
      reports: 421,
      x: "38%",
      y: "44%",
    },
    {
      id: "pin-2",
      title: "Line F-12 Main Fracture",
      ward: "Ward 07 (Industrial East)",
      category: "water",
      severity: "critical",
      reports: 184,
      x: "62%",
      y: "32%",
    },
    {
      id: "pin-3",
      title: "School Pedestrian Hazard",
      ward: "Ward 22 (Green Valley)",
      category: "roads",
      severity: "high",
      reports: 89,
      x: "54%",
      y: "68%",
    },
    {
      id: "pin-4",
      title: "Substation 4 Brownout",
      ward: "Ward 31 (University)",
      category: "power",
      severity: "medium",
      reports: 112,
      x: "24%",
      y: "72%",
    },
  ];

  const filteredPins =
    activeLayer === "all" ? pins : pins.filter((p) => p.category === activeLayer);

  const selectedData = pins.find((p) => p.id === selectedPin);

  return (
    <DataCard
      title="Development Intelligence Map"
      subtitle="Geospatial distribution of citizen signals, infrastructure risks, and capital priority zones"
      action={
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            GIS Ingestion Live
          </span>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filters
          </Button>
        </div>
      }
      noPadding
    >
      {/* Map Control Bar */}
      <div className="px-4 py-2.5 bg-[var(--surface-subtle)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mr-1">
            Layer:
          </span>
          {(
            [
              { id: "all", label: "All Hazards" },
              { id: "drainage", label: "Drainage / Flood" },
              { id: "water", label: "Water Mains" },
              { id: "roads", label: "Road & Safety" },
              { id: "power", label: "Power Grid" },
            ] as const
          ).map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer",
                activeLayer === layer.id
                  ? "bg-[var(--primary)] text-white shadow-2xs"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--border)]"
              )}
            >
              {layer.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <span className="text-[11px]">4 Wards Monitored</span>
          <span className="text-[var(--border-strong)]">|</span>
          <span className="text-[11px] font-medium text-[var(--text)]">127 Active Hazards</span>
        </div>
      </div>

      {/* Simulated Geospatial Canvas */}
      <div className="relative h-[380px] w-full bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center">
        {/* Subtle GIS Grid & Topography lines */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--text) 1px, transparent 1px), linear-gradient(to right, var(--text) 1px, transparent 1px), linear-gradient(to bottom, var(--text) 1px, transparent 1px)`,
            backgroundSize: "24px 24px, 120px 120px, 120px 120px",
          }}
        />

        {/* Ward Boundary Polygon Mockups */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-30">
          <polygon
            points="120,60 380,40 430,220 200,260 80,180"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="240" y="140" fill="var(--text-secondary)" fontSize="11" fontWeight="600">
            WARD 14 (OLD PORT)
          </text>

          <polygon
            points="430,40 760,80 720,290 430,220"
            fill="none"
            stroke="var(--info)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="560" y="160" fill="var(--text-secondary)" fontSize="11" fontWeight="600">
            WARD 07 (INDUSTRIAL EAST)
          </text>

          <polygon
            points="180,260 480,230 520,360 220,360"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="320" y="310" fill="var(--text-secondary)" fontSize="11" fontWeight="600">
            WARD 22 (GREEN VALLEY)
          </text>
        </svg>

        {/* Hazard Hotspot Pins */}
        {filteredPins.map((pin) => {
          const isSelected = selectedPin === pin.id;
          const isCritical = pin.severity === "critical";

          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin.id)}
              style={{ left: pin.x, top: pin.y }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-10 transition-transform",
                isSelected && "scale-110 z-20"
              )}
              aria-label={`${pin.title} in ${pin.ward}`}
            >
              <div className="relative flex items-center justify-center">
                {isCritical && (
                  <span className="absolute w-8 h-8 rounded-full bg-[var(--critical)] opacity-35 animate-ping" />
                )}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 transition-all",
                    isCritical
                      ? "bg-[var(--critical)] border-white text-white"
                      : "bg-[var(--accent)] border-white text-white",
                    isSelected && "ring-3 ring-[var(--ring)]"
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Pin Callout Badge */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap shadow-sm border transition-opacity",
                  isSelected
                    ? "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] opacity-100"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] opacity-80 group-hover:opacity-100"
                )}
              >
                {pin.title} ({pin.reports})
              </div>
            </button>
          );
        })}

        {/* Selected Pin Detail Card Overlay */}
        {selectedData && (
          <div className="absolute left-4 bottom-4 z-20 max-w-xs w-full bg-[var(--surface)]/95 backdrop-blur-sm p-3.5 rounded-lg border border-[var(--border)] shadow-lg animate-in fade-in-0 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                  {selectedData.ward}
                </span>
                <h4 className="text-xs font-bold text-[var(--text)] leading-tight mt-0.5">
                  {selectedData.title}
                </h4>
              </div>
              <StatusBadge
                severity={selectedData.severity as SeverityLevel}
                size="sm"
              />
            </div>
            <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span>{selectedData.reports} verified citizen signals</span>
              <span className="font-semibold text-[var(--accent)] cursor-pointer hover:underline">
                View Project &rarr;
              </span>
            </div>
          </div>
        )}

        {/* Map Navigational Controls overlay */}
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-1 shadow-sm">
          <button
            className="p-1.5 rounded hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text)]"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text)]"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="h-px bg-[var(--border)] my-0.5" />
          <button
            className="p-1.5 rounded hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text)]"
            title="Reset Orientation"
            aria-label="Reset Orientation"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute right-4 bottom-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[var(--surface)]/90 backdrop-blur-xs border border-[var(--border)] text-[11px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--critical)]" />
            <span>Critical Hazard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
            <span>High Severity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 border-t-2 border-dashed border-[var(--primary)]" />
            <span>Ward Zone</span>
          </div>
        </div>
      </div>
    </DataCard>
  );
}
