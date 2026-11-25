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
  headline:
    'I care about the mind, the body, and how much further humans can go when they actually test their limits.',
  location: 'Bengaluru / Remote',
  about: [
    'A lot of my days are small experiments on myself. Working out, running (20-minute 5K, 47-minute 10K so far), meditation, and breathing techniques. Right now I am following a strict low-GI diet: no milk, soy, meat, eggs, sugar, or high-GI fruits like watermelon. I like noticing what changes when you treat health, energy, and attention as things you can train.',
    'The other half is learning. Education should be a basic right, and forcing everyone through the same rigid syllabus feels archaic. Every kid thinks differently and moves at a different pace. I want to build personal AI that maps how an individual learns and adapts to them.',
    'Looking ahead, I believe the next real breakthroughs will happen in personal AI and robotics. Tools that stay close to everyday human life and help people grow beyond what they thought was possible.',
  ],
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/TusharGupta01',
      kind: 'github',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/tushar-g-60001487/',
      kind: 'linkedin',
    },
    {
      label: 'Email',
      href: 'mailto:tushar.behror@gmail.com',
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
