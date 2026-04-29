// server/scripts/snapshot.js
// Exports the current state of every table in the SQLite database to
// ../../data/snapshot.json — this is the file you can include in your
// submission zip to satisfy the rubric's:
//   "include a separate CSV or JSON file with the data that was inserted
//    into the database"
//
// Run with:  npm run db:snapshot

import db from '../db.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = path.resolve(__dirname, '..', '..', 'data', 'snapshot.json');

const TABLES = [
  'restaurants_cache',
  'reservations',
  'user_lists',
  'list_items',
  'friend_posts',
];

const snapshot = {};
let total = 0;
for (const table of TABLES) {
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    snapshot[table] = rows;
    total += rows.length;
    console.log(`  ${table.padEnd(20)} ${rows.length} rows`);
  } catch (err) {
    console.warn(`  ${table.padEnd(20)} (table missing — did you run the server once?)`);
    snapshot[table] = [];
  }
}

fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
console.log(`\n[snapshot] Wrote ${total} rows to ${SNAPSHOT_PATH}`);
