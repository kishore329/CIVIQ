import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Telemetry Feed Unavailable",
  message = "Unable to connect to municipal data stream. Please verify network or access permissions.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center rounded-xl bg-[var(--critical-bg)] border border-[var(--critical-border)] text-[var(--critical-foreground)]",
        className
      )}
    >
      <div className="p-2.5 rounded-full bg-[var(--surface)] text-[var(--critical)] mb-3 shadow-xs">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs opacity-90 max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 bg-[var(--surface)]">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </Button>
        </div>
      )}
    </div>
  );
}
