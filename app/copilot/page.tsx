"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { DataCard } from "@/components/ui/data-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Bot, ShieldCheck, ArrowRight } from "lucide-react";

export default function CopilotPage() {
  const [query, setQuery] = useState("");
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  const samplePrompts = [
    "Why is Ward 17 drainage ranked as the #1 priority?",
    "Summarize drinking water pipeline grievances in Ward 07",
    "How many residents benefit if we allocate $1.45M to culvert upgrades?",
    "Compare infrastructure gaps between Ward 04 and Ward 14",
  ];

  return (
    <AppShell
      pageTitle="Civic AI Copilot"
      pageDescription="Evidence-grounded conversational assistant for policymakers, urban planners, and infrastructure departments."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <PageHeader
          title="Civic AI Copilot"
          description="Evidence-grounded conversational assistant for policymakers, urban planners, and infrastructure departments."
          badge={<DemoDataBadge label="DEMO DATA" />}
        />

        {/* Copilot Interface Container */}
        <DataCard
          title={
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span>Evidence-Grounded Civic Q&A</span>
            </div>
          }
          subtitle="Answers are grounded directly in monitored constituency telemetry with empirical citations"
        >
          <div className="space-y-4">
            {/* Interactive Suggested Prompts */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Sample Analytical Inquiries:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setQuery(prompt);
                      setActivePrompt(prompt);
                    }}
                    className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-left text-xs text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <span>&ldquo;{prompt}&rdquo;</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Display */}
            {activePrompt && (
              <div className="p-4 rounded-xl bg-[var(--info-bg)] border border-[var(--info-border)] space-y-2 animate-in fade-in-0 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-[var(--info-foreground)]">
                    <Bot className="w-4 h-4" />
                    <span>CIVIQ Copilot (Grounded Model Response)</span>
                  </div>
                  <span className="text-[10px] font-medium text-[var(--success)] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    100% Empirically Grounded
                  </span>
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  Based on 327 verified citizen reports and municipal hydraulic assessments in Ward 17, culvert siltation has reduced drainage capacity by 82%. Because this culvert sits beneath the primary transit artery serving 12,400 residents and adjacent freight lines, severe rainfall triggers immediate flooding with elevated risk to life and transit disruption.
                </p>
                <div className="pt-2 border-t border-[var(--info-border)] text-[10px] text-[var(--text-secondary)]">
                  Citations: Citizen SMS Feed #98421 • Ward 17 Stormwater Network Layer v2.1 • FY26 Capital Works Priority Index #01
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Ask about citizen reports, infrastructure gaps, or budget trade-offs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    setActivePrompt(query);
                  }
                }}
              />
              <Button
                variant="primary"
                onClick={() => {
                  if (query.trim()) setActivePrompt(query);
                }}
                className="gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask Copilot</span>
              </Button>
            </div>
          </div>
        </DataCard>
      </div>
    </AppShell>
  );
}
