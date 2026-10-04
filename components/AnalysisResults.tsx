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
    { label: "Short-Term Focus", score: reasoningBalance?.shortTermFocus ?? 5 },
    { label: "Long-Term Focus", score: reasoningBalance?.longTermFocus ?? 5 },
    { label: "Financial Focus", score: reasoningBalance?.financialFocus ?? 5 },
    { label: "Growth / Learning Focus", score: reasoningBalance?.growthLearningFocus ?? 5 },
    { label: "Risk Awareness", score: reasoningBalance?.riskAwareness ?? 5 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3 pb-4 border-b border-white/10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F1E8]">
          Your Blind-Spot Analysis
        </h2>
        <p className="text-xs sm:text-sm text-[#A9A49A] max-w-xl mx-auto">
          Here are areas of your reasoning worth examining more closely before making your decision.
        </p>

        {/* Core Principle Callout */}
        <div className="mt-4 p-4 rounded-xl bg-[#171715] border border-[#D6A84F]/30 max-w-xl mx-auto text-center shadow-sm">
          <p className="text-[10px] font-mono font-bold text-[#D6A84F] uppercase tracking-widest mb-1">
            CORE PRINCIPLE
          </p>
          <p className="text-xs sm:text-sm font-medium text-[#F3EBDD]">
            &ldquo;This tool does not make decisions for you. It helps you think more clearly.&rdquo;
          </p>
        </div>
      </div>

      {/* Section 1: Reasoning Summary */}
      <section className="bg-[#171715] p-6 rounded-xl border border-white/10 space-y-2.5 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
          <h3 className="text-xs font-mono font-bold text-[#D6A84F] uppercase tracking-wider">
            REASONING SUMMARY
          </h3>
        </div>
        <p className="text-sm sm:text-base text-[#F5F1E8] leading-relaxed italic pl-4 border-l-2 border-[#D6A84F]/40">
          &ldquo;{reasoningSummary}&rdquo;
        </p>
      </section>

      {/* Section 2: Hidden Assumptions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#F5F1E8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
            Hidden Assumptions
          </h3>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#D6A84F]/10 text-[#D6A84F] border border-[#D6A84F]/30">
            {hiddenAssumptions.length} Identified
          </span>
        </div>

        {hiddenAssumptions.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#171715] border border-white/10 text-xs text-[#A9A49A] italic">
            No hidden assumptions were identified from the provided input.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {hiddenAssumptions.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#171715] border border-white/10 space-y-3 shadow-md hover:border-[#D6A84F]/40 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-[#D6A84F] uppercase tracking-wider">
                    Assumption 0{idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-[#F5F1E8]">
                    {item.assumption}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-white/10">
                  <div className="p-3 rounded-lg bg-[#0D0D0C] border border-white/10 space-y-1">
                    <p className="font-bold text-[#D6A84F]">Why it may be risky:</p>
                    <p className="text-[#A9A49A] leading-relaxed">{item.whyRisky}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0D0D0C] border border-white/10 space-y-1">
                    <p className="font-bold text-[#F3EBDD]">Test it by:</p>
                    <p className="text-[#A9A49A] leading-relaxed">{item.testItBy}</p>
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
          <h3 className="text-lg font-bold text-[#F5F1E8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
            Overlooked Factors
          </h3>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#1D1D1A] text-[#A9A49A] border border-white/10">
            {overlookedFactors.length} Dimensions
          </span>
        </div>

        {overlookedFactors.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#171715] border border-white/10 text-xs text-[#A9A49A] italic">
            No major overlooked factors were identified from the provided input.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {overlookedFactors.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#171715] border border-white/10 space-y-2.5 shadow-md flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#A9A49A] uppercase tracking-widest px-2 py-0.5 rounded bg-[#1D1D1A] border border-white/10">
                      {item.category || "General"}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F5F1E8] leading-snug">
                    {item.factor}
                  </h4>
                </div>
                <p className="text-xs text-[#A9A49A] leading-relaxed pt-2 border-t border-white/10">
                  <span className="font-semibold text-[#F3EBDD]">Why it matters:</span> {item.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 4: Internal Conflicts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#F5F1E8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
            Internal Conflicts & Tensions
          </h3>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#1D1D1A] text-[#A9A49A] border border-white/10">
            {internalConflicts.length} Conflicts
          </span>
        </div>

        {internalConflicts.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#171715] border border-white/10 text-xs text-[#A9A49A] italic">
            No internal conflicts were identified from the information provided.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {internalConflicts.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#171715] border border-white/10 space-y-3 shadow-md hover:border-white/20 transition-colors"
              >
                <h4 className="text-sm font-semibold text-[#F3EBDD] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6A84F]"></span>
                  {item.conflict}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-[#0D0D0C] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#78736A] uppercase tracking-wider">Statement 1</span>
                    <p className="text-[#A9A49A] leading-relaxed">&ldquo;{item.statementOne}&rdquo;</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D0D0C] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#78736A] uppercase tracking-wider">Statement 2</span>
                    <p className="text-[#A9A49A] leading-relaxed">&ldquo;{item.statementTwo}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 5: Questions To Ask Yourself */}
      <section className="bg-[#171715] p-6 rounded-xl border border-white/10 space-y-4 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
          <h3 className="text-lg font-bold text-[#F5F1E8]">
            Questions To Ask Yourself
          </h3>
        </div>

        {questionsToAskYourself.length === 0 ? (
          <p className="text-xs text-[#A9A49A] italic">No reflective questions were generated.</p>
        ) : (
          <ol className="space-y-3">
            {questionsToAskYourself.map((q, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-[#F5F1E8] flex items-start gap-3.5 bg-[#0D0D0C] p-4 rounded-xl border border-white/10">
                <span className="font-mono text-xs font-bold text-[#D6A84F] shrink-0 pt-0.5">
                  0{idx + 1}
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
          <h3 className="text-lg font-bold text-[#F5F1E8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
            Bias Check
          </h3>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#1D1D1A] text-[#A9A49A] border border-white/10">
            {biasCheck.length} Cognitive Patterns
          </span>
        </div>

        {biasCheck.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#171715] border border-white/10 text-xs text-[#A9A49A] italic">
            No apparent cognitive biases were identified from the provided input.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {biasCheck.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#171715] border border-white/10 space-y-2 shadow-md hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#D6A84F] uppercase tracking-wider">
                    PATTERN WORTH EXAMINING:
                  </span>
                  <h4 className="text-sm font-semibold text-[#F5F1E8]">
                    {item.bias}
                  </h4>
                </div>
                <p className="text-xs text-[#A9A49A] leading-relaxed pt-2 border-t border-white/10">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 7: Reasoning Balance Scorecard */}
      <section className="bg-[#171715] p-6 sm:p-8 rounded-xl border border-white/10 space-y-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[#F5F1E8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
            Reasoning Balance Scorecard
          </h3>
          <p className="text-xs text-[#A9A49A]">
            These scores describe the distribution of attention in your reasoning (1 = low focus, 10 = high focus). They do NOT measure whether your decision is right or wrong.
          </p>
        </div>

        <div className="space-y-4">
          {balanceItems.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#F5F1E8]">{item.label}</span>
                <span className="font-mono font-bold text-[#D6A84F]">{item.score}/10</span>
              </div>
              <div
                className="w-full h-2.5 rounded-full bg-[#0D0D0C] border border-white/10 overflow-hidden"
                role="progressbar"
                aria-label={item.label}
                aria-valuenow={item.score}
                aria-valuemin={1}
                aria-valuemax={10}
              >
                <div
                  className="h-full bg-[#D6A84F] transition-all duration-500 rounded-full"
                  style={{ width: `${(item.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onReviewAnswers}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1D1D1A] hover:bg-[#252522] text-[#F5F1E8] text-sm font-semibold border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#A9A49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Review My Answers</span>
        </button>

        <button
          type="button"
          onClick={onStartNewDecision}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D6A84F] hover:bg-[#E0B65A] active:bg-[#C9963E] text-[#0D0D0C] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#0D0D0C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Start a New Decision</span>
        </button>
      </div>
    </div>
  );
}
