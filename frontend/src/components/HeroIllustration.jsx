import React from "react";
import { Sparkles } from "lucide-react";

export default function HeroIllustration({
  Icon,
  gradient = "from-brand-300 to-brand-600",
  ringColor = "#7C72EF",
  size = 120,
  className = "",
}) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }} data-testid="hero-illustration">
      <Sparkles size={14} className="absolute -top-2 -left-1 text-brand-300 float-soft" />
      <Sparkles size={10} className="absolute top-2 right-3 text-brand-200 float-soft" />
      <Sparkles size={12} className="absolute -bottom-1 -right-2 text-brand-300 float-soft" />

      <div
        className="absolute inset-0 rounded-full blur-[1px]"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${ringColor}40, transparent 68%)`,
        }}
      />

      <div
        className="absolute inset-1 rounded-full"
        style={{
          background: `radial-gradient(circle at 24% 22%, rgba(255,255,255,0.65), rgba(255,255,255,0) 45%)`,
        }}
      />

      <div
        className={`absolute inset-3 rounded-full bg-gradient-to-br ${gradient} shadow-brand flex items-center justify-center text-white brand-orb float-soft`}
      >
        <Icon size={size * 0.42} strokeWidth={1.8} />
      </div>

      <div
        className="absolute rounded-full bg-white/45 blur-sm"
        style={{
          top: "12%", left: "18%", width: size * 0.28, height: size * 0.16,
          transform: "rotate(-25deg)",
        }}
      />

      <div
        className="absolute rounded-full border border-white/50"
        style={{
          right: "10%",
          bottom: "10%",
          width: size * 0.16,
          height: size * 0.16,
          background: "rgba(255,255,255,0.22)",
        }}
      />
    </div>
  );
}
