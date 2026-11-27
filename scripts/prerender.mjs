import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(root, 'dist');
const ssrOutDir = resolve(root, 'node_modules/.cache/knowtushar-ssr');
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://knowtushar.com').replace(
  /\/+$/,
  '',
);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 1. Build SSR bundle into node_modules/.cache/knowtushar-ssr
const viteBin = resolve(root, 'node_modules/.bin/vite');
execFileSync(
  viteBin,
  ['build', '--ssr', 'src/entry-server.tsx', '--outDir', ssrOutDir, '--logLevel', 'warn'],
  { cwd: root, stdio: 'inherit' },
);

// 2. Load compiled SSR entry
const ssrEntryUrl = pathToFileURL(resolve(ssrOutDir, 'entry-server.js')).href;
const { render, getPrerenderRoutes, getTilEntries } = await import(ssrEntryUrl);

const template = readFileSync(resolve(distDir, 'index.html'), 'utf8');
const routes = getPrerenderRoutes();

// 3. Prerender every route into static HTML with per-route SEO head tags
for (const route of routes) {
  const { html, seo } = render(route.path, siteUrl);
  const fullUrl = `${siteUrl}${seo.canonicalPath}`;

  const seoHeadTags = [
    `<link rel="canonical" href="${escapeHtml(fullUrl)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="Tushar Gupta — TIL Feed" href="${escapeHtml(siteUrl)}/feed.xml" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(seo.ogType)}" />`,
    `<meta property="og:url" content="${escapeHtml(fullUrl)}" />`,
    `<meta property="og:site_name" content="knowtushar" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    ...(seo.publishedTime
      ? [`<meta property="article:published_time" content="${escapeHtml(seo.publishedTime)}" />`]
      : []),
    ...(seo.tags ?? []).map(
      (tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`,
    ),
    `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(seo.jsonLd)}</script>`,
  ].join('\n    ');

  let pageHtml = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    )
    .replace('</head>', `    ${seoHeadTags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outFile =
    route.path === '/'
      ? resolve(distDir, 'index.html')
      : resolve(distDir, route.path.replace(/^\/+/, ''), 'index.html');

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, pageHtml, 'utf8');
}

// 4. Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const loc = `${siteUrl}${route.path}`;
    const lastmod = route.lastmod ? `\n    <lastmod>${escapeXml(route.lastmod)}</lastmod>` : '';
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod}\n    <priority>${route.priority}</priority>\n  </url>`;
  })
  .join('\n')}
</urlset>
`;
writeFileSync(resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

// 5. Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
writeFileSync(resolve(distDir, 'robots.txt'), robotsTxt, 'utf8');

// 6. Generate RSS feed (feed.xml) for TIL boards
const tilEntries = getTilEntries();
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tushar Gupta — TIL (Today I Learned)</title>
    <link>${escapeXml(siteUrl)}/til</link>
    <description>Daily rough engineering and AI whiteboard notes by Tushar Gupta.</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
${tilEntries
  .map((entry) => {
    const link = `${siteUrl}/til/${entry.slug}`;
    const pubDate = new Date(`${entry.date}T00:00:00Z`).toUTCString();
    const categories = entry.tags
      .map((tag) => `      <category>${escapeXml(tag)}</category>`)
      .join('\n');
    return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(pubDate)}</pubDate>
      <description>${escapeXml(entry.summary)}</description>
${categories}
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>
`;
writeFileSync(resolve(distDir, 'feed.xml'), rssXml, 'utf8');

console.log(
  `Prerendered ${routes.length} routes + sitemap.xml + robots.txt + feed.xml (SITE_URL=${siteUrl})`,
);
