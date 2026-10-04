import React, { useState, useEffect } from "react";
import { DecisionInput, INTERNSHIP_EXAMPLE } from "@/lib/types";

interface DecisionFormProps {
  initialData: DecisionInput;
  onSubmit: (data: DecisionInput) => void;
  isLoading: boolean;
  apiError: string | null;
  onClearError: () => void;
}

export default function DecisionForm({
  initialData,
  onSubmit,
  isLoading,
  apiError,
  onClearError,
}: DecisionFormProps) {
  const [formData, setFormData] = useState<DecisionInput>(initialData);
  const [validationErrors, setValidationErrors] = useState<{
    decision?: string;
    details?: string;
    reasoning?: string;
    options?: string;
  }>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific validation error on change
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) {
      onClearError();
    }
  };

  const handleLoadExample = () => {
    setFormData(INTERNSHIP_EXAMPLE);
    setValidationErrors({});
    if (apiError) {
      onClearError();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: {
      decision?: string;
      details?: string;
      reasoning?: string;
      options?: string;
    } = {};

    const decisionTrimmed = formData.decision.trim();
    const detailsTrimmed = formData.details.trim();
    const reasoningTrimmed = formData.reasoning.trim();
    const optionsTrimmed = formData.options.trim();

    if (!decisionTrimmed) {
      errors.decision = "Please enter the decision you're considering.";
    } else if (decisionTrimmed.length > 500) {
      errors.decision = "Decision must be 500 characters or fewer.";
    }

    if (optionsTrimmed.length > 1000) {
      errors.options = "Options must be 1000 characters or fewer.";
    }

    if (!detailsTrimmed) {
      errors.details = "Please add some relevant details.";
    } else if (detailsTrimmed.length > 5000) {
      errors.details = "Details must be 5000 characters or fewer.";
    }

    if (!reasoningTrimmed) {
      errors.reasoning = "Please explain why you're leaning this way.";
    } else if (reasoningTrimmed.length > 5000) {
      errors.reasoning = "Reasoning must be 5000 characters or fewer.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmit({
      decision: decisionTrimmed,
      options: optionsTrimmed,
      details: detailsTrimmed,
      reasoning: reasoningTrimmed,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto space-y-6 bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl"
    >
      {/* Top Header bar with Load Example */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Describe Your Decision</h2>
          <p className="text-xs text-slate-400">
            Provide details about the choice you are evaluating.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadExample}
          disabled={isLoading}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors disabled:opacity-50"
        >
          Load Example
        </button>
      </div>

      {/* Global API Error Alert */}
      {apiError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{apiError}</span>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-xs font-semibold text-red-400 underline hover:text-red-300 self-end sm:self-auto"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Field 1: Decision */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="decision" className="block text-sm font-semibold text-slate-200">
            What&apos;s the decision you&apos;re thinking about? <span className="text-indigo-400">*</span>
          </label>
          <span className="text-[11px] text-slate-500">{formData.decision.length}/500</span>
        </div>
        <input
          id="decision"
          name="decision"
          type="text"
          maxLength={500}
          value={formData.decision}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="e.g. Should I accept this internship?"
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            validationErrors.decision
              ? "border-red-500/80 focus:ring-red-500"
              : "border-slate-800 focus:border-indigo-500"
          } disabled:opacity-60`}
        />
        {validationErrors.decision && (
          <p className="text-xs text-red-400 mt-1">{validationErrors.decision}</p>
        )}
      </div>

      {/* Field 2: Options (Optional) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="options" className="block text-sm font-semibold text-slate-200">
            What are your options? <span className="text-xs font-normal text-slate-500">(Optional)</span>
          </label>
          <span className="text-[11px] text-slate-500">{formData.options.length}/1000</span>
        </div>
        <input
          id="options"
          name="options"
          type="text"
          maxLength={1000}
          value={formData.options}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="e.g. Accept, decline, negotiate"
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            validationErrors.options
              ? "border-red-500/80 focus:ring-red-500"
              : "border-slate-800 focus:border-indigo-500"
          } disabled:opacity-60`}
        />
        {validationErrors.options && (
          <p className="text-xs text-red-400 mt-1">{validationErrors.options}</p>
        )}
      </div>

      {/* Field 3: Relevant Details */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="details" className="block text-sm font-semibold text-slate-200">
            What details matter? <span className="text-indigo-400">*</span>
          </label>
          <span className="text-[11px] text-slate-500">{formData.details.length}/5000</span>
        </div>
        <textarea
          id="details"
          name="details"
          rows={4}
          maxLength={5000}
          value={formData.details}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Include constraints, circumstances, deadlines, people involved, risks, or anything else that matters."
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y min-h-[100px] ${
            validationErrors.details
              ? "border-red-500/80 focus:ring-red-500"
              : "border-slate-800 focus:border-indigo-500"
          } disabled:opacity-60`}
        />
        {validationErrors.details && (
          <p className="text-xs text-red-400 mt-1">{validationErrors.details}</p>
        )}
      </div>

      {/* Field 4: Why Leaning This Way */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="reasoning" className="block text-sm font-semibold text-slate-200">
            Why are you leaning this way? <span className="text-indigo-400">*</span>
          </label>
          <span className="text-[11px] text-slate-500">{formData.reasoning.length}/5000</span>
        </div>
        <textarea
          id="reasoning"
          name="reasoning"
          rows={3}
          maxLength={5000}
          value={formData.reasoning}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Tell ThinkLens what is currently driving your thinking."
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y min-h-[80px] ${
            validationErrors.reasoning
              ? "border-red-500/80 focus:ring-red-500"
              : "border-slate-800 focus:border-indigo-500"
          } disabled:opacity-60`}
        />
        {validationErrors.reasoning && (
          <p className="text-xs text-red-400 mt-1">{validationErrors.reasoning}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Finding blind spots...</span>
            </>
          ) : (
            <>
              <span>Find My Blind Spots</span>
              <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
