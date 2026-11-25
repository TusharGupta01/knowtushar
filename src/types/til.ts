export type SketchTone = 'default' | 'lavender' | 'mint' | 'yellow' | 'sky';

export interface TilListItem {
  text: string;
  subitems?: string[];
  note?: string;
}

export type TilBlock =
  | {
      type: 'header-box';
      boxLines: string[];
      besideLines?: string[];
      tone?: SketchTone;
    }
  | {
      type: 'box';
      title?: string;
      lines: string[];
      tone?: SketchTone;
      align?: 'left' | 'center';
    }
  | {
      type: 'text';
      heading?: string;
      lines: string[];
      muted?: boolean;
    }
  | {
      type: 'list';
      ordered?: boolean;
      start?: number;
      heading?: string;
      items: TilListItem[];
    }
  | {
      type: 'kv';
      heading?: string;
      rows: { key: string; value: string }[];
    }
  | {
      type: 'code';
      title?: string;
      language?: string;
      code: string;
    }
  | {
      type: 'formula';
      question: string;
      lines: string[];
      caveat?: string;
    }
  | {
      type: 'callout';
      label?: string;
      lines: string[];
      tone?: SketchTone;
    }
  | {
      type: 'divider';
      label?: string;
    };

export interface TilSection {
  layout: 'two-col' | 'single';
  split?: '45-55' | '50-50' | '40-60';
  left?: TilBlock[];
  right?: TilBlock[];
  blocks?: TilBlock[];
}

export interface TilEntry {
  id: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  sections: TilSection[];
}
