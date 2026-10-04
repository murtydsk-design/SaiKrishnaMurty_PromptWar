import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/llm";
import { buildAnalysisPrompt } from "@/lib/prompts";
import { Analysis, AnalysisRequest } from "@/lib/types";

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

    if (!parsed || typeof parsed !== "object") return null;

    // Validate reasoningSummary
    if (typeof parsed.reasoningSummary !== "string" || !parsed.reasoningSummary.trim()) {
      return null;
    }

    // Validate hiddenAssumptions
    if (!Array.isArray(parsed.hiddenAssumptions)) return null;
    for (const item of parsed.hiddenAssumptions) {
      if (
        !item ||
        typeof item.assumption !== "string" ||
        typeof item.whyRisky !== "string" ||
        typeof item.testItBy !== "string"
      ) {
        return null;
      }
    }

    // Validate overlookedFactors
    if (!Array.isArray(parsed.overlookedFactors)) return null;
    for (const item of parsed.overlookedFactors) {
      if (
        !item ||
        typeof item.factor !== "string" ||
        typeof item.whyItMatters !== "string" ||
        typeof item.category !== "string"
      ) {
        return null;
      }
    }

    // Validate internalConflicts
    if (!Array.isArray(parsed.internalConflicts)) return null;
    for (const item of parsed.internalConflicts) {
      if (
        !item ||
        typeof item.conflict !== "string" ||
        typeof item.statementOne !== "string" ||
        typeof item.statementTwo !== "string"
      ) {
        return null;
      }
    }

    // Validate questionsToAskYourself
    if (!Array.isArray(parsed.questionsToAskYourself)) return null;
    for (const q of parsed.questionsToAskYourself) {
      if (typeof q !== "string") return null;
    }

    // Validate biasCheck
    if (!Array.isArray(parsed.biasCheck)) return null;
    for (const b of parsed.biasCheck) {
      if (!b || typeof b.bias !== "string" || typeof b.explanation !== "string") {
        return null;
      }
    }

    // Validate reasoningBalance
    const rb = parsed.reasoningBalance;
    if (!rb || typeof rb !== "object") return null;

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

    return {
      reasoningSummary: parsed.reasoningSummary.trim(),
      hiddenAssumptions: parsed.hiddenAssumptions.map((i: any) => ({
        assumption: i.assumption.trim(),
        whyRisky: i.whyRisky.trim(),
        testItBy: i.testItBy.trim(),
      })),
      overlookedFactors: parsed.overlookedFactors.map((i: any) => ({
        factor: i.factor.trim(),
        whyItMatters: i.whyItMatters.trim(),
        category: i.category.trim(),
      })),
      internalConflicts: parsed.internalConflicts.map((i: any) => ({
        conflict: i.conflict.trim(),
        statementOne: i.statementOne.trim(),
        statementTwo: i.statementTwo.trim(),
      })),
      questionsToAskYourself: parsed.questionsToAskYourself.map((q: string) => q.trim()),
      biasCheck: parsed.biasCheck.map((b: any) => ({
        bias: b.bias.trim(),
        explanation: b.explanation.trim(),
      })),
      reasoningBalance,
    };
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
    const rawAnswers = Array.isArray(body.clarifyingAnswers) ? body.clarifyingAnswers : [];

    if (!decision || !details || !reasoning) {
      return NextResponse.json(
        { error: "Please provide a decision, details, and your reasoning." },
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
      return NextResponse.json(
        { error: "Input text exceeds maximum allowed length limits." },
        { status: 400 }
      );
    }

    const reqData: AnalysisRequest = {
      decision,
      options,
      details,
      reasoning,
      clarifyingAnswers,
    };

    let prompt = buildAnalysisPrompt(reqData);

    // Attempt 1
    let rawResponse = await generateWithGemini(prompt);
    let result = parseAndValidateAnalysis(rawResponse);

    // Attempt 2 (Retry) if parsing/validation failed
    if (!result) {
      const retryInstruction = "\n\nCRITICAL RETRY NOTICE: Your previous response could not be parsed as valid JSON matching the required schema. Return ONLY valid JSON matching the required schema. Do not include markdown fences, explanations, or additional text.";
      rawResponse = await generateWithGemini(prompt + retryInstruction);
      result = parseAndValidateAnalysis(rawResponse);
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
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "We couldn't analyze your input right now. Please try again." },
      { status: 500 }
    );
  }
}
