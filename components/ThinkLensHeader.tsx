import React from "react";

export default function ThinkLensHeader() {
  return (
    <header className="w-full max-w-3xl mx-auto text-center space-y-6 pt-4 pb-6">
      {/* Title & Tagline */}
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
          ThinkLens
        </h1>
        <p className="text-lg sm:text-xl font-medium text-indigo-300 italic">
          &ldquo;See what your thinking might be missing.&rdquo;
        </p>
      </div>

      {/* Short Description */}
      <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
        An AI-powered critical-thinking assistant that helps you examine assumptions,
        overlooked factors, and reasoning gaps before making a decision.
      </p>

      {/* Persistent Core Principle Banner */}
      <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md max-w-xl mx-auto text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Core Principle
        </p>
        <p className="text-xs sm:text-sm font-medium text-amber-200/90">
          &ldquo;This tool does not make decisions for you. It helps you think more clearly.&rdquo;
        </p>
      </div>
    </header>
  );
}
