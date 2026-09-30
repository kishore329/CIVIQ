import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/ai/analyzeSignal";

export async function GET() {
  const connected = isGeminiConfigured();
  return NextResponse.json({
    status: connected ? "CONNECTED" : "DEMO MODE",
    engine: connected ? "Google Gemini 2.5 Flash" : "Deterministic Fallback Engine",
    liveAiAvailable: connected,
  });
}
