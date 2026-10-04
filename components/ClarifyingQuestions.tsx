import React, { useState } from "react";

interface ClarifyingQuestionsProps {
  questions: string[];
  initialAnswers: string[];
  onBack: () => void;
  onContinue: (answers: string[]) => void;
  isLoading?: boolean;
}

export default function ClarifyingQuestions({
  questions,
  initialAnswers,
  onBack,
  onContinue,
  isLoading = false,
}: ClarifyingQuestionsProps) {
  const [answers, setAnswers] = useState<string[]>(() => {
    return questions.map((_, i) => initialAnswers[i] || "");
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (let i = 0; i < answers.length; i++) {
      if (answers[i].trim().length > 2000) {
        setValidationError(`Answer ${i + 1} exceeds the 2000 character limit.`);
        return;
      }
    }

    setValidationError(null);
    onContinue(answers);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 bg-[#171715] p-6 sm:p-8 rounded-xl border border-white/10 shadow-xl">
      {/* Header section */}
      <div className="space-y-1 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D6A84F]"></span>
          <h2 className="text-xl font-bold text-[#F5F1E8]">Let&apos;s examine your thinking</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#A9A49A] leading-relaxed">
          These questions are designed specifically around your decision. Answer what you can — you can also skip any question.
        </p>
      </div>

      {validationError && (
        <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 text-red-200 text-xs">
          {validationError}
        </div>
      )}

      {/* Form with Questions */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="space-y-2.5 p-5 rounded-xl bg-[#0D0D0C]/90 border border-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#D6A84F] uppercase tracking-wider block">
                  Question 0{index + 1}
                </span>
                <label
                  htmlFor={`question-${index}`}
                  className="text-sm sm:text-base font-semibold text-[#F5F1E8] leading-snug block"
                >
                  {question}
                </label>
              </div>
              <span className="text-[11px] font-mono text-[#78736A] shrink-0 pt-0.5">
                {(answers[index] || "").length}/2000
              </span>
            </div>

            <textarea
              id={`question-${index}`}
              rows={3}
              maxLength={2000}
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={isLoading}
              placeholder="Your thoughts or answer (optional)..."
              className="w-full px-4 py-3 rounded-xl bg-[#171715] border border-white/10 text-[#F5F1E8] text-sm placeholder:text-[#78736A] focus:outline-none focus:border-[#D6A84F] focus:ring-1 focus:ring-[#D6A84F]/30 transition-colors resize-y min-h-[80px] disabled:opacity-60"
            />

            <p className="text-[11px] text-[#78736A] italic">
              Optional — skip if it doesn&apos;t apply.
            </p>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-[#1D1D1A] hover:bg-[#252522] text-[#F5F1E8] text-sm font-semibold border border-white/10 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#A9A49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-[#D6A84F] hover:bg-[#E0B65A] active:bg-[#C9963E] text-[#0D0D0C] font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0D0D0C]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Examining your reasoning...</span>
              </>
            ) : (
              <>
                <span>Continue to Analysis</span>
                <svg className="w-4 h-4 text-[#0D0D0C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
