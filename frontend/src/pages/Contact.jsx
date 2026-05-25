import React, { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PublicShell from "../components/PublicShell";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <PublicShell>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
        <div>
          <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">Contact</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-ink mt-3">Talk to Latecomers.</h1>
          <p className="text-muted2 mt-4 text-lg leading-relaxed">Questions about plans, institutes, partnerships, or career guidance? Send a message and we will get back to you.</p>
          <div className="mt-8 space-y-3 text-sm">
            <p className="flex items-center gap-3 text-ink"><Mail className="text-brand" size={18} /> hello@latecomers.in</p>
            <p className="flex items-center gap-3 text-ink"><Phone className="text-brand" size={18} /> +91 90000 00000</p>
            <p className="flex items-center gap-3 text-ink"><MapPin className="text-brand" size={18} /> India</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="bg-white border border-line rounded-3xl p-5 sm:p-7 shadow-soft"
        >
          <MessageCircle className="text-brand" size={28} />
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <input required placeholder="Your name" className="bg-brand-50 border border-line rounded-xl px-4 py-3 text-sm" />
            <input required type="email" placeholder="Email address" className="bg-brand-50 border border-line rounded-xl px-4 py-3 text-sm" />
          </div>
          <input placeholder="Mobile number" className="mt-3 w-full bg-brand-50 border border-line rounded-xl px-4 py-3 text-sm" />
          <textarea required rows={6} placeholder="How can we help?" className="mt-3 w-full bg-brand-50 border border-line rounded-xl px-4 py-3 text-sm" />
          <button className="mt-4 w-full bg-brand text-white font-semibold px-5 py-3 rounded-full shadow-brand">Send message</button>
          {sent && <p className="mt-3 text-sm font-semibold text-emerald-700">Message saved locally for now. Backend email can be connected later.</p>}
        </form>
      </main>
    </PublicShell>
  );
}
