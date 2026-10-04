"use client";

import React, { useState } from "react";
import ThinkLensHeader from "@/components/ThinkLensHeader";
import StepIndicator from "@/components/StepIndicator";
import DecisionForm from "@/components/DecisionForm";
import ClarifyingQuestions from "@/components/ClarifyingQuestions";
import AnalysisResults from "@/components/AnalysisResults";
import { DecisionInput, Analysis } from "@/lib/types";

export default function HomePage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<DecisionInput>({
    decision: "",
    options: "",
    details: "",
    reasoning: "",
  });
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const [isLoadingClarify, setIsLoadingClarify] = useState<boolean>(false);
  const [isLoadingAnalyze, setIsLoadingAnalyze] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Step 1 -> Step 2: Call /api/clarify
  const handleFormSubmit = async (submittedData: DecisionInput) => {
    setFormData(submittedData);
    setIsLoadingClarify(true);
    setApiError(null);

    try {
      let response: Response;
      try {
        response = await fetch("/api/clarify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submittedData),
        });
      } catch {
        throw new Error("Could not connect to the server. Please check your dev server connection.");
      }

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        throw new Error("Received an invalid response format from the server. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate clarifying questions.");
      }

      if (
        !data ||
        !Array.isArray(data.questions) ||
        data.questions.length !== 3
      ) {
        throw new Error("Invalid format received from clarification service.");
      }

      setQuestions(data.questions);
      setAnswers((prev) =>
        data.questions.map((_: string, idx: number) => prev[idx] || "")
      );
      setStep(2);
    } catch (err: unknown) {
      console.error("Error calling /api/clarify:", err);
      setApiError(
        err instanceof Error
          ? err.message
          : "We couldn't generate the questions right now. Please try again."
      );
    } finally {
      setIsLoadingClarify(false);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
    setApiError(null);
  };

  // Step 2 -> Step 3: Call /api/analyze
  const handleClarificationContinue = async (completedAnswers: string[]) => {
    setAnswers(completedAnswers);
    setIsLoadingAnalyze(true);
    setApiError(null);

    const payload = {
      decision: formData.decision,
      options: formData.options,
      details: formData.details,
      reasoning: formData.reasoning,
      clarifyingAnswers: completedAnswers,
    };

    try {
      let response: Response;
      try {
        response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch {
        throw new Error("Could not connect to the server. Please check your dev server connection.");
      }

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        throw new Error("Received an invalid response format from the server. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data?.error || "We couldn't complete the analysis right now. Please try again.");
      }

      // Validate required response fields
      if (
        !data ||
        typeof data.reasoningSummary !== "string" ||
        !Array.isArray(data.hiddenAssumptions) ||
        !Array.isArray(data.overlookedFactors) ||
        !Array.isArray(data.internalConflicts) ||
        !Array.isArray(data.questionsToAskYourself) ||
        !Array.isArray(data.biasCheck) ||
        !data.reasoningBalance ||
        typeof data.reasoningBalance !== "object"
      ) {
        throw new Error("We couldn't generate a complete analysis. Please try again.");
      }

      setAnalysis(data as Analysis);
      setStep(3);
    } catch (err: unknown) {
      console.error("Error calling /api/analyze:", err);
      setApiError(
        err instanceof Error
          ? err.message
          : "ThinkLens couldn't complete the analysis right now. Please try again."
      );
    } finally {
      setIsLoadingAnalyze(false);
    }
  };

  const handleReviewAnswers = () => {
    setStep(2);
    setApiError(null);
  };

  const handleStartNewDecision = () => {
    setFormData({
      decision: "",
      options: "",
      details: "",
      reasoning: "",
    });
    setQuestions([]);
    setAnswers([]);
    setAnalysis(null);
    setApiError(null);
    setStep(1);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between items-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header Component */}
        <ThinkLensHeader />

        {/* Progress Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Global API Error Alert on Step 2 / Step 3 */}
        {apiError && step !== 1 && (
          <div className="w-full max-w-3xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{apiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-xs font-semibold text-red-400 underline hover:text-red-300 shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Overlay State for Analysis */}
        {isLoadingAnalyze && (
          <div className="w-full max-w-3xl mx-auto p-8 sm:p-12 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-2xl text-center space-y-4 animate-pulse">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-400">
              <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-100">Examining your reasoning...</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                ThinkLens is examining your decision, details, and answers for hidden assumptions, overlooked factors, tensions, and cognitive patterns.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Decision Input Form */}
        {step === 1 && (
          <DecisionForm
            initialData={formData}
            onSubmit={handleFormSubmit}
            isLoading={isLoadingClarify}
            apiError={apiError}
            onClearError={() => setApiError(null)}
          />
        )}

        {/* Step 2: Clarifying Questions */}
        {step === 2 && !isLoadingAnalyze && (
          <ClarifyingQuestions
            questions={questions}
            initialAnswers={answers}
            onBack={handleBackToForm}
            onContinue={handleClarificationContinue}
            isLoading={isLoadingAnalyze}
          />
        )}

        {/* Step 3: Blind-Spot Analysis Results */}
        {step === 3 && analysis && !isLoadingAnalyze && (
          <AnalysisResults
            analysis={analysis}
            onReviewAnswers={handleReviewAnswers}
            onStartNewDecision={handleStartNewDecision}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 pt-8 pb-4 border-t border-slate-900/50 w-full max-w-3xl mt-8">
        ThinkLens &copy; {new Date().getFullYear()} — Critical-Thinking Assistant
      </footer>
    </main>
  );
}
