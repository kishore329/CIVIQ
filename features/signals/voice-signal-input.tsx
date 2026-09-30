"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Play, AlertCircle, CheckCircle, FlaskConical } from "lucide-react";
import { DEMO_VOICE_TRANSCRIPT } from "@/data/demo/signals";

type VoiceState = "ready" | "recording" | "processing" | "done" | "error" | "unavailable";

interface VoiceSignalInputProps {
  onTranscriptReady: (transcript: string) => void;
  transcript: string;
}

function useElapsedTime(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      setElapsed(0);
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

// Animated waveform bars (visual only, deterministic)
function WaveformBars({ active }: { active: boolean }) {
  const bars = [3, 6, 4, 8, 5, 9, 4, 7, 3, 6, 8, 4, 5];
  return (
    <div
      className="flex items-center justify-center gap-[3px] h-10"
      aria-hidden="true"
    >
      {bars.map((baseH, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all",
            active ? "bg-[var(--critical)] animate-pulse" : "bg-[var(--border-strong)]"
          )}
          style={{
            height: active ? `${baseH * 3 + 6}px` : "8px",
            animationDelay: `${i * 80}ms`,
            animationDuration: `${600 + i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceSignalInput({ onTranscriptReady, transcript }: VoiceSignalInputProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("ready");
  const [errorMsg, setErrorMsg] = useState("");
  const mediaRef = useRef<MediaRecorder | null>(null);
  const elapsed = useElapsedTime(voiceState === "recording");

  const startRecording = useCallback(async () => {
    setErrorMsg("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setVoiceState("unavailable");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      recorder.start();
      setVoiceState("recording");

      recorder.addEventListener("stop", () => {
        stream.getTracks().forEach((t) => t.stop());
        setVoiceState("processing");
        // Simulate processing with demo transcript
        setTimeout(() => {
          onTranscriptReady(DEMO_VOICE_TRANSCRIPT);
          setVoiceState("done");
        }, 1500);
      });
    } catch (err) {
      if ((err as Error).name === "NotAllowedError") {
        setVoiceState("unavailable");
        setErrorMsg("Microphone access was denied. You can continue using text input, or use the Demo Voice option below.");
      } else {
        setVoiceState("error");
        setErrorMsg("An error occurred while accessing the microphone. Please try again or use text input.");
      }
    }
  }, [onTranscriptReady]);

  const stopRecording = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state === "recording") {
      mediaRef.current.stop();
    }
  }, []);

  const useDemoVoice = useCallback(() => {
    setVoiceState("processing");
    setTimeout(() => {
      onTranscriptReady(DEMO_VOICE_TRANSCRIPT);
      setVoiceState("done");
    }, 1200);
  }, [onTranscriptReady]);

  const reset = useCallback(() => {
    setVoiceState("ready");
    setErrorMsg("");
    onTranscriptReady("");
  }, [onTranscriptReady]);

  return (
    <div className="space-y-4">
      {/* Main recording card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-col items-center gap-5">

          {/* State: Ready */}
          {voiceState === "ready" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[var(--surface-subtle)] border-2 border-[var(--border)] flex items-center justify-center">
                <Mic className="w-7 h-7 text-[var(--text-secondary)]" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-[var(--text)]">Describe the issue using your voice</p>
                <p className="text-xs text-[var(--text-secondary)]">Speak in any language — Tamil, Hindi, English and more</p>
              </div>
              <Button variant="primary" size="md" onClick={startRecording} aria-label="Start recording">
                <Mic className="w-4 h-4" />
                Start Recording
              </Button>
            </>
          )}

          {/* State: Recording */}
          {voiceState === "recording" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[var(--critical-bg)] border-2 border-[var(--critical-border)] flex items-center justify-center animate-pulse">
                <Mic className="w-7 h-7 text-[var(--critical)]" aria-hidden="true" />
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--critical)] animate-ping" aria-hidden="true" />
                  <p className="text-sm font-bold text-[var(--critical)]">Recording</p>
                  <span className="font-mono text-sm text-[var(--critical)]">{elapsed}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Speak clearly — you can stop when finished</p>
              </div>
              <WaveformBars active={true} />
              <Button variant="outline" size="md" onClick={stopRecording} aria-label="Stop recording">
                <Square className="w-4 h-4 fill-current" />
                Stop Recording
              </Button>
            </>
          )}

          {/* State: Processing */}
          {voiceState === "processing" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[var(--info-bg)] border-2 border-[var(--info-border)] flex items-center justify-center">
                <Mic className="w-7 h-7 text-[var(--info)]" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-[var(--text)]">Processing audio...</p>
                <p className="text-xs text-[var(--text-secondary)]">Preparing transcript</p>
              </div>
              <WaveformBars active={false} />
            </>
          )}

          {/* State: Done */}
          {voiceState === "done" && transcript && (
            <>
              <div className="w-16 h-16 rounded-full bg-[var(--success-bg)] border-2 border-[var(--success-border)] flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-[var(--success)]" />
              </div>
              <div className="w-full space-y-3">
                <div>
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Transcript</p>
                  <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] p-3.5 text-sm text-[var(--text)] leading-relaxed">
                    {transcript}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] px-1">
                  <span className="font-medium">Detected language:</span>
                  <span className="font-bold text-[var(--text)]">Tamil</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={reset} aria-label="Record again">
                <Play className="w-3.5 h-3.5" />
                Record Again
              </Button>
            </>
          )}

          {/* State: Unavailable or Error */}
          {(voiceState === "unavailable" || voiceState === "error") && (
            <>
              <div className="w-16 h-16 rounded-full bg-[var(--warning-bg)] border-2 border-[var(--warning-border)] flex items-center justify-center">
                <MicOff className="w-7 h-7 text-[var(--warning)]" />
              </div>
              <div className="w-full">
                <div className="rounded-lg bg-[var(--warning-bg)] border border-[var(--warning-border)] p-3.5 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-[var(--warning)] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-[var(--warning-foreground)] leading-relaxed">
                    {errorMsg || "Microphone access is unavailable. You can continue using text input."}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={reset} aria-label="Try again">
                Try Again
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Demo Voice Button */}
      {voiceState !== "done" && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <FlaskConical className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
          <p className="text-xs text-[var(--text-secondary)] flex-1">
            For hackathon demo reliability, use a pre-recorded Tamil voice sample.
          </p>
          <Button variant="secondary" size="sm" onClick={useDemoVoice} aria-label="Use demo voice sample">
            Use Demo Voice
          </Button>
        </div>
      )}
    </div>
  );
}
