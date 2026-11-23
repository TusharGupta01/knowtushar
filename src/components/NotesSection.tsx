import { useState } from 'react';
import { BookOpen, Clock, Database, Search, X } from 'lucide-react';
import { useNotes, type NoteRecord } from '../hooks/useNotes';

export function NotesSection() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<NoteRecord | null>(null);

  const { notes, allTags, totalCount, loading, error, queryMs } = useNotes(search, selectedTag);
  const hasNotes = totalCount !== null && totalCount > 0;
  const hasActiveFilter = Boolean(search.trim() || selectedTag);

  return (
    <section id="notes" className="py-14">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Notes &amp; Writing
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Queried live in your browser from a bundled SQLite database.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Database className="h-3.5 w-3.5" />
          SQLite WASM{queryMs !== null ? ` · ${queryMs}ms` : ''}
        </span>
      </div>

      {/* Search & tag filters */}
      {hasNotes && (
        <div className="mt-6 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes (runs SQL LIKE query in-browser)..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pr-9 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
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
      <div className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            Could not load SQLite database: {error}
          </div>
        )}

        {!error && loading && notes.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            Initializing SQLite WebAssembly...
          </p>
        )}

        {!error && !loading && notes.length === 0 && !hasActiveFilter && !hasNotes && (
          <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-14 text-center dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Nothing published yet. Notes and writing will appear here as I add them.
            </p>
          </div>
        )}

        {!error && !loading && notes.length === 0 && (hasActiveFilter || hasNotes) && (
          <p className="py-8 text-center text-sm text-zinc-500">
            No notes matched your query.
          </p>
        )}

        {notes.map((note) => (
          <article
            key={note.id}
            onClick={() => setActiveNote(note)}
            className="group cursor-pointer rounded-xl border border-zinc-200/90 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/90 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <time>{note.published_at}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {note.reading_minutes} min read
              </span>
            </div>

            <h3 className="mt-2 text-base font-semibold text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
              {note.title}
            </h3>

            <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {note.summary}
            </p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <time>{activeNote.published_at}</time>
                  <span>·</span>
                  <span>{activeNote.reading_minutes} min read</span>
                </div>
                <h3
                  id="note-modal-title"
                  className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                >
                  {activeNote.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveNote(null)}
                aria-label="Close note"
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
              {activeNote.body}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              {activeNote.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
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
