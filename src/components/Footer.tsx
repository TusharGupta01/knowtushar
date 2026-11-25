import { PROFILE } from '../data/profile';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pt-6 pb-8 sm:px-6">
      <div className="sketch-toolbar font-mono-label mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-[11px] text-[var(--ink-muted)]">
        <span>
          © {year} {PROFILE.name}
        </span>
      </div>
    </footer>
  );
}
