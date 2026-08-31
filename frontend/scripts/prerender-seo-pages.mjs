import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const buildDir = path.join(frontendDir, "build");
const baseUrl = "https://www.latecomers.in";
// og:image must be the 1200x630 branded share card; the SERP/Knowledge-Panel
// logo must be a near-square image. These are different assets on purpose.
const shareImage = `${baseUrl}/brand/og-share.png`;
const squareLogo = `${baseUrl}/brand/latecomers-logo-512.png`;
const defaultImage = shareImage;
const publicSeo = JSON.parse(await readFile(path.join(frontendDir, "src/data/publicSeo.json"), "utf8"));

// This is the Organization schema Googlebot actually reads (prerendered HTML).
// Must match the client-side organizationSchema() in src/lib/seoSchemas.js:
// square logo as an ImageObject + sameAs so Google can confirm the brand entity
// and display the logo instead of a generic globe.
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  name: "Latecomers AI",
  alternateName: ["Latecomers", "Latecomers.in"],
  url: baseUrl,
  logo: {
    "@type": "ImageObject",
    "@id": `${baseUrl}/#logo`,
    url: squareLogo,
    contentUrl: squareLogo,
    width: 512,
    height: 512,
    caption: "Latecomers AI",
  },
  image: { "@id": `${baseUrl}/#logo` },
  description:
    "AI-powered career guidance for late starters, BPO workers, confused graduates, and career switchers in India.",
  foundingDate: "2025",
  founder: {
    "@type": "Person",
    name: "Gokul Karvande",
    jobTitle: "Founder & AI/ML Developer",
  },
  areaServed: { "@type": "Country", name: "India" },
  sameAs: [
    "https://www.linkedin.com/company/latecomers-ai",
    "https://x.com/latecomersai",
    "https://www.instagram.com/latecomers.ai",
    "https://www.youtube.com/@latecomersai",
  ],
};

const routes = [
  {
    path: "/",
    title: publicSeo.home.title,
    description: publicSeo.home.description,
    type: "website",
    h1: publicSeo.home.h1,
    body: `${publicSeo.home.intro} ${publicSeo.home.offer}`,
    schema: [
      orgSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Latecomers AI",
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/careers-explore?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },
  {
    path: "/about",
    title: "About Latecomers AI - Late but not lost",
    description:
      "Learn why Latecomers AI exists for BPO workers, confused graduates, late starters, students, and career switchers who need practical career direction.",
    type: "website",
    h1: "Career guidance for people who are starting again.",
    body:
      "Latecomers AI helps people turn career confusion, gaps, and real work experience into practical next steps.",
    breadcrumb: ["Home", "About"],
  },
  {
    path: "/careers-explore",
    title: "Explore Career Paths in India | Latecomers AI",
    description:
      "Explore practical career paths, course options, skills, salary ranges, and roadmaps for Indian students and career switchers.",
    type: "website",
    h1: "Explore practical career paths.",
    body:
      "Browse career options across technology, design, marketing, finance, government exams, healthcare, aviation, hospitality, and vocational skills.",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Career paths on Latecomers AI",
        itemListElement: ["Technology", "Design", "Digital Marketing", "Finance", "Government Exams"].map(
          (name, index) => ({ "@type": "ListItem", position: index + 1, name })
        ),
      },
    ],
  },
  {
    path: "/pricing",
    title: publicSeo.pricing.title,
    description: publicSeo.pricing.description,
    type: "website",
    h1: publicSeo.pricing.h1,
    body: publicSeo.pricing.intro,
  },
  {
    path: "/blog",
    title: "Latecomers AI Blog - Career guides for India",
    description:
      "Read practical career guides for BPO workers, graduates, career switchers, students, and beginners in India.",
    type: "website",
    h1: "Career guides for people building their next step.",
    body:
      "Explore practical advice on career switching, skill building, first jobs, remote work, digital marketing, AI careers, and commerce careers.",
  },
  {
    path: "/for-institutes",
    title: "For Institutes | Latecomers AI",
    description:
      "Partner with Latecomers AI to reach students and career switchers who need practical courses, counseling, and placement-ready roadmaps.",
    type: "website",
    h1: "Help the right students find your institute.",
    body:
      "Latecomers AI connects institutes with learners looking for practical courses, career direction, and local training options.",
  },
  {
    path: "/contact",
    title: "Contact Latecomers AI",
    description:
      "Contact Latecomers AI for support, institute partnerships, career guidance queries, and business enquiries.",
    type: "website",
    h1: "Contact Latecomers AI.",
    body:
      "Reach the Latecomers AI team for help with career guidance, plans, institute partnerships, and product support.",
  },
  {
    path: "/masterclasses",
    title: "Masterclasses & Workshops in India | Latecomers AI",
    description:
      "Discover upcoming masterclasses, webinars, and skill workshops from institutes across India. Institutes can list their masterclass for free on Latecomers AI.",
    type: "website",
    h1: "Upcoming masterclasses & workshops in India",
    body:
      "Browse free and paid masterclasses, webinars, and skill workshops from institutes across India. Are you an institute or trainer? List your masterclass for free and reach motivated learners across India.",
  },
];

// Parse ALL blog posts from src/data/blogPosts.js (single source of truth) so
// every post gets prerendered with its FULL content — not a hardcoded subset.
// The BLOG_POSTS array is pure data literals, safe to evaluate at build time.
const blogSrc = await readFile(path.join(frontendDir, "src/data/blogPosts.js"), "utf8");
const blogMatch = blogSrc.match(/export const BLOG_POSTS\s*=\s*(\[[\s\S]*?\]);\s*\n+export function/);
const blogPosts = blogMatch ? new Function("return " + blogMatch[1])() : [];

for (const post of blogPosts) {
  const published = post.publishedAt || "2025-09-01";
  const updated = post.updatedAt || published;
  const bodyHtml = [
    `<h1>${escapeHtml(post.title)}</h1>`,
    post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : "",
    post.quickAnswer ? `<section aria-label="Quick answer"><h2>Quick answer</h2><p>${escapeHtml(post.quickAnswer)}</p></section>` : "",
    ...(post.sections || []).map((s) => [
      `<h2>${escapeHtml(s.heading)}</h2>`,
      (s.body || []).map((p) => `<p>${escapeHtml(p)}</p>`).join(""),
      s.bullets ? `<ul>${s.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : "",
      s.links ? `<ul>${s.links.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`).join("")}</ul>` : "",
    ].join("")),
    (post.faqs || []).length
      ? `<section aria-label="Frequently asked questions"><h2>Frequently asked questions</h2>${post.faqs
          .map((f) => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`)
          .join("")}</section>`
      : "",
    `<p>By <strong>Gokul Karvande</strong>, Founder of Latecomers AI · Published ${published}${updated !== published ? ` · Updated ${updated}` : ""}</p>`,
    `<p><a href="/careers-explore">Explore careers</a> · <a href="/pricing">Quiz results and roadmaps from Rs 9</a> · <a href="/career-guidance-india">Career guidance</a></p>`,
    `<h2>About the author</h2><p>Gokul Karvande is the founder of Latecomers AI and a 21-year-old AI specialist and software &amp; AI/ML developer. He builds AI-powered career guidance to help students, graduates, and late starters across India find a practical path. <a href="/blog/story-behind-latecomers-ai">Read his story</a>.</p>`,
  ].join("");

  // The excerpt is written for the blog listing card; seoDescription, where a post
  // has one, is written for the SERP snippet. Prefer it in both places.
  const metaDescription = post.seoDescription || post.excerpt || "";

  routes.push({
    path: `/blog/${post.slug}`,
    title: post.seoTitle ? `${post.seoTitle} | Latecomers AI` : `${post.title} | Latecomers AI Blog`,
    description: metaDescription,
    type: "article",
    bodyHtml,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: metaDescription,
        image: post.image ? `${baseUrl}${post.image}` : squareLogo,
        url: `${baseUrl}/blog/${post.slug}`,
        datePublished: published,
        dateModified: updated,
        inLanguage: "en-IN",
        articleSection: post.category,
        author: {
          "@type": "Person",
          "@id": `${baseUrl}/#founder`,
          name: "Gokul Karvande",
          jobTitle: "Founder & AI/ML Developer",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "Latecomers AI",
          logo: { "@type": "ImageObject", url: squareLogo },
        },
        keywords: Array.isArray(post.keywords) ? post.keywords.join(", ") : post.keywords,
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${baseUrl}/#founder`,
        name: "Gokul Karvande",
        jobTitle: "Founder & AI/ML Developer",
        description:
          "Gokul Karvande is the founder of Latecomers AI, a 21-year-old AI specialist and software & AI/ML developer building AI-powered career guidance for students and late starters in India.",
        worksFor: { "@id": `${baseUrl}/#organization` },
        knowsAbout: ["Career Guidance", "Artificial Intelligence", "Machine Learning", "Software Development", "EdTech"],
        nationality: "Indian",
        url: baseUrl,
      },
      ...((post.faqs || []).length
        ? [{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }]
        : []),
    ],
    breadcrumb: ["Home", "Blog", post.title],
  });
}

// ---- SEO landing pages (keyword pages, /<slug>) ----
const landingPages = JSON.parse(
  await readFile(path.join(frontendDir, "src/data/landingPages.json"), "utf8")
);

for (const lp of landingPages) {
  const bodyHtml = [
    `<h1>${escapeHtml(lp.h1)}</h1>`,
    `<p>${escapeHtml(lp.intro)}</p>`,
    lp.offerNote ? `<p>${escapeHtml(lp.offerNote)} <a href="/pricing">Compare plans</a></p>` : "",
    ...lp.sections.map((s) => [
      `<h2>${escapeHtml(s.heading)}</h2>`,
      s.body.map((p) => `<p>${escapeHtml(p)}</p>`).join(""),
      s.bullets ? `<ul>${s.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : "",
    ].join("")),
    `<h2>Frequently asked questions</h2>${lp.faqs.map((f) => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`).join("")}`,
    `<p><a href="/pricing">Quiz results and roadmaps from Rs 9</a> · <a href="/careers-explore">Explore careers</a> · <a href="/career-guide/data-analyst-india">Career guides</a> · <a href="/pricing">Pricing</a></p>`,
  ].join("");

  routes.push({
    path: `/${lp.slug}`,
    title: lp.metaTitle,
    description: lp.metaDescription,
    type: "website",
    bodyHtml,
    breadcrumb: ["Home", lp.eyebrow],
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: lp.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  });
}

// ---- Career guide pages (programmatic SEO, /career-guide/<slug>) ----
// Read the JSON sibling (gen-career-guides.mjs emits it) to avoid ESM/CJS interop.
const careerGuides = JSON.parse(
  await readFile(path.join(frontendDir, "src/data/careerGuides.json"), "utf8")
);

for (const g of careerGuides) {
  const sal = `Rs ${g.salaryMin}-${g.salaryMax} LPA`;
  const title = `${g.title} Career in India 2026 — Salary, Roadmap & Skills`;
  const description = `How to become a ${g.title} in India. Salary: ${sal}. Timeline: ${g.timeline}. ${g.degreeNeeded ? "Exam/degree path explained." : "No degree needed."} Free roadmap on Latecomers AI.`;
  const faqs = [
    [`How long does it take to become a ${g.title} in India?`, `Most people become job-ready as a ${g.title} in about ${g.timeline} with consistent effort.`],
    [`What salary does a ${g.title} earn in India?`, `A ${g.title} in India typically earns ${sal} per year, starting around ${g.freshersSalary} for freshers.`],
    [`Can I become a ${g.title} without a degree in India?`, g.degreeNeeded ? `${g.title} usually needs a relevant degree or qualifying exam, but preparation matters most.` : `Yes. No specific degree is needed — skills like ${g.topSkills.slice(0, 3).join(", ")} and a portfolio matter more.`],
    [`What skills do I need to become a ${g.title}?`, `The core skills are ${g.topSkills.join(", ")}, all learnable online in about ${g.timeline}.`],
    [`Which courses are best for ${g.title} in India?`, `Good starting courses include ${g.courses.map((c) => `${c.name} (${c.provider})`).join(", ")}.`],
  ];
  const salINR = (v) => Math.round(v * 100000);
  const bodyHtml = [
    `<h1>${escapeHtml(g.title)} Career Path in India</h1>`,
    `<p>${escapeHtml(g.intro)}</p>`,
    `<h2>${escapeHtml(g.title)} Salary in India</h2>`,
    `<p>Freshers: ${escapeHtml(g.freshersSalary)}. Average range: ${escapeHtml(sal)}. Market demand: ${escapeHtml(g.growth)}. Time to job-ready: ${escapeHtml(g.timeline)}.</p>`,
    `<h2>Skills required</h2><ul>${g.topSkills.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`,
    `<h2>How to become a ${escapeHtml(g.title)} — step by step</h2><ol>${g.roadmap.map((r) => `<li><strong>${escapeHtml(r.phase)}:</strong> ${escapeHtml(r.focus)}</li>`).join("")}</ol>`,
    `<h2>Best courses</h2><ul>${g.courses.map((c) => `<li>${escapeHtml(c.name)} — ${escapeHtml(c.provider)}${c.free ? " (free)" : ""}</li>`).join("")}</ul>`,
    `<h2>Jobs you can apply for</h2><ul>${g.jobTitles.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`,
    `<h2>Frequently asked questions</h2>${faqs.map(([q, a]) => `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`).join("")}`,
    `<h2>Related careers</h2><ul>${(g.related || []).map((rs) => { const rg = careerGuides.find((x) => x.slug === rs); return rg ? `<li><a href="/career-guide/${rg.slug}">${escapeHtml(rg.title)} career in India</a></li>` : ""; }).join("")}</ul>`,
    `<p><a href="/pricing">Quiz results and roadmaps from Rs 9</a> · <a href="/careers-explore">Explore more careers</a></p>`,
  ].join("");

  routes.push({
    path: `/career-guide/${g.slug}`,
    title,
    description,
    type: "website",
    bodyHtml,
    breadcrumb: ["Home", "Careers", g.title],
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Occupation",
        name: `${g.title} (India)`,
        description: g.intro,
        occupationLocation: { "@type": "Country", name: "India" },
        estimatedSalary: {
          "@type": "MonetaryAmountDistribution",
          name: "base",
          currency: "INR",
          duration: "P1Y",
          median: salINR((g.salaryMin + g.salaryMax) / 2),
          percentile10: salINR(g.salaryMin),
          percentile90: salINR(g.salaryMax),
        },
        skills: g.topSkills.join(", "),
        educationRequirements: g.degreeNeeded
          ? "A relevant degree or qualifying exam is typically required."
          : "No specific degree required; skills and portfolio matter most.",
        experienceRequirements: "Entry level — suitable for freshers and career switchers.",
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to become a ${g.title} in India`,
        step: g.roadmap.map((r, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: r.phase,
          text: r.focus,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildBreadcrumb(route) {
  if (!route.breadcrumb) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: route.breadcrumb.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: index === 0 ? `${baseUrl}/` : `${baseUrl}${route.path}`,
    })),
  };
}

function buildHead(route) {
  const url = `${baseUrl}${route.path === "/" ? "/" : route.path}`;
  const schemas = [orgSchema, ...(route.schema || []), buildBreadcrumb(route)].filter(Boolean);
  const jsonLd = schemas
    .map(
      (schema) =>
        `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(schema)}</script>`
    )
    .join("");

  return [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}">`,
    `<meta name="robots" content="index,follow">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${escapeHtml(route.title)}">`,
    `<meta property="og:description" content="${escapeHtml(route.description)}">`,
    `<meta property="og:type" content="${route.type}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:site_name" content="Latecomers AI">`,
    `<meta property="og:image" content="${defaultImage}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}">`,
    `<meta name="twitter:image" content="${defaultImage}">`,
    jsonLd,
  ].join("");
}

function stripExistingSeo(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+name="robots"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<meta\s+(?:property|name)="(?:og:[^"]+|twitter:[^"]+)"[^>]*>/gi, "")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "");
}

function buildStaticRoot(route) {
  const inner = route.bodyHtml
    ? route.bodyHtml
    : `<h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.body)}</p><p><a href="/pricing">Start at Rs 9</a> · <a href="/careers-explore">Explore careers</a> · <a href="/blog">Read blog</a></p>`;
  return `<div id="root"><main style="max-width:960px;margin:0 auto;padding:48px 20px;font-family:Arial,sans-serif;color:#061b4f"><p style="color:#0b93c9;font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:12px">Latecomers AI</p>${inner}</main></div>`;
}

const shell = await readFile(path.join(buildDir, "index.html"), "utf8");
const cleanShell = stripExistingSeo(shell);

for (const route of routes) {
  const html = cleanShell
    .replace("</head>", `${buildHead(route)}</head>`)
    .replace('<div id="root"></div>', buildStaticRoot(route));
  const outputFile =
    route.path === "/"
      ? path.join(buildDir, "index.html")
      : path.join(buildDir, route.path.slice(1), "index.html");

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, html);
}

console.log(`Prerendered SEO HTML for ${routes.length} public routes.`);
