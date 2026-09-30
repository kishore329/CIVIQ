"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PriorityAssessment } from "../priorityTypes";
import { FACTOR_METADATA } from "../priorityWeights";

interface ContributionChartProps {
  assessment: PriorityAssessment;
}

export function ContributionChart({ assessment }: ContributionChartProps) {
  // Build chart dataset from the assessment's exact factors and contributions
  const data = FACTOR_METADATA.map((meta) => {
    const rawScore = assessment.factors[meta.key];
    const contribution = assessment.weightedContributions[meta.key];
    return {
      key: meta.key,
      name: meta.label,
      rawScore,
      weightPct: meta.weightPct,
      contribution,
      color: meta.color,
    };
  }).sort((a, b) => b.contribution - a.contribution);

  const totalCalculated = data.reduce((acc, d) => acc + d.contribution, 0);

  return (
    <div className="space-y-4 p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            Why This Score? — Contribution Breakdown
          </h4>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            Transparent breakdown of the 8 weighted factors driving the Priority Index:
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)]">Calculated Sum:</span>
          <span className="font-mono text-sm font-extrabold text-[var(--primary)] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
            {totalCalculated.toFixed(2)} pts → {assessment.priorityIndex} / 100
          </span>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 25]}
              tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
              tickFormatter={(v) => `+${v} pts`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11, fill: "var(--text)" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-md text-xs space-y-1">
                      <p className="font-bold text-[var(--text)]">{d.name}</p>
                      <p className="text-[var(--text-secondary)]">
                        Input Score: <strong>{d.rawScore} / 100</strong>
                      </p>
                      <p className="text-[var(--text-secondary)]">
                        Configured Weight: <strong>{d.weightPct}%</strong>
                      </p>
                      <p className="font-semibold text-[var(--primary)]">
                        Contribution: <strong>+{d.contribution.toFixed(2)} pts</strong>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.key}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabular Detail Breakdown */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">
              <th className="py-1.5 px-2">Factor</th>
              <th className="py-1.5 px-2 text-right">Input Score</th>
              <th className="py-1.5 px-2 text-right">Configured Weight</th>
              <th className="py-1.5 px-2 text-right">Contribution Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {data.map((row) => (
              <tr key={row.key} className="hover:bg-[var(--surface-hover)]">
                <td className="py-2 px-2 font-medium text-[var(--text)] flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                  />
                  <span>{row.name}</span>
                </td>
                <td className="py-2 px-2 text-right font-mono text-[var(--text)]">
                  {row.rawScore} / 100
                </td>
                <td className="py-2 px-2 text-right font-mono text-[var(--text-secondary)]">
                  {row.weightPct}%
                </td>
                <td className="py-2 px-2 text-right font-mono font-bold text-[var(--primary)]">
                  +{row.contribution.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
