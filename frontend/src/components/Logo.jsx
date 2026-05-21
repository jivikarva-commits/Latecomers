import React from "react";

export default function Logo({ size = 36, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="cc-logo">
      <div
        className="cc-logo-gradient rounded-full flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
          <path d="M12 7l2 5-5 2 3-7z" fill="white" />
        </svg>
      </div>
      <span className="font-heading font-extrabold text-ink text-base sm:text-lg md:text-xl tracking-tight whitespace-nowrap">
        LATE COMERS <span className="text-brand">AI</span>
      </span>
    </div>
  );
}
