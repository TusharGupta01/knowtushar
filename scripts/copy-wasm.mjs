import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'node_modules/sql.js/dist/sql-wasm.wasm');
const destDir = resolve(root, 'public/wasm');
const dest = resolve(destDir, 'sql-wasm.wasm');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Copied sql-wasm.wasm -> public/wasm/sql-wasm.wasm`);
