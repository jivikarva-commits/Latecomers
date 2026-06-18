import { SITE_NAME, SITE_URL, absoluteUrl } from "../components/SEO";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ["Latecomers", "Latecomers.in"],
    url: SITE_URL,
    // Google logo guidelines: square-ish, PNG/JPG, on-domain, not transparent.
    // Google's docs recommend the logo image be served at a usable size; we use a
    // dedicated 512x512 white-background PNG and declare matching dimensions.
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: absoluteUrl("/brand/latecomers-logo-512.png"),
      contentUrl: absoluteUrl("/brand/latecomers-logo-512.png"),
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    image: { "@id": `${SITE_URL}/#logo` },
    description:
      "AI-powered career guidance for late starters, BPO workers, confused graduates, and career switchers in India.",
    foundingDate: "2025",
    areaServed: { "@type": "Country", name: "India" },
    // TODO(user): replace placeholders with real official profile URLs
    sameAs: [
      "https://www.linkedin.com/company/latecomers-ai",
      "https://x.com/latecomersai",
      "https://www.instagram.com/latecomers.ai",
      "https://www.youtube.com/@latecomersai",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/careers-explore?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "AI-powered career guidance for late starters, BPO workers, confused graduates, and career switchers in India.",
    offers: {
      "@type": "Offer",
      price: "9",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(post) {
  const published = post.publishedAt || "2025-09-01";
  const updated = post.updatedAt || published;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: published,
    dateModified: updated,
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/latecomers-logo.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    keywords: post.keywords?.join(", "),
    articleSection: post.category,
  };
}

export function itemListSchema(name, description, items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// Occupation schema for a career guide page — eligible for Google's
// occupation/career rich data. Salary in INR per year.
export function occupationSchema(guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: `${guide.title} (India)`,
    description: guide.intro,
    occupationLocation: { "@type": "Country", name: "India" },
    estimatedSalary: {
      "@type": "MonetaryAmountDistribution",
      name: "base",
      currency: "INR",
      duration: "P1Y",
      median: Math.round(((guide.salaryMin + guide.salaryMax) / 2) * 100000),
      percentile10: Math.round(guide.salaryMin * 100000),
      percentile90: Math.round(guide.salaryMax * 100000),
    },
    skills: guide.topSkills.join(", "),
    responsibilities: guide.intro,
    educationRequirements: guide.degreeNeeded
      ? "A relevant degree or qualifying exam is typically required."
      : "No specific degree required; skills and portfolio matter most.",
    experienceRequirements: "Entry level — suitable for freshers and career switchers.",
  };
}

// HowTo schema for the homepage "From confused to career-ready in 4 steps".
// Eligible for the HowTo rich result (numbered steps) in Google.
export function howToSchema(name, steps) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description:
      "How to find a practical career path in India using Latecomers AI — from a quick quiz to a step-by-step roadmap.",
    totalTime: "PT5M",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}/#step-${i + 1}`,
    })),
  };
}
