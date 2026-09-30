"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { SignalInputLanguage } from "@/types/civic";

const LANGUAGE_OPTIONS = [
  { value: "auto", label: "Auto-detect language" },
  { value: "english", label: "English" },
  { value: "tamil", label: "Tamil — தமிழ்" },
  { value: "hindi", label: "Hindi — हिन्दी" },
  { value: "telugu", label: "Telugu — తెలుగు" },
  { value: "kannada", label: "Kannada — ಕನ್ನಡ" },
  { value: "malayalam", label: "Malayalam — മലയാളം" },
  { value: "bengali", label: "Bengali — বাংলা" },
];

interface TextSignalInputProps {
  text: string;
  language: SignalInputLanguage;
  onTextChange: (v: string) => void;
  onLanguageChange: (v: SignalInputLanguage) => void;
  error?: string;
}

export function TextSignalInput({
  text,
  language,
  onTextChange,
  onLanguageChange,
  error,
}: TextSignalInputProps) {
  const charCount = text.length;
  const maxChars = 1000;
  const minChars = 10;
  const isNearLimit = charCount > 900;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="signal-language" className="text-sm font-medium text-[var(--text)] shrink-0 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--text-secondary)]" />
          Language
        </label>
        <div className="w-full sm:max-w-xs">
          <Select
            id="signal-language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SignalInputLanguage)}
            options={LANGUAGE_OPTIONS}
            aria-label="Report language"
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <label htmlFor="signal-text" className="text-sm font-medium text-[var(--text)]">
          Describe the issue
          <span className="text-[var(--critical)] ml-1" aria-label="required">*</span>
        </label>
        <textarea
          id="signal-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Describe the infrastructure issue or development need..."
          maxLength={maxChars}
          rows={6}
          aria-required="true"
          aria-invalid={!!error || isOverLimit}
          aria-describedby={error ? "signal-text-error" : "signal-text-hint"}
          className={cn(
            "w-full resize-none rounded-lg border bg-[var(--surface)] text-[var(--text)] text-sm px-4 py-3 leading-relaxed placeholder:text-[var(--text-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-transparent",
            error || isOverLimit
              ? "border-[var(--critical)]"
              : "border-[var(--border)] hover:border-[var(--border-strong)]"
          )}
        />
        {/* Helper row */}
        <div className="flex items-start justify-between gap-2">
          <p
            id={error ? "signal-text-error" : "signal-text-hint"}
            className={cn("text-xs", error ? "text-[var(--critical)]" : "text-[var(--text-secondary)]")}
          >
            {error
              ? error
              : charCount < minChars && charCount > 0
              ? `Minimum ${minChars} characters recommended.`
              : "Example: Our street floods whenever it rains and there is no proper drainage."}
          </p>
          <span
            className={cn(
              "text-xs font-mono shrink-0",
              isOverLimit
                ? "text-[var(--critical)] font-semibold"
                : isNearLimit
                ? "text-[var(--warning)]"
                : "text-[var(--text-muted)]"
            )}
            aria-live="polite"
            aria-label={`${charCount} of ${maxChars} characters used`}
          >
            {charCount} / {maxChars}
          </span>
        </div>
      </div>
    </div>
  );
}
