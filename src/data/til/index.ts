import type { TilBlock, TilEntry } from '../../types/til';
import { til20261125 } from './2026-11-25-tokenizer-bpe';

/**
 * All Today I Learned (TIL) rough whiteboard boards, newest first.
 * To add a new day's rough notes, create a new file in `src/data/til/`
 * and register it in this array.
 */
export const TIL_ENTRIES: TilEntry[] = [til20261125].sort((a, b) =>
  b.date.localeCompare(a.date),
);

function extractBlockText(block: TilBlock): string {
  switch (block.type) {
    case 'header-box':
      return [...block.boxLines, ...(block.besideLines ?? [])].join(' ');
    case 'box':
      return [block.title ?? '', ...block.lines].join(' ');
    case 'text':
      return [block.heading ?? '', ...block.lines].join(' ');
    case 'list':
      return [
        block.heading ?? '',
        ...block.items.flatMap((item) => [
          item.text,
          ...(item.subitems ?? []),
          item.note ?? '',
        ]),
      ].join(' ');
    case 'kv':
      return [
        block.heading ?? '',
        ...block.rows.flatMap((row) => [row.key, row.value]),
      ].join(' ');
    case 'code':
      return [block.title ?? '', block.code].join(' ');
    case 'formula':
      return [block.question, ...block.lines, block.caveat ?? ''].join(' ');
    case 'callout':
      return [block.label ?? '', ...block.lines].join(' ');
    case 'divider':
      return block.label ?? '';
  }
}

export function extractTilSearchText(entry: TilEntry): string {
  const sectionText = entry.sections.flatMap((section) => [
    ...(section.left ?? []).map(extractBlockText),
    ...(section.right ?? []).map(extractBlockText),
    ...(section.blocks ?? []).map(extractBlockText),
  ]);

  return [entry.date, entry.title, entry.summary, ...entry.tags, ...sectionText]
    .join(' ')
    .toLowerCase();
}

export function formatTilDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return isoDate;
  }
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
