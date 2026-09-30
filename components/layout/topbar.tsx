"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  Bell,
  MapPin,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface TopbarProps {
  title?: string;
  description?: string;
  onOpenMobileMenu?: () => void;
  className?: string;
}

export function Topbar({
  title = "Infrastructure Intelligence",
  description = "AI-assisted insights from citizen signals, infrastructure data and development indicators.",
  onOpenMobileMenu,
  className,
}: TopbarProps) {
  const [constituency, setConstituency] = useState("Metro Central — All Wards");
  const [period, setPeriod] = useState("Last 30 Days");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className={cn(
        "h-16 px-4 md:px-6 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0",
        className
      )}
    >
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-bold text-[var(--text)] truncate">
              {title}
            </h1>
          </div>
          <p className="hidden lg:block text-xs text-[var(--text-secondary)] truncate max-w-xl">
            {description}
          </p>
        </div>
      </div>

      {/* Right: Selectors, Notifications & Profile Placeholders */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Constituency Selector Placeholder */}
        <div className="hidden sm:flex items-center">
          <div className="relative">
            <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--text)] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <select
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="bg-transparent text-[var(--text)] text-xs font-medium cursor-pointer focus:outline-none pr-3"
                aria-label="Select constituency"
              >
                <option value="Metro Central — All Wards" className="bg-[var(--surface)] text-[var(--text)]">
                  Metro Central (All 4 Wards)
                </option>
                <option value="Ward 14 (Old Port & Creek)" className="bg-[var(--surface)] text-[var(--text)]">
                  Ward 14 (Old Port & Creek)
                </option>
                <option value="Ward 07 (Industrial East)" className="bg-[var(--surface)] text-[var(--text)]">
                  Ward 07 (Industrial East)
                </option>
                <option value="Ward 22 (Green Valley)" className="bg-[var(--surface)] text-[var(--text)]">
                  Ward 22 (Green Valley)
                </option>
                <option value="Ward 31 (University Heights)" className="bg-[var(--surface)] text-[var(--text)]">
                  Ward 31 (University Heights)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Period Selector Placeholder */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--text)] font-medium">
            <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent text-[var(--text)] text-xs font-medium cursor-pointer focus:outline-none pr-3"
              aria-label="Select data period"
            >
              <option value="Last 7 Days" className="bg-[var(--surface)] text-[var(--text)]">
                Last 7 Days
              </option>
              <option value="Last 30 Days" className="bg-[var(--surface)] text-[var(--text)]">
                Last 30 Days
              </option>
              <option value="Current Quarter (Q3)" className="bg-[var(--surface)] text-[var(--text)]">
                Current Quarter (Q3)
              </option>
              <option value="Fiscal Year 2026" className="bg-[var(--surface)] text-[var(--text)]">
                Fiscal Year 2026
              </option>
            </select>
          </div>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] border border-transparent hover:border-[var(--border)] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            aria-label="Notifications (3 unread)"
            title="System notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--critical)] ring-2 ring-[var(--surface)]" />
          </button>
        </div>

        {/* User/Profile Placeholder */}
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-2.5 p-1 md:px-2.5 md:py-1 rounded-lg hover:bg-[var(--surface-hover)] border border-transparent hover:border-[var(--border)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          aria-label="User profile menu"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white text-xs font-semibold flex items-center justify-center shrink-0">
            CA
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-[var(--text)] leading-tight">
              Civic Administrator
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] leading-tight">
              Urban Planning Dept
            </span>
          </div>
          <ChevronDown className="hidden md:block w-3.5 h-3.5 text-[var(--text-secondary)]" />
        </button>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogHeader>
          <DialogTitle>Civic Intelligence Notifications</DialogTitle>
          <DialogDescription>
            Real-time critical events detected across monitored wards.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="p-3 rounded-lg bg-[var(--critical-bg)] border border-[var(--critical-border)] text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-[var(--critical-foreground)]">
              <span>Severe Drainage Congestion Alert</span>
              <span className="text-[10px] opacity-80">14m ago</span>
            </div>
            <p className="text-[var(--text)]">
              Ward 14 citizen signals breached 400 reports. AI priority recalculation triggered.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-[var(--text)]">
              <span>Pipeline Telemetry Ingested</span>
              <span className="text-[10px] text-[var(--text-secondary)]">2h ago</span>
            </div>
            <p className="text-[var(--text-secondary)]">
              Sector 9 pressure drop corroborated by 184 citizen grievances.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-[var(--text)]">
              <span>What-If Scenario Saved</span>
              <span className="text-[10px] text-[var(--text-secondary)]">Yesterday</span>
            </div>
            <p className="text-[var(--text-secondary)]">
              Monsoon Culvert Mitigation scenario simulated $1.45M capital allocation.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => setNotificationsOpen(false)}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={() => setNotificationsOpen(false)}>
            Mark All as Read
          </Button>
        </DialogFooter>
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogHeader>
          <DialogTitle>Civic Platform Profile</DialogTitle>
          <DialogDescription>
            Municipal administration privileges & session metadata.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white text-sm font-bold flex items-center justify-center">
              CA
            </div>
            <div>
              <p className="font-semibold text-[var(--text)]">Civic Administrator (Demo)</p>
              <p className="text-[var(--text-secondary)]">admin@civiq.gov.internal</p>
              <p className="text-[11px] text-[var(--accent)] font-medium mt-0.5">
                Role: Urban Infrastructure Planner & Lead Analyst
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[var(--text-secondary)]">
            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
              <span className="block text-[10px] uppercase font-semibold text-[var(--text-muted)]">
                Jurisdiction
              </span>
              <span className="font-medium text-[var(--text)]">Metro Central Zone</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
              <span className="block text-[10px] uppercase font-semibold text-[var(--text-muted)]">
                Security Clearance
              </span>
              <span className="font-medium text-[var(--text)]">Level 4 (Gov Executive)</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => setProfileOpen(false)}>
            Close Profile
          </Button>
        </DialogFooter>
      </Dialog>
    </header>
  );
}
