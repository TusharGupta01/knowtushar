import { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  Code2,
  Copy,
  Grid2x2,
  Link2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Type,
} from 'lucide-react';
import type { SketchTone, TilBlock, TilChatTurn, TilEntry, TilSection } from '../types/til';
import { formatTilDate } from '../data/til';

interface ExcaliBoardProps {
  entry: TilEntry;
  compactHeader?: boolean;
  headingAsH1?: boolean;
}

const TONE_FILL: Record<SketchTone, string> = {
  default: 'bg-transparent',
  lavender: 'bg-[#ecebff]/60 dark:bg-[#353263]/45',
  mint: 'bg-[#def7ec]/65 dark:bg-[#134e4a]/35',
  yellow: 'bg-[#fef3c7]/70 dark:bg-[#713f12]/30',
  sky: 'bg-[#e0f2fe]/65 dark:bg-[#0c4a6e]/35',
};

const PILL_VARIANTS = [
  'sketch-pill-lavender',
  'sketch-pill-mint',
  'sketch-pill-yellow',
  'sketch-pill-sky',
] as const;

function SketchBox({
  children,
  tone = 'default',
  className = '',
}: {
  children: React.ReactNode;
  tone?: SketchTone;
  className?: string;
}) {
  return (
    <div className={`relative inline-flex ${TONE_FILL[tone]} ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 220 130"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full text-current"
      >
        {/* Primary hand-drawn rounded rectangle stroke */}
        <path
          d="M 18 4 C 74 2.6, 152 3.1, 202 4.3 C 212.5 4.8, 216.2 9.4, 216.6 19.5 C 217.4 52, 216.8 84, 216.1 111.5 C 215.6 121.2, 210.8 125.7, 200.5 126.2 C 146 127.4, 72 126.9, 19.5 126.1 C 8.8 125.6, 4.2 120.8, 3.8 110.2 C 2.9 78, 3.3 47, 4.1 19.2 C 4.6 8.9, 9.2 4.4, 18 4 Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Subtle secondary rough pass like Rough.js / Excalidraw */}
        <path
          d="M 21 5.2 C 80 3.9, 148 4.4, 199 5.3 C 209.8 5.8, 214.8 10.6, 215.2 21.5 C 215.9 55, 215.4 82, 214.8 109.5 C 214.2 119.5, 209.4 124.2, 198.5 124.8 C 142 125.9, 76 125.3, 21.5 124.7 C 10.8 124.2, 5.8 119.2, 5.2 108.5 C 4.5 76, 4.9 50, 5.5 21 C 6.1 10.5, 11.2 5.6, 21 5.2 Z"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

function CodeSketchBlock({
  title,
  language,
  code,
  monoCode,
}: {
  title?: string;
  language?: string;
  code: string;
  monoCode: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  const lines = code.split('\n');

  return (
    <div className="group relative rounded-xl border border-transparent p-2 -mx-2 transition-colors hover:border-dashed hover:border-[#1e1e24]/25 hover:bg-[#f7f6f1]/70 dark:hover:border-[#d4d4dc]/25 dark:hover:bg-[#1f1f26]/70">
      <div className="mb-1 flex items-center justify-between gap-2">
        {title ? (
          <span className="font-mono-label text-[11px] text-[var(--ink-muted)]">
            {title}
          </span>
        ) : (
          <span className="sr-only">{language ?? 'code'} snippet</span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="font-mono-label ml-auto inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#1e1e24]/20 bg-[var(--surface-bg)] px-2 py-0.5 text-[11px] text-[var(--ink-muted)] opacity-75 transition-opacity hover:border-[#6965db] hover:text-[#6965db] group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 dark:border-[#d4d4dc]/20 dark:hover:border-[#a8a5ff] dark:hover:text-[#a8a5ff]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy{language ? ` ${language}` : ''}</span>
            </>
          )}
        </button>
      </div>

      <pre
        className={`overflow-x-auto pb-1 ${
          monoCode
            ? 'font-mono-label text-[0.82em] leading-[1.58]'
            : 'font-excali text-[0.95em] leading-[1.48]'
        }`}
      >
        <code className={monoCode ? 'font-mono-label' : 'font-excali'}>
          {lines.map((line, idx) => {
            const trimmed = line.trimStart();
            const isComment = trimmed.startsWith('#') || trimmed.startsWith('//');
            return (
              <span
                key={idx}
                className={`block ${
                  isComment ? 'text-[#575766] dark:text-[#9c9cb0]' : ''
                }`}
              >
                {line || ' '}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function FormulaSketchBlock({
  question,
  lines,
  caveat,
  monoCode,
}: {
  question: string;
  lines: string[];
  caveat?: string;
  monoCode: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const payload = [question, ...lines, ...(caveat ? [caveat] : [])].join('\n');
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="group relative rounded-xl border border-transparent p-2 -mx-2 transition-colors hover:border-dashed hover:border-[#1e1e24]/25 hover:bg-[#f7f6f1]/70 dark:hover:border-[#d4d4dc]/25 dark:hover:bg-[#1f1f26]/70">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy calculation"
        className="font-mono-label absolute top-2 right-2 inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#1e1e24]/20 bg-[var(--surface-bg)] px-2 py-0.5 text-[11px] text-[var(--ink-muted)] opacity-75 transition-opacity hover:border-[#6965db] hover:text-[#6965db] group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 dark:border-[#d4d4dc]/20 dark:hover:border-[#a8a5ff] dark:hover:text-[#a8a5ff]"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3 w-3" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      <p className="pr-16 font-medium">{question}</p>
      <div
        className={`mt-1 space-y-0.5 ${
          monoCode ? 'font-mono-label text-[0.84em] leading-[1.6]' : 'font-excali'
        }`}
      >
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      {caveat && (
        <p className="mt-1 text-[0.95em] text-[#575766] dark:text-[#a3a3b2]">
          {caveat}
        </p>
      )}
    </div>
  );
}

function renderInlineSpecialTokens(text: string) {
  const parts = text.split(/(<\|[^|]+\|>)/g);
  return parts.map((part, idx) =>
    /^<\|[^|]+\|>$/.test(part) ? (
      <span
        key={idx}
        className="font-mono-label mx-0.5 inline-block rounded bg-[#ecebff] px-1 py-0.25 text-[0.8em] text-[#4a46b5] [font-variant-ligatures:none] dark:bg-[#353263] dark:text-[#d5d3ff]"
      >
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    ),
  );
}

function ChatSketchBlock({
  title,
  turns,
  caption,
}: {
  title?: string;
  turns: TilChatTurn[];
  caption?: string;
}) {
  return (
    <div className="ml-2 max-w-[420px] rounded-xl border border-dashed border-[#1e1e24]/25 bg-[#faf9f5]/90 p-3.5 shadow-[2px_2px_0px_rgba(30,30,36,0.08)] sm:ml-5 dark:border-[#d4d4dc]/25 dark:bg-[#1c1c22]/90 dark:shadow-[2px_2px_0px_rgba(0,0,0,0.25)]">
      {title && (
        <div className="font-mono-label mb-2.5 flex items-center gap-1.5 border-b border-dashed border-[#1e1e24]/15 pb-1.5 text-[10.5px] tracking-wide text-[var(--ink-muted)] dark:border-[#d4d4dc]/15">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-[#6965db] dark:bg-[#a8a5ff]"
          />
          <span>{title}</span>
        </div>
      )}

      <div className="space-y-2.5 text-[0.86em] leading-[1.42]">
        {turns.map((turn, idx) => {
          const isUser = turn.role === 'user';
          const label = turn.speaker ?? (isUser ? 'You' : 'ChatGPT');
          return (
            <div key={idx} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={`mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${
                  isUser
                    ? 'bg-emerald-600 dark:bg-emerald-500'
                    : 'bg-[#7c69db] dark:bg-[#8b7cf0]'
                }`}
              >
                {isUser ? 'U' : 'G'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono-label text-[10px] font-semibold tracking-wide text-[var(--ink-muted)]">
                  {label}
                </p>
                <p className="mt-0.5 text-[var(--ink)]">
                  {renderInlineSpecialTokens(turn.text)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {caption && (
        <p className="mt-3 border-t border-dashed border-[#1e1e24]/15 pt-2 text-[0.82em] leading-[1.4] text-[#575766] dark:border-[#d4d4dc]/15 dark:text-[#a3a3b2]">
          ↳ {caption}
        </p>
      )}
    </div>
  );
}

function ImageSketchBlock({
  src,
  alt,
  caption,
  maxWidth,
}: {
  src: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <figure className="my-1" style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-dashed border-[#1e1e24]/25 bg-[var(--surface-bg)] p-2 text-left transition-colors hover:border-[#6965db] dark:border-[#d4d4dc]/25 dark:hover:border-[#a8a5ff]"
      >
        <img src={src} alt={alt} className="h-auto w-full rounded-lg" />
      </button>
      {caption && (
        <figcaption className="mt-1.5 text-[0.85em] text-[#575766] dark:text-[#a3a3b2]">
          ↳ {caption}
        </figcaption>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-[#121212]/75 p-4 backdrop-blur-xs"
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[88vh] max-w-[92vw] rounded-xl border border-[#d4d4dc]/30 bg-white p-2 shadow-2xl"
          />
        </div>
      )}
    </figure>
  );
}

function PreVsPostLnDiagram({ caption }: { caption?: string }) {
  return (
    <figure className="rounded-xl border border-dashed border-[#1e1e24]/20 bg-[#faf9f5]/80 p-4 dark:border-[#d4d4dc]/20 dark:bg-[#1c1c22]/80">
      <svg
        viewBox="0 0 430 330"
        className="mx-auto h-auto w-full max-w-[420px] text-[var(--ink)]"
        role="img"
        aria-label="Post-LN versus Pre-LN Transformer residual stream diagram"
      >
        <defs>
          <marker
            id="til-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="currentColor" />
          </marker>
        </defs>

        {/* Column headers */}
        <text
          x="98"
          y="16"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="currentColor"
          opacity="0.7"
        >
          Post-LN (Original)
        </text>
        <text
          x="306"
          y="16"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="currentColor"
          opacity="0.7"
        >
          Pre-LN (Modern)
        </text>

        {/* === LEFT: POST-LN === */}
        {/* Residual highway */}
        <path
          d="M 62 308 L 62 46 L 48 46 L 72 24 L 96 46 L 82 46 L 82 308 Z"
          className="fill-[#e6d5c3] dark:fill-[#3b332b]"
        />
        <line
          x1="72"
          y1="296"
          x2="72"
          y2="46"
          stroke="currentColor"
          strokeWidth="1.5"
          markerEnd="url(#til-arrow)"
        />
        <text x="72" y="320" textAnchor="middle" fontSize="13" fontStyle="italic" fill="currentColor">
          xₗ
        </text>
        <text x="72" y="40" textAnchor="middle" fontSize="13" fontStyle="italic" fill="currentColor">
          xₗ₊₁
        </text>

        {/* Branch 1: Multi-Head Attention */}
        <path
          d="M 72 282 L 146 266 L 146 254"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />
        <rect
          x="108"
          y="220"
          width="76"
          height="32"
          rx="4"
          className="fill-[#fde68a] stroke-[#1e1e24] dark:fill-[#715b16] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="146" y="234" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Multi-Head
        </text>
        <text x="146" y="246" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Attention
        </text>
        <path
          d="M 146 220 L 146 208 L 106 198"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />

        {/* Addition 1 */}
        <rect
          x="42"
          y="186"
          width="60"
          height="22"
          rx="4"
          className="fill-white stroke-[#1e1e24] dark:fill-[#26262f] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="72" y="200" textAnchor="middle" fontSize="10.5" fill="currentColor">
          addition
        </text>

        {/* Layer Norm 1 (on highway) */}
        <rect
          x="36"
          y="150"
          width="72"
          height="22"
          rx="4"
          className="fill-[#c7e6a3] stroke-[#1e1e24] dark:fill-[#2e5224] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="72" y="164" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Layer Norm
        </text>

        {/* Branch 2: FFN */}
        <path
          d="M 72 142 L 146 132 L 146 124"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />
        <rect
          x="114"
          y="100"
          width="64"
          height="22"
          rx="4"
          className="fill-[#bfdbfe] stroke-[#1e1e24] dark:fill-[#22406e] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="146" y="114" textAnchor="middle" fontSize="10.5" fill="currentColor">
          FFN
        </text>
        <path
          d="M 146 100 L 146 92 L 106 86"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />

        {/* Addition 2 */}
        <rect
          x="42"
          y="75"
          width="60"
          height="22"
          rx="4"
          className="fill-white stroke-[#1e1e24] dark:fill-[#26262f] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="72" y="89" textAnchor="middle" fontSize="10.5" fill="currentColor">
          addition
        </text>

        {/* Layer Norm 2 (on highway) */}
        <rect
          x="36"
          y="46"
          width="72"
          height="20"
          rx="4"
          className="fill-[#c7e6a3] stroke-[#1e1e24] dark:fill-[#2e5224] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="72" y="59" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Layer Norm
        </text>

        {/* === RIGHT: PRE-LN === */}
        {/* Clean unobstructed residual highway */}
        <path
          d="M 270 308 L 270 46 L 256 46 L 280 24 L 304 46 L 290 46 L 290 308 Z"
          className="fill-[#e6d5c3] dark:fill-[#3b332b]"
        />
        <line
          x1="280"
          y1="296"
          x2="280"
          y2="46"
          stroke="currentColor"
          strokeWidth="1.5"
          markerEnd="url(#til-arrow)"
        />
        <text x="280" y="320" textAnchor="middle" fontSize="13" fontStyle="italic" fill="currentColor">
          xₗ
        </text>
        <text x="280" y="40" textAnchor="middle" fontSize="13" fontStyle="italic" fill="currentColor">
          xₗ₊₁
        </text>

        {/* Branch 1: Layer Norm -> Multi-Head Attention */}
        <path
          d="M 280 282 L 354 270 L 354 264"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />
        <rect
          x="318"
          y="240"
          width="72"
          height="22"
          rx="4"
          className="fill-[#c7e6a3] stroke-[#1e1e24] dark:fill-[#2e5224] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="354" y="254" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Layer Norm
        </text>
        <line
          x1="354"
          y1="240"
          x2="354"
          y2="228"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />
        <rect
          x="316"
          y="194"
          width="76"
          height="32"
          rx="4"
          className="fill-[#fde68a] stroke-[#1e1e24] dark:fill-[#715b16] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="354" y="208" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Multi-Head
        </text>
        <text x="354" y="220" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Attention
        </text>
        <path
          d="M 354 194 L 354 184 L 314 176"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />

        {/* Addition 1 */}
        <rect
          x="250"
          y="164"
          width="60"
          height="22"
          rx="4"
          className="fill-white stroke-[#1e1e24] dark:fill-[#26262f] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="280" y="178" textAnchor="middle" fontSize="10.5" fill="currentColor">
          addition
        </text>

        {/* Branch 2: Layer Norm -> FFN */}
        <path
          d="M 280 156 L 354 146 L 354 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />
        <rect
          x="318"
          y="116"
          width="72"
          height="22"
          rx="4"
          className="fill-[#c7e6a3] stroke-[#1e1e24] dark:fill-[#2e5224] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="354" y="130" textAnchor="middle" fontSize="10.5" fill="currentColor">
          Layer Norm
        </text>
        <line
          x1="354"
          y1="116"
          x2="354"
          y2="104"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />
        <rect
          x="322"
          y="80"
          width="64"
          height="22"
          rx="4"
          className="fill-[#bfdbfe] stroke-[#1e1e24] dark:fill-[#22406e] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="354" y="94" textAnchor="middle" fontSize="10.5" fill="currentColor">
          FFN
        </text>
        <path
          d="M 354 80 L 354 72 L 314 66"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          markerEnd="url(#til-arrow)"
        />

        {/* Addition 2 */}
        <rect
          x="250"
          y="55"
          width="60"
          height="22"
          rx="4"
          className="fill-white stroke-[#1e1e24] dark:fill-[#26262f] dark:stroke-[#d4d4dc]"
          strokeWidth="1.4"
        />
        <text x="280" y="69" textAnchor="middle" fontSize="10.5" fill="currentColor">
          addition
        </text>
      </svg>

      {caption && (
        <figcaption className="mt-2.5 text-center text-[0.84em] text-[#575766] dark:text-[#a3a3b2]">
          ↳ {caption}
        </figcaption>
      )}
    </figure>
  );
}

function MathFractionBlock({
  lead,
  highlight,
  description,
  lhs,
  numerator,
  denominator,
  suffix,
}: {
  lead?: string;
  highlight?: string;
  description?: string;
  lhs: string;
  numerator: string;
  denominator: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#1e1e24]/20 bg-[#faf9f5]/80 px-5 py-4 dark:border-[#d4d4dc]/20 dark:bg-[#1c1c22]/80">
      {(lead || highlight || description) && (
        <p className="text-center text-[0.95em] leading-snug">
          {lead && <span>{lead} </span>}
          {highlight && <strong className="font-bold">{highlight}</strong>}
          {description && <span> – {description}</span>}
        </p>
      )}

      <div className="font-mono-label mt-4 flex flex-wrap items-center justify-center gap-2 text-[1.02em]">
        <span>{lhs}</span>
        <span className="inline-flex flex-col items-center leading-tight">
          <span className="border-b border-current px-2 pb-1">{numerator}</span>
          <span className="px-2 pt-1">{denominator}</span>
        </span>
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
}

function renderBlock(block: TilBlock, idx: number, monoCode: boolean) {
  switch (block.type) {
    case 'header-box':
      return (
        <div
          key={idx}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
        >
          <SketchBox
            tone={block.tone ?? 'default'}
            className="min-h-[112px] min-w-[168px] shrink-0 items-center justify-center px-7 py-6"
          >
            <div className="flex flex-col items-start justify-center leading-snug">
              {block.boxLines.map((line, lineIdx) => (
                <span key={lineIdx} className="block text-[1.06em]">
                  {line}
                </span>
              ))}
            </div>
          </SketchBox>

          {block.besideLines && block.besideLines.length > 0 && (
            <div className="space-y-0.5 text-[0.96em] leading-[1.45]">
              {block.besideLines.map((line, lineIdx) => (
                <p key={lineIdx}>{line}</p>
              ))}
            </div>
          )}
        </div>
      );

    case 'box':
      return (
        <SketchBox
          key={idx}
          tone={block.tone ?? 'default'}
          className="w-full px-5 py-4"
        >
          <div className={block.align === 'center' ? 'text-center' : 'text-left'}>
            {block.title && (
              <p className="mb-1 text-[1.05em] font-bold">{block.title}</p>
            )}
            <div className="space-y-0.5">
              {block.lines.map((line, lineIdx) => (
                <p key={lineIdx}>{line}</p>
              ))}
            </div>
          </div>
        </SketchBox>
      );

    case 'text':
      return (
        <div
          key={idx}
          className={`space-y-0.5 leading-[1.5] ${
            block.muted ? 'text-[#575766] dark:text-[#a3a3b2]' : ''
          }`}
        >
          {block.heading && (
            <h4 className="mb-1 text-[1.06em] font-bold">{block.heading}</h4>
          )}
          {block.lines.map((line, lineIdx) => (
            <p key={lineIdx}>{line}</p>
          ))}
        </div>
      );

    case 'list': {
      const start = block.start ?? 1;
      return (
        <div key={idx} className="space-y-1">
          {block.heading && (
            <h4 className="mb-1 text-[1.05em] font-bold">{block.heading}</h4>
          )}
          <div className="space-y-1 leading-[1.5]">
            {block.items.map((item, itemIdx) => (
              <div key={itemIdx}>
                <div className="flex items-start gap-2">
                  <span className="shrink-0 select-none">
                    {block.ordered ? `${start + itemIdx}.` : '-'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p>{item.text}</p>
                    {item.subitems && item.subitems.length > 0 && (
                      <ul className="mt-0.5 space-y-0.5 pl-4">
                        {item.subitems.map((sub, subIdx) => (
                          <li key={subIdx} className="flex items-start gap-2">
                            <span className="shrink-0 select-none">-</span>
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.note && (
                      <p className="mt-1.5 ml-4 rounded-lg border border-dashed border-[#1e1e24]/20 bg-[#fdfcf8] px-3 py-1.5 text-[0.88em] text-[#575766] dark:border-[#d4d4dc]/20 dark:bg-[#1e1e24] dark:text-[#a3a3b2]">
                        ↳ {item.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'kv':
      return (
        <div key={idx} className="space-y-1">
          {block.heading && (
            <h4 className="mb-1 text-[1.05em] font-bold">{block.heading}</h4>
          )}
          <div className="space-y-0.5 leading-[1.48]">
            {block.rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-1 gap-x-2 sm:grid-cols-[minmax(130px,auto)_1fr]"
              >
                <span className="whitespace-nowrap">{row.key}</span>
                <span>
                  <span className="mr-1.5 select-none">-</span>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'code':
      return (
        <CodeSketchBlock
          key={idx}
          title={block.title}
          language={block.language}
          code={block.code}
          monoCode={monoCode}
        />
      );

    case 'formula':
      return (
        <FormulaSketchBlock
          key={idx}
          question={block.question}
          lines={block.lines}
          caveat={block.caveat}
          monoCode={monoCode}
        />
      );

    case 'chat':
      return (
        <ChatSketchBlock
          key={idx}
          title={block.title}
          turns={block.turns}
          caption={block.caption}
        />
      );

    case 'image':
      return (
        <ImageSketchBlock
          key={idx}
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          maxWidth={block.maxWidth}
        />
      );

    case 'diagram':
      return <PreVsPostLnDiagram key={idx} caption={block.caption} />;

    case 'math':
      return (
        <MathFractionBlock
          key={idx}
          lead={block.lead}
          highlight={block.highlight}
          description={block.description}
          lhs={block.lhs}
          numerator={block.numerator}
          denominator={block.denominator}
          suffix={block.suffix}
        />
      );

    case 'callout':
      return (
        <div
          key={idx}
          className={`rounded-xl border border-dashed border-[#1e1e24]/30 px-4 py-3 dark:border-[#d4d4dc]/30 ${
            TONE_FILL[block.tone ?? 'yellow']
          }`}
        >
          {block.label && (
            <p className="font-mono-label mb-1 text-[11px] tracking-wide uppercase opacity-75">
              {block.label}
            </p>
          )}
          <div className="space-y-0.5">
            {block.lines.map((line, lineIdx) => (
              <p key={lineIdx}>{line}</p>
            ))}
          </div>
        </div>
      );

    case 'divider':
      return (
        <div key={idx} className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 border-t border-dashed border-[#1e1e24]/25 dark:border-[#d4d4dc]/25" />
          {block.label && (
            <span className="font-mono-label text-[11px] text-[var(--ink-muted)]">
              {block.label}
            </span>
          )}
          <div className="h-px flex-1 border-t border-dashed border-[#1e1e24]/25 dark:border-[#d4d4dc]/25" />
        </div>
      );
  }
}

function getSplitGridClass(split?: TilSection['split']) {
  switch (split) {
    case '50-50':
      return 'lg:grid-cols-2';
    case '40-60':
      return 'lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]';
    case '45-55':
    default:
      return 'lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]';
  }
}

const ZOOM_STEPS = [85, 100, 115] as const;

export function ExcaliBoard({
  entry,
  compactHeader = false,
  headingAsH1 = false,
}: ExcaliBoardProps) {
  const [showGrid, setShowGrid] = useState(false);
  const [monoCode, setMonoCode] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const zoomPercent = ZOOM_STEPS[zoomIdx];
  const fontSizePx = Number(((15 * zoomPercent) / 100).toFixed(1));

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  const handleCopyPermalink = async () => {
    const url = `${window.location.origin}/til/${entry.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const boardContent = (
    <article
      className={`excali-paper relative overflow-hidden ${
        showGrid ? 'excali-paper-grid' : ''
      } ${expanded ? 'flex h-full max-h-[92vh] w-full max-w-[1380px] flex-col' : ''}`}
    >
      {/* Top Excalidraw-inspired board bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[#1e1e24]/15 bg-[#faf9f5]/90 px-4 py-3 sm:px-6 dark:border-[#d4d4dc]/15 dark:bg-[#1b1b20]/90">
        <div className="flex flex-wrap items-center gap-2.5">
          <time
            dateTime={entry.date}
            className="sketch-pill sketch-pill-lavender font-mono-label text-xs"
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatTilDate(entry.date)}</span>
          </time>

          {!compactHeader &&
            (headingAsH1 ? (
              <h1 className="font-sketch text-2xl leading-tight font-bold text-[var(--ink)]">
                {entry.title}
              </h1>
            ) : (
              <h2 className="font-sketch text-2xl leading-tight font-bold text-[var(--ink)]">
                {entry.title}
              </h2>
            ))}
        </div>

        {/* Whiteboard tools */}
        <div className="font-mono-label flex flex-wrap items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMonoCode((prev) => !prev)}
            title="Toggle handwritten vs monospace code font"
            className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 transition-colors ${
              monoCode
                ? 'border-[#6965db] bg-[#e0dfff] text-[#4a46b5] dark:border-[#a8a5ff] dark:bg-[#353263] dark:text-[#c5c3ff]'
                : 'border-[#1e1e24]/20 bg-[var(--surface-bg)] text-[var(--ink-muted)] hover:text-[var(--ink)] dark:border-[#d4d4dc]/20'
            }`}
          >
            {monoCode ? <Code2 className="h-3.5 w-3.5" /> : <Type className="h-3.5 w-3.5" />}
            <span>{monoCode ? 'Mono code' : 'Excali font'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGrid((prev) => !prev)}
            title="Toggle dot grid"
            className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 transition-colors ${
              showGrid
                ? 'border-[#6965db] bg-[#e0dfff] text-[#4a46b5] dark:border-[#a8a5ff] dark:bg-[#353263] dark:text-[#c5c3ff]'
                : 'border-[#1e1e24]/20 bg-[var(--surface-bg)] text-[var(--ink-muted)] hover:text-[var(--ink)] dark:border-[#d4d4dc]/20'
            }`}
          >
            <Grid2x2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          <div className="inline-flex items-center rounded-lg border border-[#1e1e24]/20 bg-[var(--surface-bg)] dark:border-[#d4d4dc]/20">
            <button
              type="button"
              onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
              disabled={zoomIdx === 0}
              aria-label="Zoom out"
              className="cursor-pointer px-1.5 py-1 text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-1.5 text-[11px] text-[var(--ink-muted)] select-none">
              {zoomPercent}%
            </span>
            <button
              type="button"
              onClick={() => setZoomIdx((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
              disabled={zoomIdx === ZOOM_STEPS.length - 1}
              aria-label="Zoom in"
              className="cursor-pointer px-1.5 py-1 text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyPermalink}
            title="Copy link to this TIL board"
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#1e1e24]/20 bg-[var(--surface-bg)] px-2 py-1 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] dark:border-[#d4d4dc]/20"
          >
            {linkCopied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{linkCopied ? 'Copied' : 'Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            title={expanded ? 'Exit fullscreen' : 'Expand whiteboard'}
            aria-label={expanded ? 'Exit fullscreen' : 'Expand whiteboard'}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#1e1e24]/20 bg-[var(--surface-bg)] p-1.5 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] dark:border-[#d4d4dc]/20"
          >
            {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Excalidraw whiteboard canvas (100% real selectable text) */}
      <div
        className={`font-excali px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 ${
          expanded ? 'flex-1 overflow-y-auto' : ''
        }`}
        style={{ fontSize: `${fontSizePx}px` }}
      >
        <div className="space-y-12">
          {entry.sections.map((section, sIdx) => {
            if (section.layout === 'two-col') {
              return (
                <div
                  key={sIdx}
                  className={`grid grid-cols-1 gap-10 lg:gap-12 ${getSplitGridClass(
                    section.split,
                  )}`}
                >
                  <div className="space-y-6">
                    {(section.left ?? []).map((block, bIdx) =>
                      renderBlock(block, bIdx, monoCode),
                    )}
                  </div>
                  <div className="space-y-6">
                    {(section.right ?? []).map((block, bIdx) =>
                      renderBlock(block, bIdx, monoCode),
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div key={sIdx} className="max-w-3xl space-y-6">
                {(section.blocks ?? []).map((block, bIdx) =>
                  renderBlock(block, bIdx, monoCode),
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom tags strip */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[#1e1e24]/15 bg-[#faf9f5]/70 px-4 py-2.5 sm:px-6 dark:border-[#d4d4dc]/15 dark:bg-[#1b1b20]/70">
          <div className="flex flex-wrap items-center gap-1.5">
            {entry.tags.map((tag, idx) => (
              <span
                key={tag}
                className={`sketch-pill ${PILL_VARIANTS[idx % PILL_VARIANTS.length]} text-xs`}
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="font-mono-label text-[11px] text-[var(--ink-muted)]">
            Selectable text canvas · {entry.date}
          </span>
        </div>
      )}
    </article>
  );

  if (expanded) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`TIL whiteboard ${entry.date}: ${entry.title}`}
        onClick={() => setExpanded(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/70 p-3 backdrop-blur-xs sm:p-6"
      >
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[1380px]">
          {boardContent}
        </div>
      </div>
    );
  }

  return boardContent;
}
