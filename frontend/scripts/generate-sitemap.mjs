// Build-time sitemap generator.
// Reads blogPosts.js and writes public/sitemap.xml + build/sitemap.xml with all static + blog URLs.
// Runs after `craco build` (see "postbuild" / "prebuild" hooks in package.json).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://www.latecomers.in";

const STATIC_URLS = [
  { loc: "/", changefreq: "weekly", priority: 1.0 },
  { loc: "/about", changefreq: "monthly", priority: 0.7 },
  { loc: "/careers-explore", changefreq: "weekly", priority: 0.9 },
  { loc: "/pricing", changefreq: "weekly", priority: 0.8 },
  { loc: "/blog", changefreq: "weekly", priority: 0.8 },
  { loc: "/for-institutes", changefreq: "monthly", priority: 0.6 },
  { loc: "/contact", changefreq: "monthly", priority: 0.5 },
  { loc: "/signin", changefreq: "monthly", priority: 0.4 },
];

function loadBlogPosts() {
  // Parse src/data/blogPosts.js with regex (avoids needing "type":"module" in package.json)
  const src = fs.readFileSync(path.join(ROOT, "src/data/blogPosts.js"), "utf8");
  const slugRe = /slug:\s*"([^"]+)",?\s*\n\s*(?:publishedAt:\s*"([^"]+)",?\s*\n\s*)?(?:updatedAt:\s*"([^"]+)",?)?/g;
  const posts = [];
  let m;
  while ((m = slugRe.exec(src))) {
    posts.push({ slug: m[1], publishedAt: m[2] || null, updatedAt: m[3] || null });
  }
  return posts;
}

function urlEntry({ loc, changefreq = "monthly", priority = 0.5, lastmod }) {
  const fullLoc = loc.startsWith("http") ? loc : `${SITE}${loc}`;
  const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${fullLoc}</loc>${lm}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

async function main() {
  const posts = loadBlogPosts();
  const today = new Date().toISOString().slice(0, 10);

  const entries = [
    ...STATIC_URLS.map((u) => urlEntry({ ...u, lastmod: today })),
    ...posts.map((p) =>
      urlEntry({
        loc: `/blog/${p.slug}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: p.updatedAt || p.publishedAt || today,
      })
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  // Write to both public/ (for dev) and build/ (for prod deploy)
  const targets = [
    path.join(ROOT, "public/sitemap.xml"),
    path.join(ROOT, "build/sitemap.xml"),
  ];
  for (const file of targets) {
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, xml);
      console.log(`[sitemap] Wrote ${posts.length + STATIC_URLS.length} URLs → ${path.relative(ROOT, file)}`);
    } catch (err) {
      console.warn(`[sitemap] Could not write ${file}:`, err.message);
    }
  }
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(0); // don't fail the build
});
