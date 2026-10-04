import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/llm";
import { buildClarifyingPrompt } from "@/lib/prompts";
import { ClarifyingQuestions, ClarifyingRequest } from "@/lib/types";

function parseAndValidateClarifyingQuestions(rawText: string): ClarifyingQuestions | null {
  try {
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleaned);

    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.questions) &&
      parsed.questions.length === 3 &&
      parsed.questions.every((q: unknown) => typeof q === "string" && q.trim().length > 0)
    ) {
      return {
        questions: parsed.questions.map((q: string) => q.trim()),
      };
    }
  } catch {
    // Parse failed
  }
  return null;
}

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning." },
        { status: 400 }
      );
    }

    const decision = typeof body.decision === "string" ? body.decision.trim() : "";
    const options = typeof body.options === "string" ? body.options.trim() : "";
    const details = typeof body.details === "string" ? body.details.trim() : "";
    const reasoning = typeof body.reasoning === "string" ? body.reasoning.trim() : "";

    if (!decision || !details || !reasoning) {
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning." },
        { status: 400 }
      );
    }

    if (
      decision.length > 500 ||
      options.length > 1000 ||
      details.length > 5000 ||
      reasoning.length > 5000
    ) {
      return NextResponse.json(
        { error: "Input text exceeds maximum allowed length limits." },
        { status: 400 }
      );
    }

    const reqData: ClarifyingRequest = {
      decision,
      options,
      details,
      reasoning,
    };

    let prompt = buildClarifyingPrompt(reqData);

    // Attempt 1
    let rawResponse = await generateWithGemini(prompt);
    let result = parseAndValidateClarifyingQuestions(rawResponse);

    // Attempt 2 (Retry) if parsing/validation failed
    if (!result) {
      const retryInstruction = "\n\nCRITICAL RETRY NOTICE: Your previous response could not be parsed as valid JSON matching the required schema. Return ONLY valid JSON matching the required schema. Do not include markdown fences, explanations, or additional text.";
      rawResponse = await generateWithGemini(prompt + retryInstruction);
      result = parseAndValidateClarifyingQuestions(rawResponse);
    }

    if (!result) {
      return NextResponse.json(
        { error: "We couldn't analyze your input right now. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Gemini API key")) {
      return NextResponse.json(
        { error: "Gemini API key is not configured in .env.local. Please add a valid GEMINI_API_KEY." },
        { status: 500 }
      );
    }
    console.error("Error in /api/clarify:", error);
    return NextResponse.json(
      { error: "We couldn't analyze your input right now. Please try again." },
      { status: 500 }
    );
  }
}
