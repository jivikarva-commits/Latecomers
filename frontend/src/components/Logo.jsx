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
        style={{ width: compact ? "clamp(122px, 34vw, 158px)" : `clamp(${Math.max(size * 2.4, 126)}px, 18vw, 230px)` }}
      />
      {showTagline && (
        <span className="sr-only">Late but not lost</span>
      )}
    </div>
  );
}
