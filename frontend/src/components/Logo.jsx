import React from "react";

export default function Logo({ size = 42, className = "", showTagline = false, compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} data-testid="cc-logo">
      <img
        src="/brand/latecomers-logo.png"
        alt="Latecomers AI - Late but not lost"
        loading="eager"
        decoding="async"
        className="h-auto w-auto object-contain max-h-10 sm:max-h-14"
        style={{ maxWidth: compact ? 140 : 200 }}
      />
      {showTagline && (
        <span className="hidden sm:inline-block text-[10px] tracking-[0.24em] text-muted2 uppercase leading-none">
          Late but <span className="text-brand font-semibold normal-case tracking-normal">not</span> lost
        </span>
      )}
    </div>
  );
}
