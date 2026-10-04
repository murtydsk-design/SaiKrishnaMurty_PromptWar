import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/llm";
import { buildClarifyingPrompt } from "@/lib/prompts";
import { ClarifyingQuestions, ClarifyingRequest } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

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
      console.log("[ThinkLens] JSON_PARSE_OK questions=3");
      return {
        questions: parsed.questions.map((q: string) => q.trim()),
      };
    }
  } catch (err) {
    console.warn("[ThinkLens] JSON_PARSE_FAILED:", err);
  }
  return null;
}

export async function POST(request: Request) {
  console.log("[ThinkLens] CLARIFY_STARTED");
  const keyPresent = Boolean(process.env.GEMINI_API_KEY);
  console.log(`[ThinkLens] GEMINI_KEY_PRESENT=${keyPresent}`);

  if (!keyPresent) {
    console.error("[ThinkLens] CLARIFY_FAILED: GEMINI_API_KEY missing");
    return NextResponse.json(
      { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to environment variables.", detail: "GEMINI_KEY_PRESENT=false" },
      { status: 500 }
    );
  }

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      console.warn("[ThinkLens] REQUEST_VALIDATION_FAILED: Invalid JSON body");
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning.", detail: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      console.warn("[ThinkLens] REQUEST_VALIDATION_FAILED: Body not an object");
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning.", detail: "Body not an object" },
        { status: 400 }
      );
    }

    const decision = typeof body.decision === "string" ? body.decision.trim() : "";
    const options = typeof body.options === "string" ? body.options.trim() : "";
    const details = typeof body.details === "string" ? body.details.trim() : "";
    const reasoning = typeof body.reasoning === "string" ? body.reasoning.trim() : "";

    if (!decision || !details || !reasoning) {
      console.warn("[ThinkLens] REQUEST_VALIDATION_FAILED: Required fields missing");
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning.", detail: "Required fields missing" },
        { status: 400 }
      );
    }

    if (
      decision.length > 500 ||
      options.length > 1000 ||
      details.length > 5000 ||
      reasoning.length > 5000
    ) {
      console.warn("[ThinkLens] REQUEST_VALIDATION_FAILED: Text length limits exceeded");
      return NextResponse.json(
        { error: "Input text exceeds maximum allowed length limits.", detail: "Text length limits exceeded" },
        { status: 400 }
      );
    }

    console.log("[ThinkLens] REQUEST_VALIDATION_OK");

    const reqData: ClarifyingRequest = {
      decision,
      options,
      details,
      reasoning,
    };

    let prompt = buildClarifyingPrompt(reqData);

    // Attempt 1
    let geminiRes = await generateWithGemini(prompt);
    console.log(`[ThinkLens] RESPONSE_TEXT_LENGTH=${geminiRes.text.length}`);
    let result = parseAndValidateClarifyingQuestions(geminiRes.text);

    // Attempt 2 (Retry) if parsing/validation failed
    if (!result) {
      console.warn("[ThinkLens] Attempt 1 validation failed. Retrying with explicit JSON notice...");
      const retryInstruction = "\n\nCRITICAL RETRY NOTICE: Return ONLY valid JSON matching the required schema. Do not include markdown fences, explanations, or additional text.";
      geminiRes = await generateWithGemini(prompt + retryInstruction);
      console.log(`[ThinkLens] RESPONSE_TEXT_LENGTH=${geminiRes.text.length}`);
      result = parseAndValidateClarifyingQuestions(geminiRes.text);
    }

    if (!result) {
      console.error("[ThinkLens] CLARIFY_FAILED: Failed to produce valid questions after retry.");
      return NextResponse.json(
        { error: "We couldn't analyze your input right now. Please try again.", detail: "Failed to produce valid questions after retry" },
        { status: 500 }
      );
    }

    console.log("[ThinkLens] CLARIFY_SUCCESS");
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[ThinkLens] CLARIFY_FAILED error=${errMsg}`);
    return NextResponse.json(
      { error: "We couldn't analyze your input right now. Please try again.", detail: errMsg },
      { status: 500 }
    );
  }
}
