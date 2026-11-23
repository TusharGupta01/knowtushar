import { useEffect, useState } from 'react';
import type { SqlValue } from 'sql.js';
import { queryAll } from '../lib/sqlite';

export interface NoteRecord {
  id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  published_at: string;
  reading_minutes: number;
  tags: string[];
}

interface RawNoteRow extends Record<string, SqlValue> {
  id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  published_at: string;
  reading_minutes: number;
  tags: string;
}

function mapRow(row: RawNoteRow): NoteRecord {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary),
    body: String(row.body),
    published_at: String(row.published_at),
    reading_minutes: Number(row.reading_minutes),
    tags: String(row.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export function useNotes(searchQuery: string, selectedTag: string | null) {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queryMs, setQueryMs] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    queryAll<{ tags: string }>('SELECT tags FROM notes')
      .then((rows) => {
        if (cancelled) return;
        setTotalCount(rows.length);
        const set = new Set<string>();
        for (const row of rows) {
          for (const tag of String(row.tags || '').split(',')) {
            const clean = tag.trim();
            if (clean) set.add(clean);
          }
        }
        setAllTags(Array.from(set).sort());
      })
      .catch(() => {
        // Handled by main query effect
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const clauses: string[] = [];
    const params: SqlValue[] = [];

    const trimmed = searchQuery.trim();
    if (trimmed) {
      const pattern = `%${trimmed}%`;
      clauses.push('(title LIKE ? OR summary LIKE ? OR body LIKE ? OR tags LIKE ?)');
      params.push(pattern, pattern, pattern, pattern);
    }

    if (selectedTag) {
      clauses.push("(',' || tags || ',') LIKE ?");
      params.push(`%,${selectedTag},%`);
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const sql = `
      SELECT id, slug, title, summary, body, published_at, reading_minutes, tags
      FROM notes
      ${where}
      ORDER BY published_at DESC, id DESC
    `;

    const started = performance.now();
    queryAll<RawNoteRow>(sql, params)
      .then((rows) => {
        if (cancelled) return;
        setNotes(rows.map(mapRow));
        setQueryMs(Math.max(0.1, Number((performance.now() - started).toFixed(1))));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to query SQLite database');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedTag]);

  return { notes, allTags, totalCount, loading, error, queryMs };
}
