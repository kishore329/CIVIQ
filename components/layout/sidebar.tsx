"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import {
  LayoutDashboard,
  Radio,
  Network,
  Map,
  CheckSquare,
  Sliders,
  FileCheck,
  Sparkles,
  Settings,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

export const MAIN_NAV_ITEMS = [
  { id: "dashboard", label: "Intelligence Hub", icon: LayoutDashboard, href: "/dashboard", badge: null },
  { id: "signals", label: "Citizen Signals", icon: Radio, href: "/signals", badge: "5,284" },
  { id: "clustering", label: "Issue Clusters", icon: Network, href: "/clustering", badge: "23 Clusters" },
  { id: "map", label: "Development Map", icon: Map, href: "/map", badge: "10 Wards" },
  { id: "priorities", label: "Priority Projects", icon: CheckSquare, href: "/priorities", badge: "18" },
  { id: "simulator", label: "What-If Simulator", icon: Sliders, href: "/simulator", badge: "Scenario" },
  { id: "evidence", label: "Evidence Center", icon: FileCheck, href: "/evidence", badge: null },
  { id: "copilot", label: "AI Copilot", icon: Sparkles, href: "/copilot", badge: "Grounding" },
];

export const SYSTEM_NAV_ITEMS = [
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", badge: null },
];

export function Sidebar({
  isMobileOpen = false,
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  const isCurrentActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const content = (
    <div className="flex flex-col h-full bg-[var(--surface)] text-[var(--text)] select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border)] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white shrink-0 shadow-xs border border-white/10">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-[var(--text)]">
                  CIVIQ
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-[var(--info-bg)] text-[var(--info-foreground)] border border-[var(--info-border)]">
                  GovTech
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-widest text-[var(--text-secondary)] uppercase">
                CIVIC INTELLIGENCE
              </p>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {onToggleCollapse && !onMobileClose && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Intelligence
            </p>
          )}
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentActive(item.href);

            const linkContent = (
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-[var(--text-secondary)]")} />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border)]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.id} content={item.label} side="right">
                {linkContent}
              </Tooltip>
            ) : (
              <React.Fragment key={item.id}>{linkContent}</React.Fragment>
            );
          })}
        </div>

        {/* Divider & System Section */}
        <div className="border-t border-[var(--border)] pt-4 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              System
            </p>
          )}
          {SYSTEM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentActive(item.href);

            const linkContent = (
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-[var(--text-secondary)]")} />
                {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.id} content={item.label} side="right">
                {linkContent}
              </Tooltip>
            ) : (
              <React.Fragment key={item.id}>{linkContent}</React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)] space-y-3 shrink-0">
        <ThemeSwitcher compact={isCollapsed} />

        {!isCollapsed ? (
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-[11px] text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
              </span>
              <span className="font-medium text-[var(--text)]">Telemetry Live</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Phase 2 Hub</span>
          </div>
        ) : (
          <Tooltip content="Telemetry Live: All Systems Operational" side="right">
            <div className="flex justify-center p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--success)]"></span>
              </span>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-[var(--border)] transition-all duration-200 z-30 shrink-0 h-screen sticky top-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {content}
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in-0 duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] z-50 md:hidden transform transition-transform duration-200 ease-in-out border-r border-[var(--border)] shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile Navigation"
      >
        {content}
      </aside>
    </>
  );
}
