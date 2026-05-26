import React from "react";

export default function Logo({ size = 42, className = "", showTagline = false, compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} data-testid="cc-logo">
      <img
        src="/brand/latecomers-logo.png"
        alt="Latecomers AI - Late but not lost"
        loading="eager"
        decoding="async"
        className="h-auto w-auto object-contain max-h-12 sm:max-h-[4.5rem]"
        style={{ maxWidth: compact ? 160 : 260 }}
      />
      {showTagline && (
        <span className="hidden sm:inline-block text-[10px] tracking-[0.24em] text-muted2 uppercase leading-none">
          Late but <span className="text-brand font-semibold normal-case tracking-normal">not</span> lost
        </span>
      )}
    </div>
  );
}
