import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { TIL_ENTRIES } from './data/til';
import { parseRoute } from './lib/router';
import { getRouteSeo, type SeoMetadata } from './lib/seo';

export interface PrerenderResult {
  html: string;
  seo: SeoMetadata;
}

export function render(urlPath: string, siteUrl: string): PrerenderResult {
  const html = renderToString(
    <StrictMode>
      <App initialPath={urlPath} />
    </StrictMode>,
  );
  const seo = getRouteSeo(parseRoute(urlPath), siteUrl);
  return { html, seo };
}

export function getPrerenderRoutes(): { path: string; lastmod?: string; priority: string }[] {
  const latestTilDate = TIL_ENTRIES[0]?.date;
  return [
    { path: '/', lastmod: latestTilDate, priority: '1.0' },
    { path: '/experience', lastmod: latestTilDate, priority: '0.8' },
    { path: '/notes', lastmod: latestTilDate, priority: '0.7' },
    { path: '/til', lastmod: latestTilDate, priority: '0.9' },
    ...TIL_ENTRIES.map((entry) => ({
      path: `/til/${entry.slug}`,
      lastmod: entry.date,
      priority: '0.9',
    })),
  ];
}

export function getTilEntries() {
  return TIL_ENTRIES;
}
