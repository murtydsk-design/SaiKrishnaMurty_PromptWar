import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/llm";
import { buildAnalysisPrompt } from "@/lib/prompts";
import { Analysis, AnalysisRequest } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function parseAndValidateAnalysis(rawText: string): Analysis | null {
  try {
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleaned);

    if (!parsed || typeof parsed !== "object") {
      console.warn("[ThinkLens] JSON_PARSE_FAILED: Object null or invalid type");
      return null;
    }

    console.log("[ThinkLens] JSON_PARSE_OK");

    // Validate reasoningSummary
    if (typeof parsed.reasoningSummary !== "string" || !parsed.reasoningSummary.trim()) {
      console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: reasoningSummary missing or not a string");
      return null;
    }

    // Validate hiddenAssumptions
    if (!Array.isArray(parsed.hiddenAssumptions)) {
      console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: hiddenAssumptions not array");
      return null;
    }
    for (const item of parsed.hiddenAssumptions) {
      if (
        !item ||
        typeof item.assumption !== "string" ||
        typeof item.whyRisky !== "string" ||
        typeof item.testItBy !== "string"
      ) {
        console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: hiddenAssumptions item malformed");
        return null;
      }
    }

    // Validate overlookedFactors
    if (!Array.isArray(parsed.overlookedFactors)) {
      console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: overlookedFactors not array");
      return null;
    }
    for (const item of parsed.overlookedFactors) {
      if (
        !item ||
        typeof item.factor !== "string" ||
        typeof item.whyItMatters !== "string" ||
        typeof item.category !== "string"
      ) {
        console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: overlookedFactors item malformed");
        return null;
      }
    }

    // Validate internalConflicts
    if (!Array.isArray(parsed.internalConflicts)) {
      console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: internalConflicts not array");
      return null;
    }
    for (const item of parsed.internalConflicts) {
      if (!item || typeof item.conflict !== "string") {
        console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: internalConflicts conflict title missing");
        return null;
      }
      const s1 = item.statementOne ?? item.statementA;
      const s2 = item.statementTwo ?? item.statementB;
      if (typeof s1 !== "string" || typeof s2 !== "string") {
        console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: internalConflicts statements malformed");
        return null;
      }
    }

    // Validate questionsToAskYourself
    if (!Array.isArray(parsed.questionsToAskYourself)) {
      console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: questionsToAskYourself not array");
      return null;
    }
    for (const q of parsed.questionsToAskYourself) {
      if (typeof q !== "string") {
        console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: question not a string");
        return null;
      }
    }

    // Validate biasCheck
    if (!Array.isArray(parsed.biasCheck)) {
      console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: biasCheck not array");
      return null;
    }
    for (const b of parsed.biasCheck) {
      if (!b || typeof b.bias !== "string") {
        console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: biasCheck bias title missing");
        return null;
      }
      const exp = b.explanation ?? b.evidence;
      if (typeof exp !== "string") {
        console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: biasCheck explanation missing");
        return null;
      }
    }

    // Validate reasoningBalance
    const rb = parsed.reasoningBalance;
    if (!rb || typeof rb !== "object") {
      console.warn("[ThinkLens] RESPONSE_VALIDATION_FAILED: reasoningBalance not object");
      return null;
    }

    const clampScore = (score: any): number => {
      const num = parseInt(score, 10);
      if (isNaN(num)) return 5;
      return Math.min(Math.max(num, 1), 10);
    };

    const reasoningBalance = {
      shortTermFocus: clampScore(rb.shortTermFocus),
      longTermFocus: clampScore(rb.longTermFocus),
      financialFocus: clampScore(rb.financialFocus),
      growthLearningFocus: clampScore(rb.growthLearningFocus),
      riskAwareness: clampScore(rb.riskAwareness),
    };

    console.log("[ThinkLens] RESPONSE_VALIDATION_OK");

    return {
      reasoningSummary: parsed.reasoningSummary.trim(),
      hiddenAssumptions: parsed.hiddenAssumptions.map((i: any) => ({
        assumption: (i.assumption || "").trim(),
        whyRisky: (i.whyRisky || "").trim(),
        testItBy: (i.testItBy || "").trim(),
      })),
      overlookedFactors: parsed.overlookedFactors.map((i: any) => ({
        factor: (i.factor || "").trim(),
        whyItMatters: (i.whyItMatters || "").trim(),
        category: (i.category || "").trim(),
      })),
      internalConflicts: parsed.internalConflicts.map((i: any) => ({
        conflict: (i.conflict || "").trim(),
        statementOne: String(i.statementOne ?? i.statementA ?? "").trim(),
        statementTwo: String(i.statementTwo ?? i.statementB ?? "").trim(),
      })),
      questionsToAskYourself: parsed.questionsToAskYourself.map((q: string) => q.trim()),
      biasCheck: parsed.biasCheck.map((b: any) => ({
        bias: (b.bias || "").trim(),
        explanation: String(b.explanation ?? b.evidence ?? "").trim(),
      })),
      reasoningBalance,
    };
  } catch (err) {
    console.warn("[ThinkLens] JSON_PARSE_FAILED:", err);
  }
  return null;
}

export async function POST(request: Request) {
  console.log("[ThinkLens] ANALYZE_STARTED");
  const keyPresent = Boolean(process.env.GEMINI_API_KEY);
  console.log(`[ThinkLens] GEMINI_KEY_PRESENT=${keyPresent}`);

  if (!keyPresent) {
    console.error("[ThinkLens] ANALYZE_FAILED: GEMINI_API_KEY missing");
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
    const rawAnswers = Array.isArray(body.clarifyingAnswers) ? body.clarifyingAnswers : [];

    if (!decision || !details || !reasoning) {
      console.warn("[ThinkLens] REQUEST_VALIDATION_FAILED: Required fields missing");
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning.", detail: "Required fields missing" },
        { status: 400 }
      );
    }

    const clarifyingAnswers: string[] = rawAnswers.map((ans: unknown) =>
      typeof ans === "string" ? ans.trim() : ""
    );

    if (
      decision.length > 500 ||
      options.length > 1000 ||
      details.length > 5000 ||
      reasoning.length > 5000 ||
      clarifyingAnswers.some((a) => a.length > 2000)
    ) {
      console.warn("[ThinkLens] REQUEST_VALIDATION_FAILED: Text length limits exceeded");
      return NextResponse.json(
        { error: "Input text exceeds maximum allowed length limits.", detail: "Text length limits exceeded" },
        { status: 400 }
      );
    }

    console.log("[ThinkLens] REQUEST_VALIDATION_OK");

    const reqData: AnalysisRequest = {
      decision,
      options,
      details,
      reasoning,
      clarifyingAnswers,
    };

    let prompt = buildAnalysisPrompt(reqData);

    // Attempt 1
    let geminiRes = await generateWithGemini(prompt);
    console.log(`[ThinkLens] RESPONSE_TEXT_LENGTH=${geminiRes.text.length}`);
    let result = parseAndValidateAnalysis(geminiRes.text);

    // Attempt 2 (Retry) if parsing/validation failed
    if (!result) {
      console.warn("[ThinkLens] Attempt 1 parse/validation failed. Retrying with strict JSON notice...");
      const retryInstruction = "\n\nCRITICAL RETRY NOTICE: Return ONLY valid JSON matching the required schema. Do not include markdown code fences, explanations, or text outside the JSON object.";
      geminiRes = await generateWithGemini(prompt + retryInstruction);
      console.log(`[ThinkLens] RESPONSE_TEXT_LENGTH=${geminiRes.text.length}`);
      result = parseAndValidateAnalysis(geminiRes.text);
    }

    if (!result) {
      console.error("[ThinkLens] ANALYZE_FAILED: Response parsing and validation failed after retry.");
      return NextResponse.json(
        { error: "We couldn't analyze your input right now. Please try again.", detail: "Response parsing/validation failed after retry" },
        { status: 500 }
      );
    }

    console.log("[ThinkLens] ANALYZE_SUCCESS");
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[ThinkLens] ANALYZE_FAILED error=${errMsg}`);
    return NextResponse.json(
      { error: "We couldn't analyze your input right now. Please try again.", detail: errMsg },
      { status: 500 }
    );
  }
}
