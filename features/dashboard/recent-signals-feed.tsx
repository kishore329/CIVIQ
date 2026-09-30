"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getRecentSignals } from "@/lib/data/dashboard";
import { DataCard } from "@/components/ui/data-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Radio,
  Clock,
  Globe,
  Droplets,
  Construction,
  Lightbulb,
  HeartPulse,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export function RecentSignalsFeed() {
  const router = useRouter();
  const signals = getRecentSignals(5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Drainage":
        return Droplets;
      case "Roads":
        return Construction;
      case "Streetlights":
        return Lightbulb;
      case "Healthcare":
        return HeartPulse;
      case "Education":
        return BookOpen;
      default:
        return Radio;
    }
  };

  return (
    <DataCard
      title={
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[var(--accent)]" />
          <span>RECENT CITIZEN SIGNALS</span>
        </div>
      }
      subtitle="Latest multilingual community reports ingested into the civic intelligence stream"
      action={
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => router.push("/signals")}
        >
          <span>All Signals</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      }
      noPadding
    >
      <div className="divide-y divide-[var(--border-subtle)]">
        {signals.map((signal) => {
          const CategoryIcon = getCategoryIcon(signal.category);

          return (
            <div
              key={signal.id}
              className="p-4 hover:bg-[var(--surface-hover)] transition-colors text-xs space-y-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)] shrink-0 mt-0.5 group-hover:text-[var(--accent)] transition-colors">
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                        Citizen Report
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        {signal.trackingNumber}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[var(--info-bg)] text-[var(--info-foreground)] border border-[var(--info-border)]">
                        {signal.ward}
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-semibold text-[var(--text)] leading-snug">
                      &ldquo;{signal.description}&rdquo;
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--text-secondary)] flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <Globe className="w-3 h-3 text-[var(--text-secondary)]" />
                        {signal.language}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                        {signal.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge severity={signal.severity} size="sm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DataCard>
  );
}
