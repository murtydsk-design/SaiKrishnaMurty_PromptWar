import React from "react";
import { Analysis } from "@/lib/types";

interface AnalysisResultsProps {
  analysis: Analysis;
  onReviewAnswers: () => void;
  onStartNewDecision: () => void;
}

export default function AnalysisResults({
  analysis,
  onReviewAnswers,
  onStartNewDecision,
}: AnalysisResultsProps) {
  const {
    reasoningSummary,
    hiddenAssumptions = [],
    overlookedFactors = [],
    internalConflicts = [],
    questionsToAskYourself = [],
    biasCheck = [],
    reasoningBalance,
  } = analysis;

  const balanceItems = [
    { label: "Short-Term Focus", score: reasoningBalance?.shortTermFocus ?? 5, color: "bg-indigo-500" },
    { label: "Long-Term Focus", score: reasoningBalance?.longTermFocus ?? 5, color: "bg-blue-500" },
    { label: "Financial Focus", score: reasoningBalance?.financialFocus ?? 5, color: "bg-emerald-500" },
    { label: "Growth / Learning Focus", score: reasoningBalance?.growthLearningFocus ?? 5, color: "bg-purple-500" },
    { label: "Risk Awareness", score: reasoningBalance?.riskAwareness ?? 5, color: "bg-amber-500" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3 pb-2 border-b border-slate-800">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
          Your Blind-Spot Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Here are areas of your reasoning that may be worth examining more closely before making your decision.
        </p>

        {/* Prominent Core Principle Callout */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs sm:text-sm font-medium max-w-xl mx-auto shadow-sm">
          &ldquo;This tool does not make decisions for you. It helps you think more clearly.&rdquo;
        </div>
      </div>

      {/* Section 1: Reasoning Summary */}
      <section className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-2.5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide text-xs">
            Reasoning Summary
          </h3>
        </div>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic pl-4 border-l-2 border-slate-700">
          &ldquo;{reasoningSummary}&rdquo;
        </p>
      </section>

      {/* Section 2: Hidden Assumptions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Hidden Assumptions
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {hiddenAssumptions.length} Identified
          </span>
        </div>

        {hiddenAssumptions.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 italic">
            No hidden assumptions were identified from the provided input.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {hiddenAssumptions.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/20 space-y-3 shadow-md hover:border-amber-500/30 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Assumption #{idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-100">
                    {item.assumption}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <p className="font-semibold text-amber-300/90">Why it may be risky:</p>
                    <p className="text-slate-300 leading-relaxed">{item.whyRisky}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <p className="font-semibold text-indigo-300">Test it by:</p>
                    <p className="text-slate-300 leading-relaxed">{item.testItBy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Overlooked Factors */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            Overlooked Factors
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {overlookedFactors.length} Dimensions
          </span>
        </div>

        {overlookedFactors.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 italic">
            No major overlooked factors were identified from the provided input.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {overlookedFactors.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-blue-500/20 space-y-2.5 shadow-md flex flex-col justify-between hover:border-blue-500/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30">
                      {item.category || "General"}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                    {item.factor}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                  <span className="font-semibold text-blue-300/90">Why it matters:</span> {item.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 4: Internal Conflicts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            Internal Conflicts & Tensions
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {internalConflicts.length} Conflicts
          </span>
        </div>

        {internalConflicts.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 italic">
            No internal conflicts were identified from the information provided.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {internalConflicts.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/20 space-y-3 shadow-md hover:border-purple-500/30 transition-colors"
              >
                <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {item.conflict}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statement 1</span>
                    <p className="text-slate-300 leading-relaxed">&ldquo;{item.statementOne}&rdquo;</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statement 2</span>
                    <p className="text-slate-300 leading-relaxed">&ldquo;{item.statementTwo}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 5: Questions To Ask Yourself */}
      <section className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
          <h3 className="text-lg font-bold text-slate-100">
            Questions To Ask Yourself
          </h3>
        </div>

        {questionsToAskYourself.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No reflective questions were generated.</p>
        ) : (
          <ol className="space-y-3 pl-2">
            {questionsToAskYourself.map((q, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-200 flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Section 6: Bias Check */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
            Bias Check
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {biasCheck.length} Cognitive Patterns
          </span>
        </div>

        {biasCheck.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 italic">
            No apparent cognitive biases were identified from the provided input.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {biasCheck.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-orange-500/20 space-y-2 shadow-md hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    Possible Pattern:
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {item.bias}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 7: Reasoning Balance Scorecard */}
      <section className="bg-slate-900/70 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            Reasoning Balance Scorecard
          </h3>
          <p className="text-xs text-slate-400">
            These scores describe the distribution of attention in your reasoning (1 = low focus, 10 = high focus). They do NOT measure whether your decision is right or wrong.
          </p>
        </div>

        <div className="space-y-4">
          {balanceItems.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">{item.label}</span>
                <span className="font-bold text-indigo-300">{item.score}/10</span>
              </div>
              <div
                className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden"
                role="progressbar"
                aria-label={item.label}
                aria-valuenow={item.score}
                aria-valuemin={1}
                aria-valuemax={10}
              >
                <div
                  className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${(item.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onReviewAnswers}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Review My Answers</span>
        </button>

        <button
          type="button"
          onClick={onStartNewDecision}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Start a New Decision</span>
        </button>
      </div>
    </div>
  );
}
