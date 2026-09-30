"use client";

import React from "react";
import { SignalSource, SignalInputLanguage } from "@/types/civic";
import { Type, Mic, Image as ImageIcon, CheckCircle2, Clock, MapPin, Tag, Globe2 } from "lucide-react";
import { WARD_OPTIONS, CATEGORY_OPTIONS } from "./location-selector";

interface SignalPreviewProps {
  source: SignalSource;
  language: SignalInputLanguage;
  ward: string;
  area: string;
  category: string;
  hasText: boolean;
  hasImage: boolean;
  hasVoice: boolean;
  textLength: number;
}

const SOURCE_LABELS: Record<SignalSource, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  text: { label: "Written Text", icon: Type },
  voice: { label: "Voice Audio", icon: Mic },
  image: { label: "Visual Image", icon: ImageIcon },
};

const LANGUAGE_LABELS: Record<SignalInputLanguage, string> = {
  auto: "Auto-detect Language",
  english: "English",
  tamil: "Tamil (தமிழ்)",
  hindi: "Hindi (हिन्दी)",
  telugu: "Telugu (తెలుగు)",
  kannada: "Kannada (ಕನ್ನಡ)",
  malayalam: "Malayalam (മലയാളം)",
  bengali: "Bengali (বাংলা)",
};

export function SignalPreview({
  source,
  language,
  ward,
  area,
  category,
  hasText,
  hasImage,
  hasVoice,
  textLength,
}: SignalPreviewProps) {
  const SourceIcon = SOURCE_LABELS[source]?.icon ?? Type;
  const sourceLabel = SOURCE_LABELS[source]?.label ?? "Text";
  const wardLabel = WARD_OPTIONS.find((w) => w.value === ward)?.label || (ward ? ward : "Not selected");
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.value === category)?.label || (category === "auto" ? "Auto-detect" : category);

  // Determine readiness
  const isWardSelected = Boolean(ward);
  const isInputProvided = (source === "text" && textLength >= 10) || (source === "voice" && hasVoice) || (source === "image" && hasImage);
  const isReady = isWardSelected && isInputProvided;

  return (
    <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Report Summary
        </h4>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
            isReady
              ? "bg-[var(--success-bg)] text-[var(--success-foreground)] border border-[var(--success-border)]"
              : "bg-[var(--warning-bg)] text-[var(--warning-foreground)] border border-[var(--warning-border)]"
          }`}
        >
          {isReady ? (
            <>
              <CheckCircle2 className="w-3 h-3" /> Ready for AI
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" /> Input Pending
            </>
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Source format */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Input Format</span>
          <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
            <SourceIcon className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{sourceLabel}</span>
          </div>
        </div>

        {/* Language */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Language</span>
          <div className="flex items-center gap-1.5 font-medium text-[var(--text)] truncate">
            <Globe2 className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
            <span className="truncate">{LANGUAGE_LABELS[language] ?? language}</span>
          </div>
        </div>

        {/* Location / Ward */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Ward</span>
          <div className="flex items-center gap-1.5 font-medium text-[var(--text)] truncate">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            <span className="truncate">{ward ? wardLabel.replace(/ — .*/, "") : "None selected"}</span>
          </div>
        </div>

        {/* Category */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Category</span>
          <div className="flex items-center gap-1.5 font-medium text-[var(--text)] truncate">
            <Tag className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            <span className="truncate">{category === "auto" ? "Auto-detect" : category}</span>
          </div>
        </div>
      </div>

      {/* Area detail */}
      <div className="text-xs space-y-1 pt-1 border-t border-[var(--border-subtle)]">
        <div className="flex justify-between items-center text-[var(--text-secondary)]">
          <span>Area / Locality:</span>
          <span className="font-medium text-[var(--text)] text-right max-w-[200px] truncate">
            {area.trim() ? area : "Not specified"}
          </span>
        </div>
        <div className="flex justify-between items-center text-[var(--text-secondary)]">
          <span>Attached Evidence:</span>
          <span className="font-medium text-[var(--text)]">
            {hasImage ? "Image Attached" : hasVoice ? "Voice Audio Recorded" : hasText ? `${textLength} characters` : "None"}
          </span>
        </div>
      </div>
    </div>
  );
}
