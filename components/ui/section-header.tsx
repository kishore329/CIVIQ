import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 mb-4", className)}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="p-1.5 rounded-md bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)] tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
