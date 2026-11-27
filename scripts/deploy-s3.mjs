import { execFileSync } from 'node:child_process';

const bucket = process.env.S3_BUCKET;
if (!bucket) {
  console.error('Missing S3_BUCKET environment variable.');
  console.error('Example: S3_BUCKET=knowtushar-site npm run deploy:s3');
  process.exit(1);
}

const run = (cmd, args) => {
  console.log(`> ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { stdio: 'inherit' });
};

run('npm', ['run', 'build']);

// Hashed assets & WASM: cache aggressively
run('aws', [
  's3',
  'sync',
  'dist/assets',
  `s3://${bucket}/assets`,
  '--delete',
  '--cache-control',
  'public, max-age=31536000, immutable',
]);

run('aws', [
  's3',
  'sync',
  'dist/wasm',
  `s3://${bucket}/wasm`,
  '--delete',
  '--cache-control',
  'public, max-age=31536000, immutable',
  '--content-type',
  'application/wasm',
]);

// SQLite DB: short cache so updates appear quickly
run('aws', [
  's3',
  'sync',
  'dist/data',
  `s3://${bucket}/data`,
  '--delete',
  '--cache-control',
  'public, max-age=300',
  '--content-type',
  'application/vnd.sqlite3',
]);

// Resume PDF
run('aws', [
  's3',
  'cp',
  'dist/Tushar_Gupta_Resume.pdf',
  `s3://${bucket}/Tushar_Gupta_Resume.pdf`,
  '--cache-control',
  'public, max-age=300',
  '--content-type',
  'application/pdf',
]);

// SEO files: sitemap.xml, robots.txt, feed.xml
run('aws', [
  's3',
  'cp',
  'dist/sitemap.xml',
  `s3://${bucket}/sitemap.xml`,
  '--cache-control',
  'public, max-age=300',
  '--content-type',
  'application/xml; charset=utf-8',
]);

run('aws', [
  's3',
  'cp',
  'dist/robots.txt',
  `s3://${bucket}/robots.txt`,
  '--cache-control',
  'public, max-age=300',
  '--content-type',
  'text/plain; charset=utf-8',
]);

run('aws', [
  's3',
  'cp',
  'dist/feed.xml',
  `s3://${bucket}/feed.xml`,
  '--cache-control',
  'public, max-age=300',
  '--content-type',
  'application/rss+xml; charset=utf-8',
]);

// Prerendered HTML pages (root + /experience + /notes + /til + /til/<slug>)
for (const dir of ['experience', 'notes', 'til']) {
  run('aws', [
    's3',
    'sync',
    `dist/${dir}`,
    `s3://${bucket}/${dir}`,
    '--delete',
    '--cache-control',
    'no-cache, no-store, must-revalidate',
    '--content-type',
    'text/html; charset=utf-8',
  ]);
}

run('aws', [
  's3',
  'cp',
  'dist/index.html',
  `s3://${bucket}/index.html`,
  '--cache-control',
  'no-cache, no-store, must-revalidate',
  '--content-type',
  'text/html; charset=utf-8',
]);

const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
if (distributionId) {
  run('aws', [
    'cloudfront',
    'create-invalidation',
    '--distribution-id',
    distributionId,
    '--paths',
    '/index.html',
    '/experience/*',
    '/notes/*',
    '/til/*',
    '/sitemap.xml',
    '/robots.txt',
    '/feed.xml',
    '/data/*',
    '/Tushar_Gupta_Resume.pdf',
  ]);
}

console.log(`Deployed dist/ to s3://${bucket}`);
