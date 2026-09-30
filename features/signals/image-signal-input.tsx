"use client";

import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon, FlaskConical, CheckCircle, AlertCircle } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_SIZE_LABEL = "5 MB";

const DEMO_CATEGORIES = [
  "Damaged Road",
  "Drainage Overflow",
  "Broken Streetlight",
  "Waste Accumulation",
] as const;

type DemoCategory = (typeof DEMO_CATEGORIES)[number];

interface ImageSignalInputProps {
  imageUrl: string | null;
  onImageChange: (url: string | null, file?: File) => void;
}

function FileSizeError({ msg }: { msg: string }) {
  return (
    <div className="flex gap-2 items-start p-3 rounded-lg bg-[var(--critical-bg)] border border-[var(--critical-border)]">
      <AlertCircle className="w-4 h-4 text-[var(--critical)] shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-xs text-[var(--critical-foreground)]">{msg}</p>
    </div>
  );
}

export function ImageSignalInput({ imageUrl, onImageChange }: ImageSignalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [demoCategory, setDemoCategory] = useState<DemoCategory>("Drainage Overflow");

  const validateAndLoad = useCallback(
    (file: File) => {
      setError("");
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File too large. Maximum size is ${MAX_SIZE_LABEL}.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string, file);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndLoad(file);
    },
    [validateAndLoad]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndLoad(file);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [validateAndLoad]
  );

  const useDemoImage = useCallback(() => {
    setError("");
    // Use a deterministic placeholder — in a real app this would be a server asset
    // We generate a colored SVG data URL as a reliable demo image
    const colors: Record<DemoCategory, string> = {
      "Damaged Road": "#64748b",
      "Drainage Overflow": "#2563eb",
      "Broken Streetlight": "#ca8a04",
      "Waste Accumulation": "#16a34a",
    };
    const color = colors[demoCategory];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <rect width="800" height="500" fill="${color}22"/>
      <rect x="20" y="20" width="760" height="460" rx="8" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="12 6"/>
      <text x="400" y="230" text-anchor="middle" font-family="system-ui" font-size="22" font-weight="600" fill="${color}">Demo Image</text>
      <text x="400" y="270" text-anchor="middle" font-family="system-ui" font-size="16" fill="${color}bb">${demoCategory}</text>
      <text x="400" y="310" text-anchor="middle" font-family="system-ui" font-size="12" fill="${color}88">Synthetic visual evidence — Phase 3 demo</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
    onImageChange(dataUrl);
  }, [demoCategory, onImageChange]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[var(--text)] mb-1">Add Visual Evidence</p>
        <p className="text-xs text-[var(--text-secondary)]">
          Upload an image that helps describe the infrastructure issue.
          Accepted: JPG, JPEG, PNG, WEBP — max {MAX_SIZE_LABEL}.
        </p>
      </div>

      {/* Error */}
      {error && <FileSizeError msg={error} />}

      {/* Preview mode */}
      {imageUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border-2 border-[var(--border)] bg-[var(--surface-subtle)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Uploaded evidence preview"
              className="w-full max-h-64 object-contain"
            />
            <button
              onClick={() => { onImageChange(null); setError(""); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--critical)] hover:border-[var(--critical-border)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--success-bg)] border border-[var(--success-border)]">
            <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0" aria-hidden="true" />
            <p className="text-xs font-medium text-[var(--success-foreground)]">
              Image ready for AI analysis — Gemini vision analysis will be added in Phase 4.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              aria-label="Replace image"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace Image
            </Button>
          </div>
        </div>
      ) : (
        /* Upload zone */
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image — click or drag and drop"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
          className={cn(
            "rounded-xl border-2 border-dashed p-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
            isDragging
              ? "border-[var(--primary)] bg-[var(--info-bg)]"
              : "border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-[var(--info-bg)]" : "bg-[var(--surface-subtle)]"
          )}>
            <ImageIcon className={cn("w-6 h-6", isDragging ? "text-[var(--primary)]" : "text-[var(--text-secondary)]")} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-[var(--text)]">
              {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">JPG, JPEG, PNG, WEBP — up to {MAX_SIZE_LABEL}</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileInput}
        className="sr-only"
        aria-label="Upload image file"
        tabIndex={-1}
      />

      {/* Demo Image Section */}
      {!imageUrl && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <FlaskConical className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs text-[var(--text-secondary)]">
              Use a demo image for hackathon presentation reliability.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDemoCategory(cat)}
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full border font-medium transition-colors",
                    demoCategory === cat
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={useDemoImage} aria-label="Use demo image">
            Use Demo Image
          </Button>
        </div>
      )}
    </div>
  );
}
