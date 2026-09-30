"use client";

import React, { useState, useTransition } from "react";
import { SignalSource, SignalInputLanguage, CiviqSignal, AIAnalysisResult } from "@/types/civic";
import { InputMethodSelector } from "./input-method-selector";
import { TextSignalInput } from "./text-signal-input";
import { VoiceSignalInput } from "./voice-signal-input";
import { ImageSignalInput } from "./image-signal-input";
import { LocationSelector } from "./location-selector";
import { SignalPreview } from "./signal-preview";
import { DemoControls } from "./demo-controls";
import { AnalysisResult } from "./analysis-result";
import { analyzeCitizenSignal } from "@/lib/signals/analyze";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";

import { AIStatusIndicator } from "./ai-status-indicator";

interface ReportIssueFormProps {
  onSignalCreated: (signal: CiviqSignal) => void;
  onViewHistory: () => void;
}

export function ReportIssueForm({ onSignalCreated, onViewHistory }: ReportIssueFormProps) {
  // Input method
  const [source, setSource] = useState<SignalSource>("text");

  // Form fields
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<SignalInputLanguage>("auto");
  const [ward, setWard] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("auto");

  // Media
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
  const [voiceAudioBlob, setVoiceAudioBlob] = useState<Blob | null>(null);

  // Validation
  const [wardError, setWardError] = useState("");
  const [textError, setTextError] = useState("");
  const [formError, setFormError] = useState("");

  // Processing state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");

  // Result state
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [createdSignalId, setCreatedSignalId] = useState<string | null>(null);

  // Demo Report loader
  const handleLoadDemoReport = () => {
    setSource("text");
    setText("Our street floods whenever it rains and there is no proper drainage.");
    setLanguage("tamil");
    setWard("ward-17");
    setArea("Near Government School");
    setCategory("auto");
    setImageUrl(null);
    setVoiceTranscript(null);
    setWardError("");
    setTextError("");
    setFormError("");
    setAnalysisResult(null);
    setCreatedSignalId(null);
  };

  // Reset form
  const handleReset = () => {
    setText("");
    setLanguage("auto");
    setWard("");
    setArea("");
    setCategory("auto");
    setImageUrl(null);
    setVoiceTranscript(null);
    setVoiceAudioBlob(null);
    setWardError("");
    setTextError("");
    setFormError("");
    setAnalysisResult(null);
    setCreatedSignalId(null);
  };

  // Submit & analyze handler with 5-stage progression
  const handleAnalyze = async () => {
    // Reset errors
    setWardError("");
    setTextError("");
    setFormError("");

    let hasError = false;

    // Validate ward
    if (!ward) {
      setWardError("Please select a ward to locate this civic issue.");
      hasError = true;
    }

    // Validate input by source
    if (source === "text") {
      if (!text.trim() || text.trim().length < 10) {
        setTextError("Please enter at least 10 characters describing the infrastructure issue.");
        hasError = true;
      } else if (text.length > 1000) {
        setTextError("Description cannot exceed 1000 characters.");
        hasError = true;
      }
    } else if (source === "voice") {
      if (!voiceTranscript && !voiceAudioBlob) {
        setFormError("Voice transcript unavailable. Please use text input or Demo Voice.");
        hasError = true;
      }
    } else if (source === "image") {
      if (!imageUrl) {
        setFormError("Please upload an image or click 'Use Demo Image' before analyzing.");
        hasError = true;
      }
    }

    if (hasError) return;

    // Start 5-stage processing state
    setIsAnalyzing(true);
    setAnalysisStep("Understanding citizen input...");

    const stepTimers: NodeJS.Timeout[] = [
      setTimeout(() => setAnalysisStep("Detecting civic issue..."), 450),
      setTimeout(() => setAnalysisStep("Analyzing severity..."), 900),
      setTimeout(() => setAnalysisStep("Structuring civic intelligence..."), 1350),
      setTimeout(() => setAnalysisStep("Preparing CIVIQ insight..."), 1800),
    ];

    try {
      const result = await analyzeCitizenSignal({
        text: source === "text" ? text : undefined,
        voiceTranscript: source === "voice" ? voiceTranscript || undefined : undefined,
        language,
        ward,
        area,
        category,
        source,
        image: imageUrl || undefined,
        imageAttached: Boolean(imageUrl),
      });

      stepTimers.forEach(clearTimeout);

      // Generate deterministic Signal ID
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `CIVIQ-SIG-00${randomSuffix}`;

      // Assemble full CiviqSignal record
      const newSignal: CiviqSignal = {
        id: `sig-${Date.now()}`,
        signalId: generatedId,
        source,
        text: source === "text" ? text : undefined,
        transcript: source === "voice" ? voiceTranscript || undefined : undefined,
        imageUrl: source === "image" ? imageUrl || undefined : undefined,
        language,
        category: result.category,
        subcategory: result.subcategory,
        severity: result.severity,
        urgency: result.urgency,
        ward,
        area: area.trim() || undefined,
        status: "analyzed",
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
        aiAnalysis: result,
      };

      setAnalysisResult(result);
      setCreatedSignalId(generatedId);
      onSignalCreated(newSignal);
    } catch (err) {
      stepTimers.forEach(clearTimeout);
      setFormError("An unexpected error occurred during signal analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  // If analysis completed, show AnalysisResult view
  if (analysisResult && createdSignalId) {
    return (
      <AnalysisResult
        signalId={createdSignalId}
        source={source}
        analysis={analysisResult}
        onReset={handleReset}
        onViewHistory={onViewHistory}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Intro Header with Live AI Status Indicator & Demo Quick-Fill */}
      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <h2 className="text-base font-bold text-[var(--text)]">
              Report an Infrastructure Need
            </h2>
            <AIStatusIndicator isProcessing={isAnalyzing} />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-3xl leading-relaxed">
            Tell CIVIQ what is happening in your community. Your input helps identify development gaps and emerging infrastructure needs across Chennai wards.
          </p>
        </div>

        {/* Demo Quick Controls */}
        <DemoControls
          onLoadDemoReport={handleLoadDemoReport}
          onReset={handleReset}
          disabled={isAnalyzing}
        />
      </div>

      {/* Main Form Layout: Desktop Two Columns, Mobile Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Input Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              1. Choose Input Method
            </label>
            <InputMethodSelector selected={source} onChange={setSource} />
          </div>

          {/* 2. Format-Specific Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              2. Describe the Issue ({source.toUpperCase()})
            </label>

            {source === "text" && (
              <TextSignalInput
                text={text}
                onTextChange={setText}
                language={language}
                onLanguageChange={setLanguage}
                error={textError}
              />
            )}

            {source === "voice" && (
              <VoiceSignalInput
                transcript={voiceTranscript || ""}
                onTranscriptReady={(transcript) => {
                  setVoiceTranscript(transcript);
                }}
              />
            )}

            {source === "image" && (
              <ImageSignalInput
                imageUrl={imageUrl}
                onImageChange={(url) => setImageUrl(url)}
              />
            )}
          </div>

          {/* 3. Location & Civic Context */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              3. Location & Classification
            </label>
            <LocationSelector
              ward={ward}
              onWardChange={(w) => {
                setWard(w);
                if (w) setWardError("");
              }}
              area={area}
              onAreaChange={setArea}
              category={category}
              onCategoryChange={setCategory}
              wardError={wardError}
            />
          </div>
        </div>

        {/* Right Column: Preview & Action (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Signal Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Signal Telemetry Preview
            </label>
            <SignalPreview
              source={source}
              language={language}
              ward={ward}
              area={area}
              category={category}
              hasText={Boolean(text.trim())}
              hasImage={Boolean(imageUrl)}
              hasVoice={Boolean(voiceTranscript || voiceAudioBlob)}
              textLength={text.trim().length}
            />
          </div>

          {/* Form-level Error Message */}
          {formError && (
            <div className="p-3 rounded-lg bg-[var(--critical-bg)] border border-[var(--critical-border)] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--critical)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--critical-foreground)]">{formError}</p>
            </div>
          )}

          {/* Primary Action Button: "Analyze with CIVIQ" */}
          <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full h-11 text-sm font-semibold tracking-wide gap-2 shadow-sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{analysisStep || "Analyzing with CIVIQ..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with CIVIQ</span>
                </>
              )}
            </Button>

            <p className="text-[11px] text-center text-[var(--text-tertiary)]">
              Converts citizen input into structured intelligence for municipal prioritization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
