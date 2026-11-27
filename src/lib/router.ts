export type PageRoute = 'intro' | 'experience' | 'notes' | 'til';

export interface ParsedRoute {
  page: PageRoute;
  tilSlug: string | null;
}

export function normalizePathname(pathname: string): string {
  const clean = pathname.replace(/\/index\.html$/i, '').replace(/\/+$/, '');
  return clean || '/';
}

export function parseRoute(pathname: string, hash = ''): ParsedRoute {
  // Backwards compatibility for old hash links (#/til, #/experience, etc.)
  const hashClean = hash.replace(/^#/, '').replace(/\/+$/, '');
  const source = hashClean && normalizePathname(pathname) === '/' ? hashClean : pathname;
  const normalized = normalizePathname(source.startsWith('/') ? source : `/${source}`);
  const lower = normalized.toLowerCase();

  if (lower === '/experience') {
    return { page: 'experience', tilSlug: null };
  }
  if (lower === '/notes') {
    return { page: 'notes', tilSlug: null };
  }
  if (lower === '/til') {
    return { page: 'til', tilSlug: null };
  }

  const tilMatch = normalized.match(/^\/til\/(.+)$/i);
  if (tilMatch) {
    return { page: 'til', tilSlug: decodeURIComponent(tilMatch[1]) };
  }

  return { page: 'intro', tilSlug: null };
}

export function navigateTo(path: string, replace = false): void {
  if (typeof window === 'undefined') return;
  const target = normalizePathname(path);
  const current = normalizePathname(window.location.pathname);
  if (target === current && !window.location.hash) return;

  if (replace) {
    window.history.replaceState(null, '', target);
  } else {
    window.history.pushState(null, '', target);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}
