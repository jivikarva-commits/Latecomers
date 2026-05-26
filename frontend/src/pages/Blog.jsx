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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <section className="grid lg:grid-cols-[0.92fr_1.08fr] gap-5 sm:gap-8 lg:items-end">
          <div>
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">Latecomers Blog</p>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink mt-2 leading-tight">
              Practical career advice for people starting again.
            </h1>
            <p className="text-muted2 mt-2 text-sm sm:text-base leading-relaxed">
              Honest, India-focused guides for BPO workers, confused graduates, career switchers, and late starters.
            </p>
          </div>
          <div className="bg-white border border-line rounded-xl p-3 shadow-soft flex items-center gap-2.5">
            <Search className="text-brand shrink-0" size={16} />
            <p className="text-xs sm:text-sm text-muted2">Guides on BPO careers, AI skills, digital marketing, remote jobs, and more.</p>
          </div>
        </section>

        <Link to={`/blog/${featured.slug}`} className="mt-6 sm:mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-0 bg-white rounded-2xl sm:rounded-3xl border border-line overflow-hidden shadow-soft hover:shadow-brand transition group">
          <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-brand-50">
            <img src={featured.image} alt={featured.title} loading="eager" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
          </div>
          <div className="p-4 sm:p-6 flex flex-col justify-center">
            <p className="text-[10px] sm:text-xs font-bold text-brand uppercase tracking-wider">{featured.category} · {featured.readTime}</p>
            <h2 className="font-heading font-extrabold text-lg sm:text-2xl text-ink mt-2 leading-tight">{featured.title}</h2>
            <p className="text-sm text-muted2 mt-2 leading-relaxed line-clamp-3">{featured.excerpt}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-brand font-bold text-sm">
              Read guide <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        <section className="mt-6 sm:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="bg-white border border-line rounded-xl sm:rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-brand transition group">
              <div className="aspect-[16/10] overflow-hidden bg-brand-50">
                <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500" />
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-[10px] font-bold text-brand uppercase tracking-wider">{post.category} · {post.readTime}</p>
                <h2 className="font-heading font-bold text-xs sm:text-sm text-ink mt-1.5 leading-tight line-clamp-2">{post.title}</h2>
                <p className="text-[10px] sm:text-xs text-muted2 mt-1.5 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-brand font-semibold text-[11px] sm:text-xs">
                  Read <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
