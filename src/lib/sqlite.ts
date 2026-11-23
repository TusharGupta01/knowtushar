import initSqlJs, { type Database, type SqlValue } from 'sql.js';

let dbPromise: Promise<Database> | null = null;

function assetUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${relativePath.replace(/^\/+/, '')}`;
}

/**
 * Loads the bundled SQLite database (public/data/knowtushar.sqlite) into an
 * in-browser sql.js WebAssembly instance. Singleton across the app lifecycle.
 */
export function getDatabase(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const [SQL, response] = await Promise.all([
        initSqlJs({
          locateFile: () => assetUrl('wasm/sql-wasm.wasm'),
          useOldExtensionFunctions: false,
        }),
        fetch(assetUrl('data/knowtushar.sqlite')),
      ]);

      if (!response.ok) {
        throw new Error(`Failed to fetch SQLite database (${response.status})`);
      }

      const buffer = await response.arrayBuffer();
      return new SQL.Database(new Uint8Array(buffer));
    })();
  }
  return dbPromise;
}

/**
 * Executes a parameterized SELECT query and returns rows as typed objects.
 */
export async function queryAll<T extends Record<string, SqlValue>>(
  sql: string,
  params: SqlValue[] = [],
): Promise<T[]> {
  const db = await getDatabase();
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    const rows: T[] = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject() as T);
    }
    return rows;
  } finally {
    stmt.free();
  }
}
