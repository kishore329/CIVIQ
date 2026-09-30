/**
 * CIVIQ Central Signal Analysis Service (Phase 4)
 *
 * Orchestrates Gemini live AI analysis with automatic fallback to deterministic
 * mock AI on missing keys, rate limits, network failures, or schema errors.
 */

import { geminiAnalyzeSignal } from "./gemini";
import { mockAIAnalyze } from "./mockAI";
import {
  CitizenSignalInput,
  CitizenSignalAnalysis,
  CitizenSignalInputSchema,
} from "./schemas";

export interface AnalysisResponse {
  success: boolean;
  data: CitizenSignalAnalysis;
  mode: "gemini" | "demo";
  notice?: string;
}

/**
 * Checks if live Gemini AI service is configured
 */
export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 0 && key !== "your_gemini_api_key_here");
}

/**
 * Sanitized logging helper - strictly protects user privacy and secrets
 */
function logEvent(
  level: "info" | "warn" | "error",
  event: string,
  meta?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const sanitizedMeta = meta ? { ...meta } : {};
  // Strip sensitive payload fields
  delete sanitizedMeta.image;
  delete sanitizedMeta.apiKey;
  delete sanitizedMeta.authorization;

  console[level](
    `[CIVIQ-AI] [${timestamp}] ${event}`,
    Object.keys(sanitizedMeta).length ? JSON.stringify(sanitizedMeta) : ""
  );
}

/**
 * Master analysis function called by API routes
 */
export async function analyzeCitizenSignal(
  rawInput: CitizenSignalInput
): Promise<AnalysisResponse> {
  // 1. Validate input structure
  const inputValidation = CitizenSignalInputSchema.safeParse(rawInput);
  const input = inputValidation.success ? inputValidation.data : rawInput;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const hasKey = Boolean(apiKey && apiKey.length > 0 && apiKey !== "your_gemini_api_key_here");

  logEvent("info", "Signal analysis requested", {
    source: input.source || "text",
    ward: input.ward || "unspecified",
    language: input.language || "auto",
    hasImage: Boolean(input.image),
    hasText: Boolean(input.text && input.text.length > 0),
    geminiConfigured: hasKey,
  });

  // 2. Fallback if no API key is present
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    logEvent("info", "GEMINI_API_KEY not configured — activating Demo AI Mode");
    const demoResult = await mockAIAnalyze(input);
    return {
      success: true,
      data: demoResult,
      mode: "demo",
      notice: "Demo AI Mode active (GEMINI_API_KEY not configured in .env.local).",
    };
  }

  // 3. Attempt Gemini Live AI with safety fallback
  try {
    const geminiResult = await geminiAnalyzeSignal(input, apiKey);
    logEvent("info", "Gemini live analysis completed successfully", {
      category: geminiResult.category,
      severity: geminiResult.severity,
      urgency: geminiResult.urgency,
      confidence: geminiResult.confidence,
    });

    return {
      success: true,
      data: geminiResult,
      mode: "gemini",
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logEvent("warn", "Gemini analysis error — falling back to deterministic AI", {
      error: errorMsg.slice(0, 150),
    });

    // Graceful fallback to deterministic mock analysis
    const fallbackResult = await mockAIAnalyze(input);
    return {
      success: true,
      data: fallbackResult,
      mode: "demo",
      notice: "Live AI is temporarily unavailable. CIVIQ has switched to Demo AI Mode.",
    };
  }
}
