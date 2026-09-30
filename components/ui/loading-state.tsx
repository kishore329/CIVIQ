import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  label?: string;
  description?: string;
  className?: string;
  rows?: number;
}

export function LoadingState({
  label = "Processing Civic Intelligence...",
  description = "Synthesizing multi-source signals and telemetry",
  className,
  rows = 3,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin shrink-0" />
        <div>
          <h4 className="text-xs font-semibold text-[var(--text)]">{label}</h4>
          {description && <p className="text-[11px] text-[var(--text-secondary)]">{description}</p>}
        </div>
      </div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="h-4 rounded bg-[var(--surface-subtle)] animate-pulse"
            style={{ width: `${100 - idx * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
