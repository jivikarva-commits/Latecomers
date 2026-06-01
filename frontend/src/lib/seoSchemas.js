import { SITE_NAME, SITE_URL, absoluteUrl } from "../components/SEO";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/latecomers-logo.png"),
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
    name: SITE_NAME,
    url: SITE_URL,
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
