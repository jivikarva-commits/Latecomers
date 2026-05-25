import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PublicShell from "../components/PublicShell";

export const BLOG_POSTS = [
  {
    slug: "switch-from-bpo-to-growth-careers",
    title: "How BPO experience can become a growth career",
    excerpt: "Communication, patience, CRM discipline, and shift resilience can translate into sales, customer success, operations, and analytics roles.",
  },
  {
    slug: "career-roadmap-after-degree",
    title: "What to do when you have a degree but no direction",
    excerpt: "A practical way to choose your next path without wasting months comparing random courses.",
  },
  {
    slug: "late-career-switch-confidence",
    title: "Restarting at 30 or 35 is not the end",
    excerpt: "Your previous experience can reduce risk if you choose a career path that uses the skills you already built.",
  },
];

export default function Blog() {
  return (
    <PublicShell>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">Blog</p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-ink mt-3">Career clarity, written simply.</h1>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="bg-white border border-line rounded-2xl p-5 hover:shadow-soft transition">
              <p className="text-xs font-bold text-brand uppercase tracking-wider">Guide</p>
              <h2 className="font-heading font-bold text-xl text-ink mt-3">{post.title}</h2>
              <p className="text-sm text-muted2 mt-3 leading-relaxed">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-brand font-semibold text-sm">Read article <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
