import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Describe Decision" },
    { number: 2, label: "Clarify Thinking" },
    { number: 3, label: "Blind-Spot Analysis" },
  ];

  return (
    <nav aria-label="Progress step indicator" className="w-full max-w-2xl mx-auto my-4 px-2">
      <ol className="flex items-center justify-between w-full relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
        
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLocked = step.number === 3 && currentStep < 3;

          return (
            <li
              key={step.number}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2 ${
                  isCompleted
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : isActive
                    ? "bg-indigo-950 border-indigo-400 text-indigo-300 ring-4 ring-indigo-500/10"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium tracking-wide text-center ${
                  isActive
                    ? "text-indigo-300 font-semibold"
                    : isCompleted
                    ? "text-slate-300"
                    : "text-slate-500"
                } ${isLocked ? "opacity-60" : ""}`}
              >
                {step.label} {isLocked && <span className="text-[10px] text-slate-600">(Stage 5)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
