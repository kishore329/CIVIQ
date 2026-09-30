import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getPrimaryAIInsight } from "@/lib/data/dashboard";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function CiviqAiInsightCard() {
  const router = useRouter();
  const insight = getPrimaryAIInsight();
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);

  return (
    <>
      <div className="relative rounded-xl p-5 bg-[var(--surface)] border-2 border-[var(--primary)] shadow-sm overflow-hidden">
        {/* Subtle decorative background civic grid accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--info-bg)] rounded-bl-full pointer-events-none -z-0 opacity-50" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[var(--primary)] text-white shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-[var(--text)] tracking-tight">
                CIVIQ AI INSIGHT
              </h3>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--info-bg)] text-[var(--info-foreground)] border border-[var(--info-border)]">
              Demo AI Insight
            </span>
          </div>

          {/* Primary Insight Text */}
          <p className="text-sm font-medium text-[var(--text)] leading-relaxed bg-[var(--surface-subtle)] p-4 rounded-lg border border-[var(--border)]">
            &ldquo;{insight.summary}&rdquo;
          </p>

          {/* Evidence Signals Matrix */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Evidence Signals:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Evidence 1 */}
              <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block">
                  Citizen Ingestion
                </span>
                <span className="text-base font-bold text-[var(--accent)] font-mono block mt-0.5">
                  {insight.evidence.reportCount} related reports
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  Clustered in {insight.relatedWard}
                </span>
              </div>

              {/* Evidence 2 */}
              <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block">
                  Infrastructure Gap
                </span>
                <span className="text-base font-bold text-[var(--critical)] font-mono block mt-0.5">
                  {insight.evidence.infrastructureGap}% deficit
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  Drainage flow constricted
                </span>
              </div>

              {/* Evidence 3 */}
              <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block">
                  Investment Coverage
                </span>
                <span className="text-base font-bold text-[var(--warning)] font-mono block mt-0.5">
                  {insight.evidence.investmentCoverage}% historical coverage
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  Chronic capital under-allocation
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
              <span>Grounding Confidence: 94% • Fully verified against municipal records</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEvidenceDialogOpen(true)}
              className="text-xs font-semibold h-8"
            >
              <span>View Evidence</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Evidence Center Modal */}
      <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">
              EVD-{insight.relatedWard.replace(" ", "")}-01
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[var(--info-bg)] text-[var(--info-foreground)]">
              Empirical Trace
            </span>
          </div>
          <DialogTitle>Evidence Dossier: {insight.title}</DialogTitle>
          <DialogDescription>
            Multi-source empirical justification supporting the automated priority score.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]">
            <h5 className="font-bold text-[var(--text)] mb-1">Grounding Sources</h5>
            <ul className="list-disc pl-4 space-y-1 text-[var(--text-secondary)]">
              {insight.groundingSources.map((source, idx) => (
                <li key={idx}>{source}</li>
              ))}
            </ul>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            In Phase 3, this evidence center connects directly to the Google Gemini grounding engine, allowing policymakers to inspect raw audio citations, geolocated citizen photos, and engineering telemetry.
          </p>
        </div>

        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => setEvidenceDialogOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEvidenceDialogOpen(false);
              router.push("/evidence");
            }}
          >
            Go to Evidence Center
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
