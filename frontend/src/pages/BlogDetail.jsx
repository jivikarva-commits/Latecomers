import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import PublicShell from "../components/PublicShell";
import SEO from "../components/SEO";
import { BLOG_POSTS, getBlogPost } from "../data/blogPosts";
import { articleSchema, breadcrumbSchema } from "../lib/seoSchemas";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = getBlogPost(slug) || BLOG_POSTS[0];
  const related = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <PublicShell>
      <SEO
        title={`${post.title} | Latecomers AI Blog`}
        description={post.excerpt}
        image={post.image}
        type="article"
        path={`/blog/${post.slug}`}
        jsonLd={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-14">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand">
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <header className="mt-4 sm:mt-6">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-brand uppercase">{post.category} · {post.readTime}</p>
          <h1 className="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl text-ink mt-2 leading-tight">{post.title}</h1>
          <p className="text-xs sm:text-base text-muted2 mt-2 sm:mt-3 leading-relaxed">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-line text-[10px] sm:text-xs font-semibold text-muted2">
                {keyword}
              </span>
            ))}
          </div>
        </header>

        <figure className="mt-5 sm:mt-6 overflow-hidden rounded-xl sm:rounded-2xl border border-line bg-brand-50 shadow-soft">
          <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover" loading="eager" decoding="async" />
        </figure>

        <div className="mt-5 sm:mt-6 bg-white border border-line rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-soft">
          <div className="prose-content space-y-5 sm:space-y-6">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heading font-extrabold text-base sm:text-xl text-ink leading-tight">{section.heading}</h2>
                <div className="mt-2.5 space-y-2.5">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-muted2 leading-relaxed text-xs sm:text-sm">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2 rounded-xl bg-brand-50 border border-line p-2.5 text-xs sm:text-sm font-semibold text-ink">
                        <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <section>
              <h2 className="font-heading font-extrabold text-base sm:text-xl text-ink leading-tight">Practical action plan</h2>
              <div className="mt-2.5 space-y-2.5">
                <p className="text-muted2 leading-relaxed text-xs sm:text-sm">
                  Start by writing your current situation honestly: education, work experience, salary expectation, family constraints, city preference, language comfort, and available weekly study time. This removes guesswork. A person who can study two hours a day needs a different plan from someone who can study only on Sundays.
                </p>
                <p className="text-muted2 leading-relaxed text-xs sm:text-sm">
                  Next, choose one target role and collect five job descriptions from LinkedIn, Naukri, company career pages, or local hiring groups. Highlight repeated skills. Those repeated skills become your syllabus. This is much better than trusting a random course curriculum blindly.
                </p>
                <p className="text-muted2 leading-relaxed text-xs sm:text-sm">
                  Then build proof. For a tech role, create a working project. For analytics, create a dashboard and insight report. For marketing, create a campaign audit. For customer success or operations, create a case study showing process thinking. Proof makes your switch believable.
                </p>
              </div>
            </section>
            <section>
              <h2 className="font-heading font-extrabold text-base sm:text-xl text-ink leading-tight">Common mistakes to avoid</h2>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                {[
                  "Buying courses before choosing a role",
                  "Hiding past experience instead of reframing it",
                  "Applying with the same resume everywhere",
                  "Waiting for confidence before building proof",
                  "Ignoring communication and interview practice",
                  "Comparing your timeline with freshers",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 rounded-xl bg-brand-50 border border-line p-2.5 text-xs sm:text-sm font-semibold text-ink">
                    <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted2 leading-relaxed text-xs sm:text-sm mt-3">
                The best career move is usually not the most glamorous one. It is the one you can start, prove, and sustain. Latecomers AI is designed to help you choose that path with less shame and more structure.
              </p>
            </section>
          </div>

          <div className="mt-6 sm:mt-8 premium-gradient rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-white">
            <p className="font-heading font-extrabold text-base sm:text-xl">Find your best-fit career path</p>
            <p className="mt-1.5 text-white/82 text-xs sm:text-sm leading-relaxed">
              Take the Latecomers AI quiz and get a practical roadmap based on your background, interests, work style, and goals.
            </p>
            <Link to="/pricing" className="mt-3 inline-flex items-center gap-1.5 bg-white text-ink font-bold px-4 py-2.5 rounded-full text-xs sm:text-sm">
              Start with ₹9 plan <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <aside className="mt-6 sm:mt-8">
          <h2 className="font-heading font-bold text-base sm:text-xl text-ink">Read next</h2>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {related.map((item) => (
              <Link key={item.slug} to={`/blog/${item.slug}`} className="bg-white border border-line rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-soft transition">
                <img src={item.image} alt={item.title} className="w-full aspect-[16/10] object-cover" loading="lazy" decoding="async" />
                <div className="p-2.5 sm:p-3">
                  <p className="text-[10px] font-bold text-brand uppercase">{item.category}</p>
                  <p className="font-heading font-bold text-xs sm:text-sm text-ink mt-1 leading-tight line-clamp-2">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </article>
    </PublicShell>
  );
}
