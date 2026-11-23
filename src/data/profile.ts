export interface SocialLink {
  label: string;
  href: string;
  kind: 'github' | 'linkedin' | 'email' | 'website';
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export const PROFILE = {
  name: 'Tushar Gupta',
  handle: 'knowtushar',
  headline: '',
  location: 'Bengaluru / Remote',
  about: [] as string[],
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/TusharGupta01',
      kind: 'github',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/',
      kind: 'linkedin',
    },
    {
      label: 'Email',
      href: 'mailto:hello@knowtushar.com',
      kind: 'email',
    },
  ] satisfies SocialLink[],
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Senior Software Engineer',
    company: 'Insight Health',
    location: 'Remote',
    period: 'Present',
    summary:
      'Building high-reliability healthcare integrations, data pipelines, and backend services connecting clinical workflows with major EHR platforms.',
    highlights: [
      'Architected fault-tolerant integration workflows with strict tenant isolation, idempotency, and fail-closed safety guards.',
      'Designed end-to-end document filing, patient matching, and task routing across REST, FHIR R4, and SOAP APIs.',
    ],
    tags: ['Python', 'PostgreSQL', 'AWS', 'FHIR', 'Distributed Systems'],
  },
];
