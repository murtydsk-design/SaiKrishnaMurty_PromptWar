import React, { useState } from "react";

interface ClarifyingQuestionsProps {
  questions: string[];
  initialAnswers: string[];
  onBack: () => void;
  onContinue: (answers: string[]) => void;
}

export default function ClarifyingQuestions({
  questions,
  initialAnswers,
  onBack,
  onContinue,
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

    // Validate length limit (max 2000 chars each)
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
    <div className="w-full max-w-3xl mx-auto space-y-6 bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
      {/* Header section */}
      <div className="space-y-1.5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
          <h2 className="text-xl font-bold text-slate-100">Let&apos;s examine your thinking</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          These questions are designed specifically around your decision. Answer what you can — you can also skip any question.
        </p>
      </div>

      {validationError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          {validationError}
        </div>
      )}

      {/* Form with Questions */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="space-y-2 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800/80"
          >
            <div className="flex items-start justify-between gap-3">
              <label
                htmlFor={`question-${index}`}
                className="text-sm font-semibold text-indigo-200 leading-snug"
              >
                <span className="text-indigo-400 mr-1.5">{index + 1}.</span>
                {question}
              </label>
              <span className="text-[11px] text-slate-500 shrink-0">
                {(answers[index] || "").length}/2000
              </span>
            </div>

            <textarea
              id={`question-${index}`}
              rows={3}
              maxLength={2000}
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Your thoughts or answer (optional)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y min-h-[70px]"
            />

            <p className="text-[11px] text-slate-500 italic">
              Optional — skip if it doesn&apos;t apply.
            </p>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
          >
            <span>Continue to Analysis</span>
            <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
