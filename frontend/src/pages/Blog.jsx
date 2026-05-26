import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";
import { BLOG_POSTS } from "../data/blogPosts";

export default function Blog() {
  const featured = BLOG_POSTS[0];
  const posts = BLOG_POSTS.slice(1);

  return (
    <PublicShell>
      <SEO
        title="Career Blog for BPO Workers, Graduates and Career Switchers"
        description="Read practical India-focused career guides on BPO career switches, skills for 2026, tech jobs, digital marketing, AI careers, remote jobs, and upskilling."
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <section className="grid lg:grid-cols-[0.92fr_1.08fr] gap-8 lg:gap-12 items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.28em] text-brand uppercase">Latecomers Blog</p>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-ink mt-3 leading-tight">
              Practical career advice for people starting again.
            </h1>
            <p className="text-muted2 mt-4 text-base sm:text-lg leading-relaxed">
              Honest, India-focused guides for BPO workers, confused graduates, career switchers, and late starters who need direction, not generic motivation.
            </p>
          </div>
          <div className="bg-white border border-line rounded-2xl p-3 shadow-soft flex items-center gap-3">
            <Search className="text-brand shrink-0" size={18} />
            <p className="text-sm text-muted2">SEO guides on BPO careers, AI skills, digital marketing, remote jobs, and first tech roles.</p>
          </div>
        </section>

        <Link to={`/blog/${featured.slug}`} className="mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-0 bg-white rounded-3xl border border-line overflow-hidden shadow-soft hover:shadow-brand transition group">
          <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-brand-50">
            <img
              src={featured.image}
              alt={featured.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
            />
          </div>
          <div className="p-5 sm:p-8 flex flex-col justify-center">
            <p className="text-xs font-bold text-brand uppercase tracking-wider">{featured.category} · {featured.readTime}</p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-3 leading-tight">{featured.title}</h2>
            <p className="text-muted2 mt-4 leading-relaxed">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-brand font-bold">
              Read featured guide <ArrowRight size={16} />
            </span>
          </div>
        </Link>

        <section className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="bg-white border border-line rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-brand transition group">
              <div className="aspect-[16/10] overflow-hidden bg-brand-50">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold text-brand uppercase tracking-wider">{post.category} · {post.readTime}</p>
                <h2 className="font-heading font-bold text-xl text-ink mt-3 leading-tight">{post.title}</h2>
                <p className="text-sm text-muted2 mt-3 leading-relaxed">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-brand font-semibold text-sm">
                  Read article <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
