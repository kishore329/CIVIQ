"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Type, Mic, Image } from "lucide-react";
import { SignalSource } from "@/types/civic";

const METHODS: {
  id: SignalSource;
  label: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: "text",
    label: "Text",
    description: "Type or paste your report",
    Icon: Type,
  },
  {
    id: "voice",
    label: "Voice",
    description: "Record in any language",
    Icon: Mic,
  },
  {
    id: "image",
    label: "Image",
    description: "Upload visual evidence",
    Icon: Image,
  },
];

interface InputMethodSelectorProps {
  selected: SignalSource;
  onChange: (method: SignalSource) => void;
}

export function InputMethodSelector({ selected, onChange }: InputMethodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Input method">
      {METHODS.map(({ id, label, description, Icon }) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              isSelected
                ? "border-[var(--primary)] bg-[var(--info-bg)] text-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
            )}
          >
            {isSelected && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[var(--primary)]" aria-hidden="true" />
            )}
            <Icon
              className={cn(
                "w-5 h-5",
                isSelected ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"
              )}
            />
            <span className={cn("text-sm font-semibold", isSelected ? "text-[var(--primary)]" : "text-[var(--text)]")}>
              {label}
            </span>
            <span className="text-[11px] leading-tight text-[var(--text-secondary)] hidden sm:block">
              {description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
