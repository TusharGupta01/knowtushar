import { EXPERIENCE } from '../data/profile';

export function Experience() {
  return (
    <section id="experience" className="py-14">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Experience
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          Resume &amp; career highlights
        </span>
      </div>

      <div className="mt-8 space-y-10">
        {EXPERIENCE.map((item) => (
          <article
            key={`${item.company}-${item.period}`}
            className="relative border-l border-zinc-200 pl-6 dark:border-zinc-800"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-600 dark:border-zinc-950 dark:bg-emerald-400"
            />

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.role}
                </h3>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {item.company} · {item.location}
                </p>
              </div>
              <time className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
                {item.period}
              </time>
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {item.summary}
            </p>

            {item.highlights.length > 0 && (
              <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.highlights.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
