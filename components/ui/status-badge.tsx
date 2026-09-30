import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Info, ShieldAlert } from "lucide-react";
import { SeverityLevel, ProjectStatus } from "@/types/civic";

export interface StatusBadgeProps {
  status?: string;
  variant?: "success" | "warning" | "critical" | "info" | "neutral";
  severity?: SeverityLevel;
  projectStatus?: ProjectStatus;
  label?: string;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  variant,
  severity,
  projectStatus,
  label,
  showIcon = true,
  className,
  size = "md",
}: StatusBadgeProps) {
  // Determine variant and display text based on inputs
  let resolvedVariant = variant || "neutral";
  let resolvedText = label || status || "";
  let IconComponent: React.ComponentType<{ className?: string }> = Info;

  if (severity) {
    switch (severity) {
      case "critical":
        resolvedVariant = "critical";
        resolvedText = label || "Critical";
        IconComponent = ShieldAlert;
        break;
      case "high":
        resolvedVariant = "warning";
        resolvedText = label || "High";
        IconComponent = AlertTriangle;
        break;
      case "medium":
        resolvedVariant = "info";
        resolvedText = label || "Medium";
        IconComponent = AlertCircle;
        break;
      case "low":
        resolvedVariant = "neutral";
        resolvedText = label || "Low";
        IconComponent = CheckCircle2;
        break;
    }
  } else if (projectStatus) {
    switch (projectStatus) {
      case "approved":
        resolvedVariant = "success";
        resolvedText = label || "Approved";
        IconComponent = CheckCircle2;
        break;
      case "in_progress":
        resolvedVariant = "info";
        resolvedText = label || "In Progress";
        IconComponent = Clock;
        break;
      case "under_review":
        resolvedVariant = "warning";
        resolvedText = label || "Under Review";
        IconComponent = AlertCircle;
        break;
      case "planned":
        resolvedVariant = "neutral";
        resolvedText = label || "Planned";
        IconComponent = Clock;
        break;
      case "completed":
        resolvedVariant = "success";
        resolvedText = label || "Completed";
        IconComponent = CheckCircle2;
        break;
      case "draft":
        resolvedVariant = "neutral";
        resolvedText = label || "Draft";
        IconComponent = Info;
        break;
    }
  } else if (variant) {
    switch (variant) {
      case "success":
        IconComponent = CheckCircle2;
        break;
      case "warning":
        IconComponent = AlertTriangle;
        break;
      case "critical":
        IconComponent = ShieldAlert;
        break;
      case "info":
        IconComponent = Info;
        break;
      default:
        IconComponent = Info;
    }
  }

  const variantStyles = {
    success: "bg-[var(--success-bg)] text-[var(--success-foreground)] border-[var(--success-border)]",
    warning: "bg-[var(--warning-bg)] text-[var(--warning-foreground)] border-[var(--warning-border)]",
    critical: "bg-[var(--critical-bg)] text-[var(--critical-foreground)] border-[var(--critical-border)]",
    info: "bg-[var(--info-bg)] text-[var(--info-foreground)] border-[var(--info-border)]",
    neutral: "bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-[var(--border)]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors select-none",
        variantStyles[resolvedVariant],
        sizeStyles[size],
        className
      )}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{resolvedText}</span>
    </span>
  );
}
