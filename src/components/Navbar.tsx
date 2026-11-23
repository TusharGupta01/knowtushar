import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import type { PageRoute } from '../App';
import { PROFILE } from '../data/profile';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  activeRoute: PageRoute;
}

const NAV_ITEMS: { label: string; href: string; route: PageRoute; shortcut: string }[] = [
  { label: 'Intro', href: '#/', route: 'intro', shortcut: '1' },
  { label: 'Experience', href: '#/experience', route: 'experience', shortcut: '2' },
  { label: 'Notes', href: '#/notes', route: 'notes', shortcut: '3' },
];

export function Navbar({ theme, onToggleTheme, activeRoute }: NavbarProps) {
  return (
    <header className="sticky top-4 z-30 px-4 sm:px-6">
      <div className="sketch-toolbar mx-auto flex w-fit max-w-full items-center gap-1.5 px-3 py-1.5 sm:gap-2 sm:px-3.5 sm:py-2">
        <a
          href="#/"
          className="font-sketch px-1.5 text-xl font-bold tracking-tight text-[var(--ink)] transition-opacity hover:opacity-80 sm:text-2xl"
        >
          {PROFILE.handle}
          <span className="text-[#6965db] dark:text-[#a8a5ff]">.</span>
        </a>

        <span
          aria-hidden="true"
          className="mx-0.5 h-6 w-[1.5px] shrink-0 rounded-full bg-[#1e1e24]/15 dark:bg-[#d4d4dc]/20"
        />

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-1.5">
          <ul className="flex items-center gap-1 sm:gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeRoute === item.route;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative inline-flex items-center rounded-lg border px-2.5 py-1.5 pr-4 text-[15px] leading-none transition-colors sm:px-3.5 sm:pr-5 sm:text-base ${
                      isActive
                        ? 'border-[#6965db] bg-[#e0dfff] text-[#4a46b5] dark:border-[#a8a5ff] dark:bg-[#353263] dark:text-[#c5c3ff]'
                        : 'border-transparent text-[var(--ink-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`font-mono-label absolute right-1 bottom-0.5 text-[9px] leading-none ${
                        isActive
                          ? 'text-[#6965db] dark:text-[#c5c3ff]'
                          : 'text-[var(--ink-muted)]/70'
                      }`}
                    >
                      {item.shortcut}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <span
            aria-hidden="true"
            className="mx-0.5 h-6 w-[1.5px] shrink-0 rounded-full bg-[#1e1e24]/15 dark:bg-[#d4d4dc]/20"
          />

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[var(--ink)] transition-colors hover:border-[#1e1e24]/25 hover:bg-[var(--surface-hover)] sm:h-9 sm:w-9 dark:hover:border-[#d4d4dc]/25"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-[#fde68a]" /> : <Moon className="h-4 w-4 text-[#6965db]" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
