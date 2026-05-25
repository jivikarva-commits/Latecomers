import React from "react";

export default function Logo({ size = 42, className = "", showTagline = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} data-testid="cc-logo">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-0 latecomers-mark flex items-center justify-center">
          <span className="font-heading font-black text-white leading-none" style={{ fontSize: size * 0.72 }}>
            L
          </span>
        </div>
      </div>
      <div className="min-w-0">
        <span className="font-heading font-extrabold text-ink text-xl sm:text-2xl tracking-normal whitespace-nowrap leading-none">
          Latec<span className="text-brand">o</span>mers
        </span>
        {showTagline && (
          <p className="text-[10px] sm:text-xs tracking-[0.26em] text-muted2 uppercase leading-none mt-1">
            Late But <span className="text-brand font-semibold normal-case tracking-normal">not</span> Lost.
          </p>
        )}
      </div>
    </div>
  );
}
