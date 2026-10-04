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
    <nav aria-label="Progress step indicator" className="w-full max-w-xl mx-auto my-4 px-2">
      <ol className="flex items-center justify-between w-full relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-6 right-6 h-[1px] bg-white/10 -translate-y-1/2 z-0" />

        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <li
              key={step.number}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 border ${
                  isCompleted
                    ? "bg-[#D6A84F] border-[#D6A84F] text-[#0D0D0C]"
                    : isActive
                    ? "bg-[#171715] border-[#D6A84F] text-[#D6A84F] ring-4 ring-[#D6A84F]/10"
                    : "bg-[#171715] border-white/10 text-[#78736A]"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 text-[#0D0D0C]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  `0${step.number}`
                )}
              </div>
              <span
                className={`mt-2 text-xs tracking-wide text-center font-medium ${
                  isActive
                    ? "text-[#F3EBDD] font-semibold"
                    : isCompleted
                    ? "text-[#A9A49A]"
                    : "text-[#78736A]"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
