// SEO landing pages — single source of truth is landingPages.json so the
// React app and the prerender script (scripts/prerender-seo-pages.mjs) stay in sync.
import data from "./landingPages.json";

export const LANDING_PAGES = data;

export function getLandingPage(slug) {
  return LANDING_PAGES.find((p) => p.slug === slug) || null;
}
