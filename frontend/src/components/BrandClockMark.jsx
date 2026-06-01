import React from "react";

export default function BrandClockMark({ size = 24, animated = false, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`latecomers-clock-mark ${animated ? "is-animated" : ""} ${className}`}
    >
      <g className="clock-ring">
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="5" />
        <path d="M32 5V13" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M32 51V59" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M5 32H13" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M51 32H59" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="clock-needle">
        <path d="M41.5 20.5L35.8 36.5L20.5 43.5L28 28L41.5 20.5Z" fill="currentColor" />
        <circle cx="32" cy="32" r="4.2" fill="white" />
      </g>
    </svg>
  );
}
