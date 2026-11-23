import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import type { PageRoute } from '../App';
import { PROFILE } from '../data/profile';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  activeRoute: PageRoute;
}

const NAV_ITEMS: { label: string; href: string; route: PageRoute }[] = [
  { label: 'Intro', href: '#/', route: 'intro' },
  { label: 'Experience', href: '#/experience', route: 'experience' },
  { label: 'Notes', href: '#/notes', route: 'notes' },
];

export function Navbar({ theme, onToggleTheme, activeRoute }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <a
          href="#/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {PROFILE.handle}
          <span className="text-emerald-600 dark:text-emerald-400">.</span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-6">
          <ul className="flex items-center gap-5 text-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = activeRoute === item.route;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`transition-colors ${
                      isActive
                        ? 'font-medium text-zinc-900 underline decoration-emerald-500 decoration-2 underline-offset-8 dark:text-zinc-100 dark:decoration-emerald-400'
                        : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
