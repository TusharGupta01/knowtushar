import { Github, Globe, Linkedin, Mail, MapPin } from 'lucide-react';
import { PROFILE, type SocialLink } from '../data/profile';

function SocialIcon({ kind }: { kind: SocialLink['kind'] }) {
  switch (kind) {
    case 'github':
      return <Github className="h-4 w-4" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'website':
      return <Globe className="h-4 w-4" />;
  }
}

export function HeroAbout() {
  return (
    <section id="about" className="py-16 sm:py-20">
      <div className="sketch-card relative overflow-hidden p-8 sm:p-12">
        {/* Subtle hand-drawn corner sparkle accent */}
        <svg
          aria-hidden="true"
          viewBox="0 0 64 64"
          fill="none"
          className="pointer-events-none absolute top-5 right-5 h-11 w-11 text-[#6965db]/65 sm:top-6 sm:right-6 sm:h-12 sm:w-12 dark:text-[#a8a5ff]/60"
        >
          <path
            d="M32 8C32.8 19.5 34.5 28.5 46 31C35 33.2 32.8 41.5 31.5 53C30.2 41.2 28.2 33.2 17 31C28.2 28.5 30.8 19.8 32 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 11C50.4 14.5 51.2 16.2 54.5 17C51.2 17.7 50.4 19.6 50 23C49.5 19.6 48.7 17.8 45.5 17C48.7 16.2 49.5 14.5 50 11Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="48" r="2" fill="currentColor" />
        </svg>

        <div className="sketch-pill sketch-pill-lavender font-mono-label text-xs">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{PROFILE.location}</span>
        </div>

        <div className="mt-6 inline-block max-w-full">
          <h1 className="font-sketch text-5xl leading-none font-bold tracking-tight text-[var(--ink)] sm:text-6xl">
            {PROFILE.name}
          </h1>
          <svg
            aria-hidden="true"
            viewBox="0 0 260 16"
            fill="none"
            preserveAspectRatio="none"
            className="mt-1.5 h-3.5 w-full text-[#6965db] dark:text-[#a8a5ff]"
          >
            <path
              d="M3 10.5C58 4.2 168 3.5 256 9.8"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M18 13.8C86 9.5 174 8.8 238 12.6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>

        {PROFILE.headline && (
          <p className="mt-4 text-lg leading-relaxed text-[var(--ink-muted)]">
            {PROFILE.headline}
          </p>
        )}

        {PROFILE.about.length > 0 && (
          <div className="mt-5 space-y-3 text-base leading-7 text-[var(--ink-muted)]">
            {PROFILE.about.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {PROFILE.socials.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="sketch-btn inline-flex items-center gap-2 px-4 py-2 text-base font-medium"
            >
              <SocialIcon kind={link.kind} />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
