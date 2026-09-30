"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme, Theme } from "./theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

const emptySubscribe = () => () => {};

export function ThemeSwitcher({ className, compact = false }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return (
      <div className={cn("h-8 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]", className)} />
    );
  }

  const options: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className={cn(
        "inline-flex items-center p-1 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] w-full justify-between gap-1",
        className
      )}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            title={`Switch to ${option.label} theme`}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] cursor-pointer",
              isActive
                ? "bg-[var(--surface)] text-[var(--text)] shadow-xs border border-[var(--border)] font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] border border-transparent"
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {!compact && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
