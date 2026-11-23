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
    <section id="about" className="py-20">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
        <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        {PROFILE.location}
      </div>

      <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {PROFILE.name}
      </h1>

      {PROFILE.headline && (
        <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          {PROFILE.headline}
        </p>
      )}

      {PROFILE.about.length > 0 && (
        <div className="mt-6 space-y-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
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
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <SocialIcon kind={link.kind} />
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
