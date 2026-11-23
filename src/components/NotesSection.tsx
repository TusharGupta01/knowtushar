import { useState } from 'react';
import { BookOpen, Clock, Database, Search, X } from 'lucide-react';
import { useNotes, type NoteRecord } from '../hooks/useNotes';

const PILL_VARIANTS = [
  'sketch-pill-lavender',
  'sketch-pill-mint',
  'sketch-pill-yellow',
  'sketch-pill-sky',
] as const;

export function NotesSection() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<NoteRecord | null>(null);

  const { notes, allTags, totalCount, loading, error, queryMs } = useNotes(search, selectedTag);
  const hasNotes = totalCount !== null && totalCount > 0;
  const hasActiveFilter = Boolean(search.trim() || selectedTag);

  const sqliteBadge = (
    <span className="sketch-pill sketch-pill-mint font-mono-label text-xs">
      <Database className="h-3.5 w-3.5 shrink-0" />
      <span>SQLite WASM{queryMs !== null ? ` · ${queryMs}ms` : ''}</span>
    </span>
  );

  return (
    <section id="notes" className="py-12 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-sketch text-4xl font-bold tracking-tight text-[var(--ink)]">
            Notes &amp; Writing
          </h2>
          <p className="mt-1 text-base text-[var(--ink-muted)]">
            Queried live in your browser from a bundled SQLite database.
          </p>
        </div>

        {sqliteBadge}
      </div>

      {/* Search & tag filters */}
      {hasNotes && (
        <div className="mt-6 space-y-3.5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes (runs SQL LIKE query in-browser)..."
              className="sketch-input w-full py-2.5 pr-9 pl-10 text-base placeholder:text-[var(--ink-muted)]/75"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`sketch-pill cursor-pointer text-sm transition-transform hover:-translate-y-0.5 ${
                  selectedTag === null
                    ? 'border-[#6965db] bg-[#e0dfff] text-[#4a46b5] dark:border-[#a8a5ff] dark:bg-[#353263] dark:text-[#c5c3ff]'
                    : 'border-[#1e1e24]/30 bg-[var(--surface-bg)] text-[var(--ink-muted)] dark:border-[#d4d4dc]/30'
                }`}
              >
                All
              </button>
              {allTags.map((tag, idx) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`sketch-pill cursor-pointer text-sm transition-transform hover:-translate-y-0.5 ${
                    selectedTag === tag
                      ? 'border-[#6965db] bg-[#6965db] text-white dark:border-[#a8a5ff] dark:bg-[#a8a5ff] dark:text-[#121212]'
                      : PILL_VARIANTS[idx % PILL_VARIANTS.length]
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <div className="mt-7 space-y-4">
        {error && (
          <div className="sketch-card border-red-500 bg-red-50 p-4 text-base text-red-800 dark:border-red-400 dark:bg-red-950/40 dark:text-red-200">
            Could not load SQLite database: {error}
          </div>
        )}

        {!error && loading && notes.length === 0 && (
          <div className="sketch-card py-10 text-center text-base text-[var(--ink-muted)]">
            Initializing SQLite WebAssembly...
          </div>
        )}

        {!error && !loading && notes.length === 0 && !hasActiveFilter && !hasNotes && (
          <div className="sketch-card flex flex-col items-center px-6 py-14 text-center">
            {/* Hand-drawn notebook & pencil doodle */}
            <svg
              aria-hidden="true"
              viewBox="0 0 96 80"
              fill="none"
              className="mb-4 h-16 w-20 text-[var(--ink)]"
            >
              {/* Notepad sheet */}
              <path
                d="M18 14C34 12.8 50 13.2 64 14.5C65.2 31 64.8 49 63.6 66C48 67.2 33 66.8 18.5 65.5C17.2 49 17.4 31 18 14Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Ruled sketch lines */}
              <path
                d="M27 28C36 27.4 45 27.5 54 28.2M27 39C35 38.6 43 38.7 51 39.2M27 50C33 49.7 39 49.8 45 50.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.55"
              />
              {/* Hand-drawn pencil in Excalidraw accent */}
              <path
                d="M57 56L79 25C80.5 22.8 83.4 22.4 85.4 24C87.4 25.5 87.7 28.5 86 30.7L64 61.5L54.5 64.5L57 56Z"
                className="fill-[#e0dfff] stroke-[#6965db] dark:fill-[#353263] dark:stroke-[#a8a5ff]"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M75.5 30L82.5 35.2"
                className="stroke-[#6965db] dark:stroke-[#a8a5ff]"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <h3 className="font-sketch text-2xl font-bold text-[var(--ink)]">
              Blank canvas for now
            </h3>
            <p className="mt-1.5 max-w-md text-base text-[var(--ink-muted)]">
              Nothing published yet. Notes and writing will appear here as I add them.
            </p>
            <div className="mt-5">{sqliteBadge}</div>
          </div>
        )}

        {!error && !loading && notes.length === 0 && (hasActiveFilter || hasNotes) && (
          <div className="sketch-card py-10 text-center text-base text-[var(--ink-muted)]">
            No notes matched your query.
          </div>
        )}

        {notes.map((note) => (
          <article
            key={note.id}
            onClick={() => setActiveNote(note)}
            className="sketch-card group cursor-pointer p-6 transition-transform duration-150 hover:-translate-y-0.5"
          >
            <div className="font-mono-label flex flex-wrap items-center gap-3 text-xs text-[var(--ink-muted)]">
              <time>{note.published_at}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {note.reading_minutes} min read
              </span>
            </div>

            <h3 className="font-sketch mt-2 text-2xl font-bold text-[var(--ink)] transition-colors group-hover:text-[#6965db] dark:group-hover:text-[#a8a5ff]">
              {note.title}
            </h3>

            <p className="mt-1.5 text-base leading-relaxed text-[var(--ink-muted)]">
              {note.summary}
            </p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag, idx) => (
                  <span
                    key={tag}
                    className={`sketch-pill ${PILL_VARIANTS[idx % PILL_VARIANTS.length]} text-xs`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[#6965db] dark:text-[#a8a5ff]">
                <BookOpen className="h-3.5 w-3.5" />
                Read
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Note reader modal */}
      {activeNote && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="note-modal-title"
          onClick={() => setActiveNote(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sketch-card max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono-label flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                  <time>{activeNote.published_at}</time>
                  <span>·</span>
                  <span>{activeNote.reading_minutes} min read</span>
                </div>
                <h3
                  id="note-modal-title"
                  className="font-sketch mt-2 text-3xl font-bold tracking-tight text-[var(--ink)]"
                >
                  {activeNote.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveNote(null)}
                aria-label="Close note"
                className="sketch-btn inline-flex h-9 w-9 shrink-0 items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-[17px] leading-relaxed whitespace-pre-line text-[var(--ink)]/90">
              {activeNote.body}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-dashed border-[#1e1e24]/25 pt-4 dark:border-[#d4d4dc]/25">
              {activeNote.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className={`sketch-pill ${PILL_VARIANTS[idx % PILL_VARIANTS.length]} text-xs`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
