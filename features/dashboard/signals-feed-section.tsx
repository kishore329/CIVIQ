"use client";

import React from "react";
import { DEMO_CITIZEN_SIGNALS } from "@/data/demo-data";
import { DataCard } from "@/components/ui/data-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  ThumbsUp,
  Layers,
  MapPin,
  Clock,
  PhoneCall,
  Smartphone,
  Laptop,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SignalsFeedSection() {

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "sms_multilingual":
        return Globe;
      case "mobile_app":
        return Smartphone;
      case "call_center":
        return PhoneCall;
      default:
        return Laptop;
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case "sms_multilingual":
        return "Multilingual SMS";
      case "mobile_app":
        return "Mobile Grievance App";
      case "call_center":
        return "Municipal Helpline";
      default:
        return "Citizen Web Portal";
    }
  };

  return (
    <DataCard
      title="Recent Citizen Signals"
      subtitle="Multilingual community reports clustered and geocoded via automated civic ingestion"
      action={
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
            5,284 Ingested
          </span>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            View Signal Stream
          </Button>
        </div>
      }
      noPadding
    >
      <div className="divide-y divide-[var(--border-subtle)]">
        {DEMO_CITIZEN_SIGNALS.map((signal) => {
          const ChannelIcon = getChannelIcon(signal.channel ?? "web_portal");

          return (
            <div
              key={signal.id}
              className="p-4 hover:bg-[var(--surface-hover)] transition-colors text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)] shrink-0 mt-0.5">
                    <ChannelIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-semibold text-[11px] text-[var(--text)]">
                        {signal.trackingNumber}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--text-secondary)] font-medium">
                        {getChannelLabel(signal.channel ?? "web_portal")}
                      </span>
                      {signal.originalLanguage !== "English" && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--info-bg)] border border-[var(--info-border)] text-[var(--info-foreground)] font-semibold">
                          Orig: {signal.originalLanguage}
                        </span>
                      )}
                      <StatusBadge severity={signal.severity} size="sm" />
                    </div>

                    {/* Translated Text */}
                    <p className="mt-1.5 text-xs text-[var(--text)] font-medium leading-relaxed">
                      {signal.translatedText}
                    </p>

                    {/* Original Raw Excerpt (if multilingual) */}
                    {signal.rawExcerpt && (
                      <div className="mt-1.5 p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[11px] text-[var(--text-secondary)] italic">
                        <span className="font-semibold text-[var(--text-muted)] not-italic mr-1">
                          Raw Voice/SMS:
                        </span>
                        &ldquo;{signal.rawExcerpt}&rdquo;
                      </div>
                    )}

                    {/* Metadata chips */}
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[var(--text-secondary)] flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-[var(--text)]">
                        <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                        {signal.wardName} — {signal.locationDescription}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {signal.timestamp}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[var(--accent)]">
                        <Layers className="w-3 h-3" />
                        {signal.duplicateClusterCount} duplicates clustered
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-[var(--text-secondary)]" />
                        {signal.upvotesCount} community upvotes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      signal.status === "escalated"
                        ? "bg-[var(--critical-bg)] text-[var(--critical-foreground)] border border-[var(--critical-border)]"
                        : "bg-[var(--success-bg)] text-[var(--success-foreground)] border border-[var(--success-border)]"
                    )}
                  >
                    {signal.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DataCard>
  );
}
