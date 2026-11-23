import { PROFILE } from '../data/profile';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/80 py-10 dark:border-zinc-800/80">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-2 px-6 text-xs text-zinc-500 sm:flex-row dark:text-zinc-500">
        <p>
          © {year} {PROFILE.name}. All rights reserved.
        </p>
        <p>Static S3 site · Embedded SQLite (WASM)</p>
      </div>
    </footer>
  );
}
