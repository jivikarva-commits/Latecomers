import React, { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <PublicShell>
      <SEO
        title="Contact Latecomers AI"
        description="Contact Latecomers AI for career guidance, institute partnerships, plan questions, and support for students and career switchers in India."
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 grid lg:grid-cols-[0.9fr_1.1fr] gap-5 sm:gap-8">
        <div>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Contact</p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2">Talk to Latecomers.</h1>
          <p className="text-muted2 mt-2 text-sm sm:text-base leading-relaxed">Questions about plans, institutes, partnerships, or career guidance? Send a message and we will get back to you.</p>
          <div className="mt-4 sm:mt-6 space-y-2.5 text-xs sm:text-sm">
            <p className="flex items-center gap-2.5 text-ink"><Mail className="text-brand" size={16} /> hello@latecomers.in</p>
            <p className="flex items-center gap-2.5 text-ink"><Phone className="text-brand" size={16} /> +91 90000 00000</p>
            <p className="flex items-center gap-2.5 text-ink"><MapPin className="text-brand" size={16} /> India</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="bg-white border border-line rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-soft"
        >
          <MessageCircle className="text-brand" size={22} />
          <div className="mt-3 sm:mt-4 grid sm:grid-cols-2 gap-2.5">
            <input required placeholder="Your name" className="bg-brand-50 border border-line rounded-lg px-3.5 py-2.5 text-xs sm:text-sm" />
            <input required type="email" placeholder="Email address" className="bg-brand-50 border border-line rounded-lg px-3.5 py-2.5 text-xs sm:text-sm" />
          </div>
          <input placeholder="Mobile number" className="mt-2.5 w-full bg-brand-50 border border-line rounded-lg px-3.5 py-2.5 text-xs sm:text-sm" />
          <textarea required rows={5} placeholder="How can we help?" className="mt-2.5 w-full bg-brand-50 border border-line rounded-lg px-3.5 py-2.5 text-xs sm:text-sm" />
          <button className="mt-3 w-full bg-brand text-white font-semibold px-4 py-2.5 rounded-full shadow-brand text-sm">Send message</button>
          {sent && <p className="mt-2.5 text-xs sm:text-sm font-semibold text-emerald-700">Message saved locally for now. Backend email can be connected later.</p>}
        </form>
      </main>
    </PublicShell>
  );
}
