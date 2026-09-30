import React from "react";
import { cn } from "@/lib/utils";

export interface DataCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function DataCard({
  title,
  subtitle,
  action,
  footer,
  children,
  className,
  noPadding = false,
  ...props
}: DataCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col overflow-hidden",
        className
      )}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--surface)]">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-[var(--text)] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={cn("flex-1", !noPadding && "p-5")}>{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-subtle)] text-xs text-[var(--text-secondary)]">
          {footer}
        </div>
      )}
    </div>
  );
}
