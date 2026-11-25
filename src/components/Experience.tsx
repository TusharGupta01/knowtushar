import { Award, Download, ExternalLink, FileText, GraduationCap, Wrench } from 'lucide-react';
import {
  EDUCATION,
  EXPERIENCE,
  EXPERIENCE_SUMMARY,
  RECOGNITION,
  RESUME_PDF_PATH,
  SKILL_GROUPS,
} from '../data/profile';

const PILL_VARIANTS = [
  'sketch-pill-lavender',
  'sketch-pill-mint',
  'sketch-pill-yellow',
  'sketch-pill-sky',
] as const;

function resumeAssetUrl(): string {
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${RESUME_PDF_PATH}`;
}

export function Experience() {
  const resumeHref = resumeAssetUrl();

  return (
    <section id="experience" className="py-12 sm:py-14">
      {/* Header + Resume actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-sketch text-4xl font-bold tracking-tight text-[var(--ink)]">
            Experience &amp; Resume
          </h2>
          <p className="mt-1.5 max-w-2xl text-base leading-relaxed text-[var(--ink-muted)]">
            {EXPERIENCE_SUMMARY}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <a
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="sketch-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium"
          >
            <FileText className="h-4 w-4 text-[#6965db] dark:text-[#a8a5ff]" />
            <span>View PDF</span>
          </a>
          <a
            href={resumeHref}
            download={RESUME_PDF_PATH}
            className="sketch-btn inline-flex items-center gap-1.5 border-[#6965db] bg-[#e0dfff] px-3.5 py-2 text-sm font-medium text-[#4a46b5] dark:border-[#a8a5ff] dark:bg-[#353263] dark:text-[#c5c3ff]"
          >
            <Download className="h-4 w-4" />
            <span>Download Resume</span>
          </a>
        </div>
      </div>

      {/* Employment Timeline */}
      <div className="relative mt-9 space-y-8 border-l-2 border-dashed border-[#1e1e24]/30 pl-6 sm:pl-8 dark:border-[#d4d4dc]/30">
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
                    {item.company}
                    {item.location ? ` · ${item.location}` : ''}
                  </p>
                </div>
                <time className="sketch-pill sketch-pill-lavender font-mono-label w-fit shrink-0 text-[11px] tracking-wide uppercase">
                  {item.period}
                </time>
              </div>

              <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink)]/90">
                {item.summary}
              </p>

              {item.highlights.length > 0 && (
                <ul className="mt-3.5 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-[var(--ink-muted)] marker:text-[#6965db] dark:marker:text-[#a8a5ff]">
                  {item.highlights.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={tag}
                    className={`sketch-pill ${PILL_VARIANTS[idx % PILL_VARIANTS.length]} text-xs`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Education */}
      <div className="mt-12">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#6965db] dark:text-[#a8a5ff]" />
          <h3 className="font-sketch text-3xl font-bold text-[var(--ink)]">Education</h3>
        </div>

        <div className="mt-4 space-y-4">
          {EDUCATION.map((edu) => (
            <div key={edu.institution} className="sketch-card p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="font-sketch text-2xl font-bold text-[var(--ink)]">
                    {edu.institution}
                  </h4>
                  <p className="text-base text-[var(--ink-muted)]">
                    {edu.degree} · GPA {edu.gpa}
                  </p>
                </div>
                <time className="sketch-pill sketch-pill-mint font-mono-label w-fit shrink-0 text-[11px] tracking-wide uppercase">
                  {edu.period}
                </time>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {edu.coursework.map((course, idx) => (
                  <span
                    key={course}
                    className={`sketch-pill ${PILL_VARIANTS[idx % PILL_VARIANTS.length]} text-xs`}
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Projects & Awards */}
      <div className="mt-12">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#6965db] dark:text-[#a8a5ff]" />
          <h3 className="font-sketch text-3xl font-bold text-[var(--ink)]">
            Selected Projects &amp; Awards
          </h3>
        </div>

        <div className="sketch-card mt-4 divide-y divide-dashed divide-[#1e1e24]/15 p-6 dark:divide-[#d4d4dc]/15">
          {RECOGNITION.map((item) => (
            <div key={item.title} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-sketch text-xl font-bold text-[var(--ink)]">
                  {item.title}
                </h4>
                {item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="sketch-pill sketch-pill-sky font-mono-label inline-flex items-center gap-1 text-xs transition-transform hover:-translate-y-0.5"
                  >
                    <span>{item.linkLabel ?? 'View'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="mt-1 text-base leading-relaxed text-[var(--ink-muted)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="mt-12">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-[#6965db] dark:text-[#a8a5ff]" />
          <h3 className="font-sketch text-3xl font-bold text-[var(--ink)]">
            Technical Skills
          </h3>
        </div>

        <div className="sketch-card mt-4 space-y-5 p-6">
          {SKILL_GROUPS.map((group, groupIdx) => (
            <div key={group.category}>
              <h4 className="font-mono-label text-xs tracking-wide text-[var(--ink-muted)] uppercase">
                {group.category}
              </h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`sketch-pill ${PILL_VARIANTS[groupIdx % PILL_VARIANTS.length]} text-xs`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
