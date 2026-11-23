import { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { HeroAbout } from './components/HeroAbout';
import { Experience } from './components/Experience';
import { NotesSection } from './components/NotesSection';
import { Footer } from './components/Footer';

export type PageRoute = 'intro' | 'experience' | 'notes';

function parseHashRoute(hash: string): PageRoute {
  const normalized = hash.replace(/^#/, '').replace(/\/+$/, '').toLowerCase();
  if (normalized === '/experience' || normalized === 'experience') {
    return 'experience';
  }
  if (normalized === '/notes' || normalized === 'notes') {
    return 'notes';
  }
  return 'intro';
}

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [route, setRoute] = useState<PageRoute>(() => parseHashRoute(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHashRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="flex min-h-screen flex-col text-[var(--ink)]">
      <Navbar theme={theme} onToggleTheme={toggleTheme} activeRoute={route} />
      <main
        className={`mx-auto w-full max-w-3xl flex-1 px-4 sm:px-6 ${
          route === 'intro' ? 'flex flex-col justify-center' : ''
        }`}
      >
        {route === 'intro' && <HeroAbout />}
        {route === 'experience' && <Experience />}
        {route === 'notes' && <NotesSection />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
