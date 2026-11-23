import { EXPERIENCE } from '../data/profile';

const PILL_VARIANTS = [
  'sketch-pill-lavender',
  'sketch-pill-mint',
  'sketch-pill-yellow',
  'sketch-pill-sky',
] as const;

export function Experience() {
  return (
    <section id="experience" className="py-12 sm:py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-sketch text-4xl font-bold tracking-tight text-[var(--ink)]">
          Experience
        </h2>
        <span className="font-mono-label text-xs text-[var(--ink-muted)]">
          Resume &amp; career highlights
        </span>
      </div>

      <div className="relative mt-8 space-y-8 border-l-2 border-dashed border-[#1e1e24]/30 pl-6 sm:pl-8 dark:border-[#d4d4dc]/30">
        {EXPERIENCE.map((item) => (
          <article key={`${item.company}-${item.period}`} className="relative">
            {/* Hand-drawn sketchy circle marker */}
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="absolute top-6 -left-[35px] h-5 w-5 sm:-left-[43px]"
            >
              <path
                d="M10.4 2.3C14.8 2.1 18.1 5.6 17.8 10.2C17.5 14.7 14.2 17.9 9.7 17.7C5.1 17.5 2.1 14.3 2.3 9.8C2.5 5.3 5.9 2.5 10.4 2.3Z"
                className="fill-[#e0dfff] stroke-[#6965db] dark:fill-[#353263] dark:stroke-[#a8a5ff]"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="10"
                cy="10"
                r="2.4"
                className="fill-[#6965db] dark:fill-[#a8a5ff]"
              />
            </svg>

            <div className="sketch-card p-6 sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-sketch text-2xl leading-snug font-bold text-[var(--ink)] sm:text-[1.7rem]">
                    {item.role}
                  </h3>
                  <p className="text-base text-[var(--ink-muted)]">
                    {item.company} · {item.location}
                  </p>
                </div>
                <time className="sketch-pill sketch-pill-lavender font-mono-label w-fit text-[11px] tracking-wide uppercase">
                  {item.period}
                </time>
              </div>

              <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink)]/90">
                {item.summary}
              </p>

              {item.highlights.length > 0 && (
                <ul className="mt-3.5 list-disc space-y-1.5 pl-5 text-[16.5px] leading-relaxed text-[var(--ink-muted)] marker:text-[#6965db] dark:marker:text-[#a8a5ff]">
                  {item.highlights.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag, idx) => (
                  <span
                    key={tag}
                    className={`sketch-pill ${PILL_VARIANTS[idx % PILL_VARIANTS.length]} text-sm`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
