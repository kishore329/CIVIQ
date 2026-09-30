import { NextRequest, NextResponse } from "next/server";
import { analyzeCitizenSignal } from "@/lib/ai/analyzeSignal";
import { CitizenSignalInput } from "@/lib/ai/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CitizenSignalInput;

    // Check payload size safety
    if (body.image && body.image.length > 8 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Uploaded image exceeds the maximum supported size limit (5 MB).",
        },
        { status: 413 }
      );
    }

    const response = await analyzeCitizenSignal(body);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Internal processing error";
    return NextResponse.json(
      {
        error: "Failed to process civic signal analysis.",
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}
