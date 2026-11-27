export type SketchTone = 'default' | 'lavender' | 'mint' | 'yellow' | 'sky';

export interface TilListItem {
  text: string;
  subitems?: string[];
  note?: string;
}

export interface TilChatTurn {
  role: 'user' | 'assistant';
  speaker?: string;
  text: string;
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
      type: 'chat';
      title?: string;
      turns: TilChatTurn[];
      caption?: string;
    }
  | {
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
      maxWidth?: number;
    }
  | {
      type: 'diagram';
      kind: 'pre-vs-post-ln';
      caption?: string;
    }
  | {
      type: 'math';
      lead?: string;
      highlight?: string;
      description?: string;
      lhs: string;
      numerator: string;
      denominator: string;
      suffix?: string;
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
  slug: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  sections: TilSection[];
}
