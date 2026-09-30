"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Cpu, AlertCircle, Loader2 } from "lucide-react";

export type AIStatusMode = "CONNECTED" | "DEMO MODE" | "PROCESSING" | "ERROR";

interface AIStatusIndicatorProps {
  isProcessing?: boolean;
}

export function AIStatusIndicator({ isProcessing }: AIStatusIndicatorProps) {
  const [status, setStatus] = useState<AIStatusMode>("DEMO MODE");
  const [engine, setEngine] = useState<string>("Loading engine status...");

  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await fetch("/api/ai-status");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStatus(data.status);
            setEngine(data.engine);
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus("DEMO MODE");
          setEngine("Deterministic Fallback Engine");
        }
      }
    }

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isProcessing) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Gemini Analysis in Progress</span>
      </div>
    );
  }

  if (status === "CONNECTED") {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
        title="Live Gemini 2.5 Flash AI is connected and active"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Sparkles className="w-3.5 h-3.5" />
        <span>Gemini AI Connected</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)]"
      title="Running in deterministic Demo AI Mode. Set GEMINI_API_KEY in .env.local to activate live Gemini."
    >
      <Cpu className="w-3.5 h-3.5 text-[var(--accent)]" />
      <span>Demo AI Mode</span>
    </div>
  );
}
