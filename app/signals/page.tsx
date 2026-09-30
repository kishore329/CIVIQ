"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReportIssueForm } from "@/features/signals/report-issue-form";
import { SignalHistoryTable } from "@/features/signals/signal-history-table";
import { DEMO_SIGNAL_HISTORY } from "@/data/demo/signals";
import { CiviqSignal } from "@/types/civic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileEdit, History, ShieldCheck, Network } from "lucide-react";

export default function SignalsPage() {
  const [activeTab, setActiveTab] = useState<string>("report");
  const [signals, setSignals] = useState<CiviqSignal[]>(DEMO_SIGNAL_HISTORY);

  const handleSignalCreated = (newSignal: CiviqSignal) => {
    setSignals((prev) => [newSignal, ...prev]);
  };

  return (
    <AppShell
      pageTitle="Citizen Signals"
      pageDescription="Capture community needs across languages, formats and locations."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Citizen Signals"
          description="Capture community needs across languages, formats and locations."
          badge={<DemoDataBadge label="DEMO DATA" />}
          actions={
            <Link href="/clustering">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Network className="w-3.5 h-3.5 text-[var(--primary)]" />
                View Clustered Issues (127)
              </Button>
            </Link>
          }
        />

        {/* Two Main Tabs: Report an Issue & Signal History */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md h-10 p-1">
            <TabsTrigger
              value="report"
              className="flex items-center justify-center gap-2 text-xs font-semibold py-2"
            >
              <FileEdit className="w-3.5 h-3.5" />
              REPORT AN ISSUE
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center justify-center gap-2 text-xs font-semibold py-2"
            >
              <History className="w-3.5 h-3.5" />
              SIGNAL HISTORY
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--surface-subtle)] border border-[var(--border)] font-mono">
                {signals.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: REPORT AN ISSUE */}
          <TabsContent value="report">
            <ReportIssueForm
              onSignalCreated={handleSignalCreated}
              onViewHistory={() => setActiveTab("history")}
            />
          </TabsContent>

          {/* TAB 2: SIGNAL HISTORY */}
          <TabsContent value="history">
            <SignalHistoryTable signals={signals} />
          </TabsContent>
        </Tabs>

        {/* Responsible AI Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start sm:items-center gap-3 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text)] font-semibold">Responsible Civic AI:</strong> CIVIQ uses AI to interpret submitted information and organize civic signals. AI-generated analysis is not an official government decision and may require human verification.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
