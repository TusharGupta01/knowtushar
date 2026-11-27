import { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { HeroAbout } from './components/HeroAbout';
import { Experience } from './components/Experience';
import { NotesSection } from './components/NotesSection';
import { TilSection } from './components/TilSection';
import { Footer } from './components/Footer';
import { navigateTo, parseRoute, type PageRoute, type ParsedRoute } from './lib/router';
import { applyDocumentSeo, findTilBySlugOrId, getRouteSeo } from './lib/seo';

export type { PageRoute };

const SHORTCUT_PATH: Record<string, string> = {
  '1': '/',
  '2': '/experience',
  '3': '/notes',
  '4': '/til',
};

interface AppProps {
  initialPath?: string;
}

export function App({ initialPath }: AppProps) {
  const { theme, toggleTheme } = useTheme();
  const [parsedRoute, setParsedRoute] = useState<ParsedRoute>(() => {
    if (initialPath) return parseRoute(initialPath);
    if (typeof window === 'undefined') return { page: 'intro', tilSlug: null };
    return parseRoute(window.location.pathname, window.location.hash);
  });

  // Redirect legacy hash routes (#/til, #/experience, etc.) to clean path URLs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const legacy = parseRoute('/', window.location.hash);
      if (legacy.page === 'til' && legacy.tilSlug) {
        const entry = findTilBySlugOrId(legacy.tilSlug);
        navigateTo(entry ? `/til/${entry.slug}` : '/til', true);
      } else if (legacy.page !== 'intro') {
        navigateTo(`/${legacy.page}`, true);
      } else {
        navigateTo('/', true);
      }
    }
  }, []);

  useEffect(() => {
    const syncFromLocation = () => {
      setParsedRoute(parseRoute(window.location.pathname, window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    applyDocumentSeo(getRouteSeo(parsedRoute));
  }, [parsedRoute]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      const nextPath = SHORTCUT_PATH[e.key];
      if (nextPath) {
        navigateTo(nextPath);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const route = parsedRoute.page;

  return (
    <div className="flex min-h-screen flex-col text-[var(--ink)]">
      <Navbar theme={theme} onToggleTheme={toggleTheme} activeRoute={route} />
      <main
        className={`mx-auto w-full flex-1 px-4 sm:px-6 ${
          route === 'til' ? 'max-w-6xl' : 'max-w-3xl'
        } ${route === 'intro' ? 'flex flex-col justify-center' : ''}`}
      >
        {route === 'intro' && <HeroAbout />}
        {route === 'experience' && <Experience />}
        {route === 'notes' && <NotesSection />}
        {route === 'til' && <TilSection initialEntrySlug={parsedRoute.tilSlug} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
