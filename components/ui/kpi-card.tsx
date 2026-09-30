import React from "react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  secondaryBadge?: string;
  accentColor?: "primary" | "critical" | "warning" | "success" | "accent";
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  secondaryBadge,
  accentColor = "accent",
  className,
}: KpiCardProps) {
  const accentBorderColors = {
    primary: "border-l-[var(--primary)]",
    critical: "border-l-[var(--critical)]",
    warning: "border-l-[var(--warning)]",
    success: "border-l-[var(--success)]",
    accent: "border-l-[var(--accent)]",
  };

  const iconBgColors = {
    primary: "bg-[var(--info-bg)] text-[var(--info-foreground)] border-[var(--info-border)]",
    critical: "bg-[var(--critical-bg)] text-[var(--critical-foreground)] border-[var(--critical-border)]",
    warning: "bg-[var(--warning-bg)] text-[var(--warning-foreground)] border-[var(--warning-border)]",
    success: "bg-[var(--success-bg)] text-[var(--success-foreground)] border-[var(--success-border)]",
    accent: "bg-[var(--info-bg)] text-[var(--info-foreground)] border-[var(--info-border)]",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] border-l-4 shadow-sm hover:shadow-md transition-all duration-150",
        accentBorderColors[accentColor],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-metric text-[var(--text)] tracking-tight">
              {value}
            </span>
            {secondaryBadge && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">
                {secondaryBadge}
              </span>
            )}
          </div>
        </div>
        <div className={cn("p-2.5 rounded-lg border shrink-0", iconBgColors[accentColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
        {subtitle && <span>{subtitle}</span>}
        {trend && (
          <span
            className={cn(
              "font-medium",
              trend.neutral
                ? "text-[var(--text-secondary)]"
                : trend.positive
                ? "text-[var(--success)]"
                : "text-[var(--critical)]"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
