import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { Calendar, ChevronLeft, ChevronRight, PenLine, Search, X } from 'lucide-react';
import { TIL_ENTRIES, extractTilSearchText, formatTilDate } from '../data/til';
import { navigateTo } from '../lib/router';
import { findTilBySlugOrId } from '../lib/seo';
import { ExcaliBoard } from './ExcaliBoard';

interface TilSectionProps {
  initialEntrySlug?: string | null;
}

const PILL_VARIANTS = [
  'sketch-pill-lavender',
  'sketch-pill-mint',
  'sketch-pill-yellow',
  'sketch-pill-sky',
] as const;

export function TilSection({ initialEntrySlug }: TilSectionProps) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    const matched = findTilBySlugOrId(initialEntrySlug);
    return (matched ?? TIL_ENTRIES[0])?.slug ?? '';
  });

  const isDedicatedEntryPage = Boolean(findTilBySlugOrId(initialEntrySlug));

  useEffect(() => {
    const matched = findTilBySlugOrId(initialEntrySlug);
    if (matched) {
      setActiveSlug(matched.slug);
    }
  }, [initialEntrySlug]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const entry of TIL_ENTRIES) {
      for (const tag of entry.tags) {
        set.add(tag);
      }
    }
    return Array.from(set).sort();
  }, []);

  const searchIndex = useMemo(
    () => new Map(TIL_ENTRIES.map((entry) => [entry.slug, extractTilSearchText(entry)])),
    [],
  );

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TIL_ENTRIES.filter((entry) => {
      if (selectedTag && !entry.tags.includes(selectedTag)) return false;
      if (q && !(searchIndex.get(entry.slug) ?? '').includes(q)) return false;
      return true;
    });
  }, [search, selectedTag, searchIndex]);

  const activeEntry = useMemo(() => {
    if (filteredEntries.length === 0) return null;
    return filteredEntries.find((e) => e.slug === activeSlug) ?? filteredEntries[0];
  }, [filteredEntries, activeSlug]);

  const activeIndex = activeEntry
    ? filteredEntries.findIndex((e) => e.slug === activeEntry.slug)
    : -1;

  const selectEntry = (slug: string, e?: MouseEvent<HTMLAnchorElement>) => {
    if (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
    }
    setActiveSlug(slug);
    navigateTo(`/til/${slug}`);
  };

  return (
    <section id="til" className="py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {isDedicatedEntryPage ? (
            <p className="font-sketch text-3xl font-bold tracking-tight text-[var(--ink)]">
              TIL — Today I Learned
            </p>
          ) : (
            <h1 className="font-sketch text-4xl font-bold tracking-tight text-[var(--ink)]">
              TIL — Today I Learned
            </h1>
          )}
          <p className="mt-1 text-base text-[var(--ink-muted)]">
            Rough whiteboard notes by date — Excalidraw style, rendered as crisp selectable text.
          </p>
        </div>

        <span className="sketch-pill sketch-pill-yellow font-mono-label text-xs">
          <PenLine className="h-3.5 w-3.5 shrink-0" />
          <span>
            {TIL_ENTRIES.length} {TIL_ENTRIES.length === 1 ? 'board' : 'boards'}
          </span>
        </span>
      </div>

      {/* Search & Tag Filters */}
      <div className="mt-6 space-y-3.5">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all TIL boards, code snippets, formulas, and dates..."
            className="sketch-input w-full py-2.5 pr-9 pl-10 text-base placeholder:text-[var(--ink-muted)]/75"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded p-1 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
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

      {/* Date timeline / board switcher (real <a> links for crawlers) */}
      {filteredEntries.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="TIL dates" className="flex flex-wrap items-center gap-2">
            {filteredEntries.map((entry) => {
              const isSelected = activeEntry?.slug === entry.slug;
              return (
                <a
                  key={entry.slug}
                  href={`/til/${entry.slug}`}
                  aria-current={isSelected ? 'page' : undefined}
                  onClick={(e) => selectEntry(entry.slug, e)}
                  className={`sketch-btn inline-flex items-center gap-2 px-3 py-1.5 text-sm ${
                    isSelected
                      ? 'border-[#6965db] bg-[#e0dfff] text-[#4a46b5] dark:border-[#a8a5ff] dark:bg-[#353263] dark:text-[#c5c3ff]'
                      : ''
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono-label text-xs">{formatTilDate(entry.date)}</span>
                  <span className="hidden text-[var(--ink-muted)] sm:inline">·</span>
                  <span className="hidden max-w-[220px] truncate sm:inline">{entry.title}</span>
                </a>
              );
            })}
          </nav>

          {filteredEntries.length > 1 && activeIndex !== -1 && (
            <div className="font-mono-label flex items-center gap-1.5 text-xs">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => selectEntry(filteredEntries[activeIndex - 1].slug)}
                className="sketch-btn inline-flex cursor-pointer items-center gap-1 px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Newer</span>
              </button>
              <button
                type="button"
                disabled={activeIndex === filteredEntries.length - 1}
                onClick={() => selectEntry(filteredEntries[activeIndex + 1].slug)}
                className="sketch-btn inline-flex cursor-pointer items-center gap-1 px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Older</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Excalidraw Text Board */}
      <div className="mt-6">
        {activeEntry ? (
          <ExcaliBoard entry={activeEntry} headingAsH1={isDedicatedEntryPage} />
        ) : (
          <div className="sketch-card py-12 text-center text-base text-[var(--ink-muted)]">
            No TIL boards matched your search.
          </div>
        )}
      </div>
    </section>
  );
}
