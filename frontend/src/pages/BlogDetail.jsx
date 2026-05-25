import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PublicShell from "../components/PublicShell";
import { BLOG_POSTS } from "./Blog";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((item) => item.slug === slug) || BLOG_POSTS[0];

  return (
    <PublicShell>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <ArrowLeft size={16} /> Back to blog
        </Link>
        <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase mt-8">Latecomers Guide</p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-ink mt-3 leading-tight">{post.title}</h1>
        <p className="text-lg text-muted2 mt-5 leading-relaxed">{post.excerpt}</p>
        <div className="mt-8 bg-white border border-line rounded-2xl p-6 space-y-4 text-muted2 leading-relaxed">
          <p>
            The fastest way forward is to stop asking whether you are late and start asking what your existing skills can become. Your work history, education, language ability, discipline, and interests are all useful signals.
          </p>
          <p>
            Latecomers turns those signals into career matches, then gives you a roadmap with skills, courses, projects, institutes, scholarships, and interview practice. The goal is simple: fewer random decisions, more clear next steps.
          </p>
          <p>
            Start with the career test, choose one direction, and use the roadmap to build momentum one week at a time.
          </p>
        </div>
      </article>
    </PublicShell>
  );
}
