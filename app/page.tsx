"use client";

import React, { useState } from "react";
import ThinkLensHeader from "@/components/ThinkLensHeader";
import StepIndicator from "@/components/StepIndicator";
import DecisionForm from "@/components/DecisionForm";
import ClarifyingQuestions from "@/components/ClarifyingQuestions";
import { DecisionInput } from "@/lib/types";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFormSubmit = async (submittedData: DecisionInput) => {
    setFormData(submittedData);
    setIsLoading(true);
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
      // Reset or align answers array length
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
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
    setApiError(null);
  };

  const handleClarificationContinue = (completedAnswers: string[]) => {
    setAnswers(completedAnswers);
    setStep(3);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between items-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header Component */}
        <ThinkLensHeader />

        {/* Progress Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step 1: Decision Input Form */}
        {step === 1 && (
          <DecisionForm
            initialData={formData}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            apiError={apiError}
            onClearError={() => setApiError(null)}
          />
        )}

        {/* Step 2: Clarifying Questions */}
        {step === 2 && (
          <ClarifyingQuestions
            questions={questions}
            initialAnswers={answers}
            onBack={handleBackToForm}
            onContinue={handleClarificationContinue}
          />
        )}

        {/* Step 3: Stage 4 Completion View (Ready for Stage 5 Analysis) */}
        {step === 3 && (
          <div className="w-full max-w-3xl mx-auto space-y-6 bg-slate-900/80 p-6 sm:p-8 rounded-2xl border border-indigo-500/30 shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Clarification Flow Complete!</h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Your decision details and clarifying responses have been recorded in state and are ready for the blind-spot analysis engine.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recorded Summary (Stage 4)
              </h3>
              <div className="text-xs space-y-1.5 text-slate-300">
                <p><span className="font-semibold text-slate-400">Decision:</span> {formData.decision}</p>
                <p><span className="font-semibold text-slate-400">Options:</span> {formData.options || "None specified"}</p>
                <p><span className="font-semibold text-slate-400">Questions Answered:</span> {answers.filter((a) => a.trim().length > 0).length} of 3</p>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Review Questions
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Edit Decision
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 pt-8 pb-4 border-t border-slate-900/50 w-full max-w-3xl mt-8">
        ThinkLens &copy; {new Date().getFullYear()} — Critical-Thinking Assistant
      </footer>
    </main>
  );
}
