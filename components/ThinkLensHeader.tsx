import React from "react";

export default function ThinkLensHeader() {
  return (
    <header className="w-full max-w-3xl mx-auto text-center space-y-4 pt-4 pb-2">
      {/* Brand Label */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171715] border border-[#D6A84F]/30 text-[#D6A84F] text-[11px] font-mono uppercase tracking-widest font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D6A84F] animate-pulse"></span>
        ThinkLens
      </div>

      {/* Main Title & Tagline */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F1E8] leading-tight">
          See what your thinking <br className="hidden sm:inline" />
          <span className="text-[#D6A84F]">might be missing.</span>
        </h1>
        <p className="text-sm sm:text-base text-[#A9A49A] max-w-xl mx-auto leading-relaxed pt-1">
          ThinkLens helps you examine the assumptions, trade-offs, and patterns behind a decision — without making the decision for you.
        </p>
      </div>

      {/* Persistent Core Principle Banner */}
      <div className="pt-2">
        <div className="p-3.5 rounded-xl bg-[#171715]/80 border border-white/10 max-w-xl mx-auto text-center shadow-sm">
          <p className="text-[10px] font-mono font-bold text-[#D6A84F] uppercase tracking-widest mb-0.5">
            CORE PRINCIPLE
          </p>
          <p className="text-xs sm:text-sm font-medium text-[#F3EBDD]/90">
            &ldquo;This tool does not make decisions for you. It helps you think more clearly.&rdquo;
          </p>
        </div>
      </div>
    </header>
  );
}
