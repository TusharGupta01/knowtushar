import { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { HeroAbout } from './components/HeroAbout';
import { Experience } from './components/Experience';
import { NotesSection } from './components/NotesSection';
import { TilSection } from './components/TilSection';
import { Footer } from './components/Footer';

export type PageRoute = 'intro' | 'experience' | 'notes' | 'til';

interface ParsedRoute {
  page: PageRoute;
  tilId: string | null;
}

function parseHashRoute(hash: string): ParsedRoute {
  const normalized = hash.replace(/^#/, '').replace(/\/+$/, '');
  const lower = normalized.toLowerCase();

  if (lower === '/experience' || lower === 'experience') {
    return { page: 'experience', tilId: null };
  }
  if (lower === '/notes' || lower === 'notes') {
    return { page: 'notes', tilId: null };
  }
  if (lower === '/til' || lower === 'til') {
    return { page: 'til', tilId: null };
  }
  const tilMatch = normalized.match(/^\/?til\/(.+)$/i);
  if (tilMatch) {
    return { page: 'til', tilId: decodeURIComponent(tilMatch[1]) };
  }
  return { page: 'intro', tilId: null };
}

const SHORTCUT_HASH: Record<string, string> = {
  '1': '#/',
  '2': '#/experience',
  '3': '#/notes',
  '4': '#/til',
};

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [parsedRoute, setParsedRoute] = useState<ParsedRoute>(() =>
    parseHashRoute(window.location.hash),
  );

  useEffect(() => {
    const handleHashChange = () => {
      setParsedRoute(parseHashRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      const nextHash = SHORTCUT_HASH[e.key];
      if (nextHash && window.location.hash !== nextHash) {
        window.location.hash = nextHash;
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
        {route === 'til' && <TilSection initialEntryId={parsedRoute.tilId} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
