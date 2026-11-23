import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const seedPath = resolve(root, 'src/data/notes.seed.json');
const outDir = resolve(root, 'public/data');
const outPath = resolve(outDir, 'knowtushar.sqlite');

const seed = JSON.parse(readFileSync(seedPath, 'utf8'));

const SQL = await initSqlJs({
  locateFile: (file) => resolve(root, 'node_modules/sql.js/dist', file),
});

const db = new SQL.Database();

db.run(`
  CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    published_at TEXT NOT NULL,
    reading_minutes INTEGER NOT NULL DEFAULT 3,
    tags TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX idx_notes_published_at ON notes (published_at DESC);
`);

const stmt = db.prepare(`
  INSERT INTO notes (slug, title, summary, body, published_at, reading_minutes, tags)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const note of seed.notes) {
  stmt.run([
    note.slug,
    note.title,
    note.summary,
    note.body,
    note.published_at,
    note.reading_minutes,
    (note.tags || []).join(','),
  ]);
}
stmt.free();

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, Buffer.from(db.export()));
db.close();

console.log(`Built SQLite database (${seed.notes.length} notes) -> public/data/knowtushar.sqlite`);
