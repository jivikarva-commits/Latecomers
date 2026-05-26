import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const buildDir = path.join(frontendDir, "build");
const baseUrl = "https://www.latecomers.in";
const defaultImage = `${baseUrl}/brand/latecomers-logo.png`;

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Latecomers AI",
  url: baseUrl,
  logo: defaultImage,
};

const routes = [
  {
    path: "/",
    title: "Latecomers AI - Career guidance for late starters in India",
    description:
      "AI-powered career guidance for BPO workers, confused graduates, late starters, and career switchers in India.",
    type: "website",
    h1: "You are not late. You just need the right career map.",
    body:
      "Take a practical career quiz, discover matching careers, compare courses, and follow a step-by-step roadmap built for your background.",
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
    title: "Latecomers AI Pricing - Start at Rs 9",
    description:
      "Start your Latecomers AI career quiz from Rs 9 and unlock practical career guidance, roadmaps, and recommendations.",
    type: "website",
    h1: "Start your career clarity journey from Rs 9.",
    body:
      "Choose a simple plan to get AI-powered career guidance, career matches, and roadmap support.",
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
];

const blogPosts = [
  {
    slug: "career-after-bpo-in-india",
    title: "Career after BPO in India: practical paths that use your real experience",
    description:
      "BPO experience can become customer success, sales, operations, QA, data analytics, or team leadership when you translate it correctly.",
    keywords: "career after BPO, BPO career switch, customer success jobs India",
  },
  {
    slug: "best-skills-to-learn-in-2026-india",
    title: "Best skills to learn in 2026 in India if you want a better career",
    description:
      "A practical guide to choosing skills that match hiring demand, your background, and realistic career outcomes in India.",
    keywords: "best skills 2026 India, career skills, high income skills",
  },
  {
    slug: "career-switch-at-30-india",
    title: "Career switch at 30 in India: how to restart without feeling behind",
    description:
      "Switching careers at 30 is possible when you choose a practical target role, reuse your experience, and build proof.",
    keywords: "career switch at 30 India, restart career, career change",
  },
  {
    slug: "best-careers-after-bcom",
    title: "Best careers after BCom for practical growth in India",
    description:
      "Explore realistic career options after BCom including finance, analytics, accounting, business development, and digital roles.",
    keywords: "careers after BCom, BCom jobs India, commerce careers",
  },
  {
    slug: "free-it-courses-in-india",
    title: "Free IT courses in India that can help you start",
    description:
      "Use free IT courses to build fundamentals before investing in paid training or applying for beginner tech roles.",
    keywords: "free IT courses India, tech courses beginners, IT career",
  },
  {
    slug: "first-tech-job-without-degree",
    title: "How to get your first tech job without a degree",
    description:
      "A practical roadmap for building proof, learning job-ready skills, and applying for beginner tech roles without a formal degree.",
    keywords: "tech job without degree, first developer job, tech career India",
  },
  {
    slug: "ai-careers-for-beginners-india",
    title: "AI careers for beginners in India",
    description:
      "Learn beginner-friendly AI career paths, skills, tools, and project ideas for students and career switchers in India.",
    keywords: "AI careers India, AI jobs beginners, machine learning career",
  },
  {
    slug: "digital-marketing-roadmap-india",
    title: "Digital marketing roadmap for beginners in India",
    description:
      "A beginner-friendly roadmap for SEO, ads, content, analytics, and portfolio building in digital marketing.",
    keywords: "digital marketing roadmap India, SEO, Google Ads, Meta Ads",
  },
  {
    slug: "remote-jobs-in-india-for-beginners",
    title: "Remote jobs in India for beginners: where to start",
    description:
      "Explore beginner-friendly remote job paths in India and the skills you need to build trust with employers.",
    keywords: "remote jobs India beginners, work from home jobs, online careers",
  },
];

for (const post of blogPosts) {
  routes.push({
    path: `/blog/${post.slug}`,
    title: `${post.title} | Latecomers AI Blog`,
    description: post.description,
    type: "article",
    h1: post.title,
    body: `${post.description} Read practical steps, mistakes to avoid, and a realistic action plan for Indian learners.`,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: `${baseUrl}/blog/${post.slug}`,
        author: { "@type": "Organization", name: "Latecomers AI" },
        publisher: {
          "@type": "Organization",
          name: "Latecomers AI",
          logo: { "@type": "ImageObject", url: defaultImage },
        },
        keywords: post.keywords,
      },
    ],
    breadcrumb: ["Home", "Blog", post.title],
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
  return `<div id="root"><main style="max-width:960px;margin:0 auto;padding:48px 20px;font-family:Arial,sans-serif;color:#061b4f"><p style="color:#0b93c9;font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:12px">Latecomers AI</p><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.body)}</p><p><a href="/pricing">Start at Rs 9</a> · <a href="/careers-explore">Explore careers</a> · <a href="/blog">Read blog</a></p></main></div>`;
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
