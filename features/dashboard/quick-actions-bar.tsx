"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Map,
  CheckSquare,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";

export function QuickActionsBar() {
  const actions = [
    {
      label: "+ Review Citizen Signals",
      href: "/signals",
      icon: PlusCircle,
      variant: "primary" as const,
    },
    {
      label: "View Development Map",
      href: "/map",
      icon: Map,
      variant: "secondary" as const,
    },
    {
      label: "View Priority Projects",
      href: "/priorities",
      icon: CheckSquare,
      variant: "secondary" as const,
    },
    {
      label: "Run Development Scenario",
      href: "/simulator",
      icon: Sliders,
      variant: "secondary" as const,
    },
    {
      label: "Ask CIVIQ Copilot",
      href: "/copilot",
      icon: Sparkles,
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-[var(--accent)]" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          QUICK ACTIONS
        </h4>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.label} href={act.href}>
              <Button variant={act.variant} size="sm" className="text-xs gap-1.5 h-8">
                <Icon className="w-3.5 h-3.5" />
                <span>{act.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
