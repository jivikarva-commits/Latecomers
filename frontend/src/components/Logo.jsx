import React from "react";

export default function Logo({ size = 42, className = "", showTagline = false, compact = false }) {
  return (
    <div className={`flex flex-col items-start ${className}`} data-testid="cc-logo">
      <img
        src="/brand/latecomers-logo-cropped.png"
        alt="Latecomers AI - Late but not lost"
        loading="eager"
        decoding="async"
        className="h-auto w-auto object-contain"
        style={{ width: compact ? "clamp(128px, 36vw, 154px)" : "clamp(150px, 16vw, 210px)" }}
      />
      {showTagline && (
        <span className="-mt-1 ml-1 hidden sm:inline-block text-[9px] tracking-[0.23em] text-muted2 uppercase leading-none">
          Late but <span className="text-brand font-semibold normal-case tracking-normal">not</span> lost
        </span>
      )}
    </div>
  );
}
