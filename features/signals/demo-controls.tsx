"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FlaskConical, FileText, RotateCcw } from "lucide-react";
import { SignalInputLanguage, SignalSource } from "@/types/civic";

interface DemoControlsProps {
  onLoadDemoReport: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function DemoControls({ onLoadDemoReport, onReset, disabled }: DemoControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
        <div>
          <span className="text-xs font-semibold text-[var(--text)]">Demo Quick-Fill</span>
          <span className="text-[11px] text-[var(--text-secondary)] block sm:inline sm:ml-2">
            Pre-fill verified scenarios for instant prototype demonstration.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onLoadDemoReport}
          disabled={disabled}
          className="text-xs h-8 gap-1.5"
          aria-label="Load demo report data"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
          Use Demo Report
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={disabled}
          className="text-xs h-8 text-[var(--text-secondary)] hover:text-[var(--text)]"
          aria-label="Clear form inputs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
}
