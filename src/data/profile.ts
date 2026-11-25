export interface SocialLink {
  label: string;
  href: string;
  kind: 'github' | 'linkedin' | 'email' | 'website';
}

export interface ExperienceItem {
  role: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  coursework: string[];
}

export interface RecognitionItem {
  title: string;
  detail: string;
  href?: string;
  linkLabel?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export const RESUME_PDF_PATH = 'Tushar_Gupta_Resume.pdf';

export const EXPERIENCE_SUMMARY =
  'Staff-level engineer and tech lead with 9+ years across high-scale fintech (Grab, Cashfree) and healthcare AI (Insight Health). Led teams of up to 7 engineers; currently leading AI document-processing, prior-authorization, and EHR-integration platforms (19 EHRs) behind 3M+ patient conversations, built HIPAA-first with LLMs and agentic workflows.';

export const PROFILE = {
  name: 'Tushar Gupta',
  handle: 'knowtushar',
  headline:
    'I care about the mind, the body, and how much further humans can go when they actually test their limits.',
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
    company: 'Insight Health AI',
    period: 'August 2024 – Present',
    summary:
      'Leading AI document-processing, prior-authorization, and EHR-integration platforms across 19 EHRs behind 3M+ patient conversations, built HIPAA-first with LLMs and agentic workflows.',
    highlights: [
      'Built 17 net-new EHR integrations end to end (scheduling, documents, notes, tasks, messaging, auth), growing platform coverage to 19 EHRs; 2026 work spans Veradigm Unity, eClinicalWorks (SMART Backend Services), Ontada iKnowMed FHIR R4, Crystal PM, and ModMed (MMI API, gGastro HL7).',
      'Tech-led the AI Waitlist Optimiser, autonomously filling canceled appointment slots via multi-channel outreach (voice, SMS, chat, email); owned architecture across 4 services and recovered 23% of previously lost slot revenue for pilot clinics.',
      'Designed and built a HIPAA-governed workflow-capture platform (POC in 7 weeks): .NET 8 Windows recorder (H.264 video, browser DOM snapshots), AES-256-GCM sealed uploads to KMS-encrypted S3, Flask/Celery API & workers, Terraform infra, and reviewer player.',
      'Owned core engine work on the AI Fax Agent: launched Kno2 fax intake, built document filing into 4 EHRs (Veradigm, Ontada iKnowMed, AdvancedMD, Aprima), and made ~900 filings/week batch-safe with a transient/permanent outcome contract, Redis concurrency cap, and spaced retries.',
      'Built 3-layer cross-document duplicate detection (source, byte hash, Gemini triage-then-confirm cascade) with date-of-service and type gates to bound LLM cost, packet rollup UI, and dry-run eval harness; enabled for 3 customers.',
      'Led Criteria Watch for prior-auth readiness across a 1,763-resource payer/procedure matrix: per-host parallel sweeps (~3x faster), link crawling, P1 alerts, OpenAI Agents SDK + Playwright discovery agent, and 560+ Cursor Cloud agent batches to classify, compile, and route policies.',
      'Led insurance eligibility verification on Stedi X12 270/271 (payer-alias mapping, eligibility/MBI/discovery decision tree, LLM payer matching) and nationwide record retrieval over TEFCA/Carequality via Kno2 QHIN with scored patient matching.',
      'Expanded the AI phone agent with 65 tools across 6 integration modules (Veradigm, eClinicalWorks, Crystal PM, Office Practicum, OP RCM, iKnowMed) via a unified integrations client for autonomous appointment lifecycle, messaging, and case management.',
      'Led performance engineering: cut hot-table load by 90% (from 45K queries/sec) via Redis caching, took a key appointment endpoint from 6s to sub-second, collapsed N+1 bulk uploads from 1,500 DB calls to 1, scaled EHR sync 10x, fixed a Celery memory leak, and unblocked read replicas via a 3-service repository-pattern migration.',
      'Remediated 20+ High-severity findings from the 2026 pen test and automated security scans (cross-tenant IDOR, attacker-controlled JWT keys, SQLi, pickle RCE, SSRF, ReDoS, CI supply chain) and built a CI PHI-logging guard with log redaction across 5 services.',
      'Led the data-retention program (automated archival and hard delete); restored recordings, transcripts, and summaries for 3 orgs via staged idempotent backfills and rolled a test-DB safety guard out to all 11 backend repos.',
      'Mentored mid-level engineers through design reviews and pairing; built internal AI tooling including an EHR sub-agent (Athena, AdvancedMD) for the company AI SRE.',
    ],
    tags: [
      'Python',
      'Flask',
      'Celery',
      'PostgreSQL',
      'Redis',
      'Kafka',
      'AWS',
      'Kubernetes',
      'Terraform',
      'TypeScript/React',
      'C#/.NET 8',
      'FHIR R4',
      'HL7v2',
      'X12 270/271',
      'OpenAI / Anthropic / Gemini',
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'Grab',
    period: 'July 2021 – August 2024',
    summary:
      'Tech lead across 3 fintech engineering teams delivering regional banking and Pay Later products across Southeast Asia.',
    highlights: [
      'Led 3 teams (14 engineers) delivering flagship fintech products across SEA: treasury banking (Indonesia, 4 eng), offline Pay Later (Singapore, 3 eng, +25% MTV), and a Pay Later platform (Malaysia, 7 eng, 10M+ users onboarded).',
      'Owned roadmap, delivery, and stakeholder alignment; ran hiring loops, performance reviews, 1:1s, and mentoring.',
      'Redesigned the whitelisting pipeline to process millions of requests efficiently, scaling peak throughput to 1,000/sec and unblocking growth campaigns.',
    ],
    tags: ['Java', 'Golang', 'AWS', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'Aerospike'],
  },
  {
    role: 'Product Engineer II',
    company: 'Cashfree Payments',
    period: 'March 2019 – June 2021',
    summary:
      'Early engineer on the core payments platform; designed and shipped high-throughput payment microservices from scratch during hyper-growth.',
    highlights: [
      'Re-architected the payment gateway in Golang, lifting average success rate by 6% via dynamic routing and materially cutting p99 latency.',
      'Converted external integration calls (payment partners, KYC, banking APIs) from blocking to non-blocking reactive I/O with RxJava, reducing JVM heap pressure, eliminating thread-pool exhaustion under burst load, and cutting cold-start warmup.',
      'Redesigned refund and reversal services: cut refund failure rate to 0.5%, reversal failure rate to 0.8%, and support queries from 26% to 3%.',
      'Built real-time anomaly detection and alerting for payment incidents, materially cutting mean-time-to-detect.',
    ],
    tags: [
      'Java',
      'Spring Boot',
      'Golang',
      'RxJava',
      'AWS',
      'MySQL',
      'MongoDB',
      'Redis',
      'Kafka',
      'Kong',
      'Prometheus',
    ],
  },
  {
    role: 'Security Engineer',
    company: 'Eligible',
    period: 'July 2017 – February 2019',
    summary:
      'Production security engineering and compliance automation in a HIPAA-regulated healthcare environment.',
    highlights: [
      'Built real-time anomaly detection and audit-grade incident capture for the production security stack.',
      'Drove engineering work for HITRUST and SOC 2 certification in a HIPAA-regulated environment.',
    ],
    tags: ['Ruby', 'Python', 'MySQL', 'AWS', 'HIPAA', 'HITRUST', 'SOC 2'],
  },
  {
    role: 'Software & Research Internships',
    company: 'Nucleus Software & Xerox Research',
    period: '2014 – 2016',
    summary:
      'Built automated codebase migration tooling and distributed clinical machine-learning models.',
    highlights: [
      'Nucleus Software (2016): Built an Electron + Java tool automating Spring MVC + JSP to AngularJS migration.',
      'Xerox Research (2014): Developed an ensemble model predicting ICU patient mortality, achieving 80% recall on a 128-core distributed cluster (XGBoost, scikit-learn).',
    ],
    tags: ['Java', 'Electron', 'Python', 'XGBoost', 'scikit-learn'],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    institution: 'IIT Mandi',
    degree: 'B.Tech., Computer Science and Engineering',
    period: '2013 – 2017',
    gpa: '8.12 / 10',
    coursework: [
      'Algorithms',
      'Artificial Intelligence',
      'Operating Systems',
      'Databases',
      'Distributed Systems',
    ],
  },
];

export const RECOGNITION: RecognitionItem[] = [
  {
    title: 'BrainSegNet (2017)',
    detail:
      'First-author novel stacked bidirectional-LSTM for brain fiber tractography segmentation; state-of-the-art results, oral presentation at BMVC 2017.',
    href: 'https://arxiv.org/abs/1710.05158',
    linkLabel: 'arXiv:1710.05158',
  },
  {
    title: '"The Grab Way" Top 5% Performer (2023)',
    detail: 'Recognized among the top 5% performers company-wide at Grab.',
  },
  {
    title: 'All-India Rank 4 — Xerox ML Challenge (2015)',
    detail: 'Placed 4th nationally in the Xerox Machine Learning Challenge.',
  },
  {
    title: 'Silver Medal — Inter-IIT Tech Meet (2016)',
    detail: 'Represented IIT Mandi and won Silver at Inter-IIT Tech Meet.',
  },
  {
    title: 'Academic Secretary — IIT Mandi (2015–16)',
    detail: 'Elected student academic representative for the institute.',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Languages',
    skills: ['Python', 'Golang', 'Java', 'TypeScript', 'C#', 'SQL', 'C++'],
  },
  {
    category: 'Backend & Data',
    skills: [
      'Flask',
      'FastAPI',
      'Spring Boot',
      'Celery',
      'SQLAlchemy',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis',
      'Kafka',
    ],
  },
  {
    category: 'Infra & Frontend',
    skills: [
      'AWS (EKS, S3, KMS, SQS, Bedrock)',
      'Kubernetes',
      'Helm',
      'Docker',
      'Terraform',
      'Buildkite',
      'Datadog',
      'Prometheus',
      'React',
      'Next.js',
      '.NET 8',
    ],
  },
  {
    category: 'Healthcare & AI',
    skills: [
      'FHIR R4',
      'HL7v2',
      'SMART on FHIR',
      'X12 270/271',
      'TEFCA/QHIN',
      'HIPAA / SOC 2',
      'OpenAI',
      'Anthropic',
      'Gemini',
      'OpenAI Agents SDK',
      'Claude Agent SDK',
      'LLM Evals',
      'Agentic Workflows',
    ],
  },
  {
    category: 'Leadership',
    skills: [
      'Tech Lead (teams of 3–7)',
      'Hiring',
      'Performance Reviews',
      'Architecture Reviews',
      'Cross-Functional Delivery',
    ],
  },
];
