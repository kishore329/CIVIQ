"use client";

import React, { useState } from "react";
import { getCitizenTrends } from "@/lib/data/dashboard";
import { DataCard } from "@/components/ui/data-card";
import { TrendDataPoint } from "@/types/civic";
import { TrendingUp, AlertTriangle } from "lucide-react";

export function CitizenTrendsSection() {
  const trends = getCitizenTrends();
  const [hoveredPoint, setHoveredPoint] = useState<TrendDataPoint | null>(null);

  // SVG dimensions
  const width = 640;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 28;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxSignals = 250;
  const minSignals = 120;

  const points = trends.map((item, idx) => {
    const x = paddingLeft + (idx / (trends.length - 1)) * chartWidth;
    const y =
      paddingTop + chartHeight - ((item.signals - minSignals) / (maxSignals - minSignals)) * chartHeight;
    return { ...item, x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${
    paddingTop + chartHeight
  } Z`;

  return (
    <DataCard
      title={
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
          <span>CITIZEN SIGNAL TRENDS (30 DAYS)</span>
        </div>
      }
      subtitle="How citizen demand is changing over time across the 30-day monitoring window"
      action={
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
            Daily Signals
          </span>
          <span className="flex items-center gap-1 text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--critical)]" />
            Critical Spikes
          </span>
        </div>
      }
    >
      <div className="relative w-full overflow-hidden">
        {/* Responsive SVG Line Chart */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[220px] overflow-visible select-none"
        >
          {/* Subtle Horizontal Grid lines */}
          {[140, 180, 220].map((val) => {
            const y = paddingTop + chartHeight - ((val - minSignals) / (maxSignals - minSignals)) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill under curve */}
          <path d={areaD} fill="var(--info-bg)" opacity="0.65" />

          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredPoint?.day === pt.day;
            const isSpike = pt.critical >= 40;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5 : isSpike ? 4 : 3}
                  fill={isSpike ? "var(--critical)" : "var(--accent)"}
                  stroke="var(--surface)"
                  strokeWidth="2"
                  className="transition-all"
                />
                {/* X Axis Date Labels */}
                {idx % 3 === 0 && (
                  <text
                    x={pt.x}
                    y={height - 6}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="9"
                    fontWeight="500"
                  >
                    {pt.date}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hovered Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border)] p-2.5 rounded-lg shadow-md text-xs flex items-center gap-3 pointer-events-none animate-in fade-in-0 duration-100">
            <span className="font-bold text-[var(--text)]">{hoveredPoint.date} ({hoveredPoint.day})</span>
            <span className="text-[var(--accent)] font-mono font-bold">{hoveredPoint.signals} Total Signals</span>
            <span className="text-[var(--critical)] font-mono font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {hoveredPoint.critical} Critical
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
        <span>Monsoon precipitation surge recorded Days 17–21 (+34% signals)</span>
        <span className="font-semibold text-[var(--success)]">Current Trajectory: Stabilizing</span>
      </div>
    </DataCard>
  );
}
