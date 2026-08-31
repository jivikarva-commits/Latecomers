import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFile(path.join(root, name), 'utf8');
const seo = JSON.parse(await read('src/data/publicSeo.json'));
const source = await read('src/data/blogPosts.js');
const posts = new Function('return ' + source.match(/export const BLOG_POSTS\s*=\s*(\[[\s\S]*?\]);\s*\n+export function/)[1])();
const changed = posts.filter(post => post.seoTitle);
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const htmlAt = route => read(`build/${route ? route + '/' : ''}index.html`);

test('homepage and pricing ship the same metadata used by the React pages', async () => {
  for (const [route, data] of [['', seo.home], ['pricing', seo.pricing]]) {
    const html = await htmlAt(route);
    assert.equal((html.match(/<title>/g) || []).length, 1);
    assert.ok(html.includes(`<title>${escape(data.title)}</title>`));
    assert.ok(html.includes(`<meta name="description" content="${escape(data.description)}">`));
    assert.ok(html.includes(`<h1>${escape(data.h1)}</h1>`));
    assert.ok(html.includes(`rel="canonical" href="https://www.latecomers.in/${route}"`));
    assert.ok(html.includes(`property="og:title" content="${escape(data.title)}"`));
    assert.ok(html.includes(`name="twitter:title" content="${escape(data.title)}"`));
    assert.doesNotMatch(html, /free AI career guidance|Take the free career quiz/i);
  }
});

test('priority article titles, answers and source links are present before JavaScript runs', async () => {
  assert.ok(changed.length >= 4);
  const sitemap = await read('build/sitemap.xml');
  for (const post of changed) {
    const html = await htmlAt(`blog/${post.slug}`);
    // A seoTitle only earns its place if the rendered title survives Google's
    // ~60 character mobile truncation once the brand suffix is appended.
    assert.ok(`${post.seoTitle} | Latecomers AI`.length <= 60, `${post.slug}: rendered title exceeds 60 chars`);
    assert.ok(post.quickAnswer, `${post.slug}: a priority article must answer its query above the fold`);
    assert.ok(html.includes(`<title>${escape(post.seoTitle)} | Latecomers AI</title>`));
    assert.ok(html.includes(escape(post.quickAnswer)));
    assert.ok(html.includes(`Updated ${post.updatedAt}`));
    assert.ok(html.includes(`"dateModified":"${post.updatedAt}"`));
    assert.ok(sitemap.includes(`<loc>https://www.latecomers.in/blog/${post.slug}</loc>\n    <lastmod>${post.updatedAt}</lastmod>`));
    for (const link of post.sections.flatMap(s => s.links || [])) {
      assert.ok(html.includes(`href="${escape(link.href)}"`));
      if (link.href.startsWith('/')) {
        await htmlAt(link.href.slice(1)); // Internal destinations must exist in the actual build.
      } else {
        assert.equal(new URL(link.href).protocol, 'https:');
      }
    }
    assert.doesNotMatch(html, /free Latecomers AI career quiz|Take the free career quiz/i);
    for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      assert.ok(JSON.parse(match[1])['@type']);
    }
  }
});

test('public quiz and roadmap pages clearly disclose paid results in body and FAQ data', async () => {
  for (const route of ['career-quiz', 'career-roadmap', 'career-guidance-india', 'confused-about-career']) {
    const html = await htmlAt(route);
    assert.ok(html.includes(escape(seo.home.offer)));
    assert.doesNotMatch(html, /Take the free career quiz|Start the free career quiz|generates a free career roadmap/i);
  }
});

test('articles without a CTR title override retain their original title', async () => {
  const post = posts.find(p => !p.seoTitle);
  assert.ok((await htmlAt(`blog/${post.slug}`)).includes(`<title>${escape(post.title)} | Latecomers AI Blog</title>`));
});
