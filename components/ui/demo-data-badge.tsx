import React from "react";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";
import { Tooltip } from "./tooltip";

export interface DemoDataBadgeProps {
  className?: string;
  label?: string;
}

export function DemoDataBadge({ className, label = "Synthetic Demo Data" }: DemoDataBadgeProps) {
  return (
    <Tooltip content="CIVIQ Phase 1 Prototype: Deterministic synthetic dataset for validation">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)] select-none",
          className
        )}
      >
        <Database className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
        <span>{label}</span>
      </span>
    </Tooltip>
  );
}
