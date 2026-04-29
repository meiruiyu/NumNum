// server/db.js
// SQLite connection helper built on better-sqlite3 (synchronous, battle-tested).
// The database file is created at ./data/app.db on first run and schema.sql is
// applied automatically.

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_DIR = path.resolve(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'app.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Ensure ./data directory exists.
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

// Open (or create) the database file.
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');   // concurrent read/write safety
db.pragma('foreign_keys = ON');

// Apply the schema IMMEDIATELY on module load. This must happen before any
// route files that import `db` try to call `db.prepare(...)` at their module
// top level — otherwise the tables don't exist yet and better-sqlite3 throws
// "SqliteError: no such table".
const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);

// Kept for backwards compatibility with code that called it explicitly.
// It's now a no-op because the schema is applied eagerly above.
export function initDatabase() {
  console.log(`[db] Initialized at ${DB_PATH}`);
}

export default db;
