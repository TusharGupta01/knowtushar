import { EXPERIENCE_SUMMARY, PROFILE } from '../data/profile';
import { TIL_ENTRIES } from '../data/til';
import type { TilEntry } from '../types/til';
import type { ParsedRoute } from './router';

export const DEFAULT_SITE_URL = 'https://knowtushar.com';

export function getSiteUrl(): string {
  const fromEnv =
    (typeof import.meta !== 'undefined' &&
      (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_SITE_URL) ||
    (typeof process !== 'undefined' ? process.env.SITE_URL || process.env.VITE_SITE_URL : undefined);
  return (fromEnv || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  ogType: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
  jsonLd: Record<string, unknown>;
}

export function findTilBySlugOrId(slugOrId: string | null | undefined): TilEntry | undefined {
  if (!slugOrId) return undefined;
  return TIL_ENTRIES.find((e) => e.slug === slugOrId || e.id === slugOrId);
}

export function getRouteSeo(route: ParsedRoute, siteUrl = getSiteUrl()): SeoMetadata {
  if (route.page === 'experience') {
    const canonicalPath = '/experience';
    return {
      title: `Experience & Resume — ${PROFILE.name}`,
      description: EXPERIENCE_SUMMARY,
      canonicalPath,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: `Experience & Resume — ${PROFILE.name}`,
        url: `${siteUrl}${canonicalPath}`,
        mainEntity: {
          '@type': 'Person',
          name: PROFILE.name,
          url: siteUrl,
          jobTitle: 'Senior Software Engineer',
        },
      },
    };
  }

  if (route.page === 'notes') {
    const canonicalPath = '/notes';
    return {
      title: `Notes & Writing — ${PROFILE.name}`,
      description: 'Essays, technical notes, and engineering write-ups by Tushar Gupta.',
      canonicalPath,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Notes & Writing — ${PROFILE.name}`,
        url: `${siteUrl}${canonicalPath}`,
      },
    };
  }

  if (route.page === 'til') {
    const entry = findTilBySlugOrId(route.tilSlug);
    if (entry) {
      const canonicalPath = `/til/${entry.slug}`;
      return {
        title: `${entry.title} — TIL | ${PROFILE.name}`,
        description: entry.summary,
        canonicalPath,
        ogType: 'article',
        publishedTime: entry.date,
        tags: entry.tags,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: entry.title,
          description: entry.summary,
          datePublished: entry.date,
          dateModified: entry.date,
          keywords: entry.tags.join(', '),
          url: `${siteUrl}${canonicalPath}`,
          author: {
            '@type': 'Person',
            name: PROFILE.name,
            url: siteUrl,
          },
        },
      };
    }

    const canonicalPath = '/til';
    return {
      title: `TIL (Today I Learned) — ${PROFILE.name}`,
      description:
        'Daily rough engineering and AI whiteboard notes by Tushar Gupta — LLMs, tokenizers, distributed systems, and more.',
      canonicalPath,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `TIL — Today I Learned | ${PROFILE.name}`,
        url: `${siteUrl}${canonicalPath}`,
        hasPart: TIL_ENTRIES.map((e) => ({
          '@type': 'TechArticle',
          headline: e.title,
          datePublished: e.date,
          url: `${siteUrl}/til/${e.slug}`,
        })),
      },
    };
  }

  return {
    title: `${PROFILE.name} — Software Engineer`,
    description: PROFILE.headline,
    canonicalPath: '/',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: PROFILE.name,
      url: siteUrl,
      sameAs: PROFILE.socials
        .filter((s) => s.href.startsWith('http'))
        .map((s) => s.href),
    },
  };
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applyDocumentSeo(meta: SeoMetadata, siteUrl = getSiteUrl()): void {
  if (typeof document === 'undefined') return;
  const fullUrl = `${siteUrl}${meta.canonicalPath}`;

  document.title = meta.title;
  upsertMeta('name', 'description', meta.description);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:type', meta.ogType);
  upsertMeta('property', 'og:url', fullUrl);
  upsertMeta('name', 'twitter:card', 'summary');
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', fullUrl);

  let ld = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld="true"]');
  if (!ld) {
    ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.setAttribute('data-seo-jsonld', 'true');
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify(meta.jsonLd);
}
