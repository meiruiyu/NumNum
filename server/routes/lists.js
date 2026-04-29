// server/routes/lists.js
// CRUD endpoints for user_lists and list_items tables.
//
//   GET    /api/lists?user_id=...                  -> all lists for user
//   POST   /api/lists                              -> create a new list
//   DELETE /api/lists/:id                          -> delete list (cascades items)
//   POST   /api/lists/:id/items                    -> add restaurant to list
//   DELETE /api/lists/:id/items/:restaurant_id     -> remove restaurant from list
//   GET    /api/lists/:id/items                    -> items in a list
//   GET    /api/lists/:id/export                   -> export list + items as JSON

import { Router } from 'express';
import db from '../db.js';
import {
  HttpError,
  assertIdParam,
  assertNonEmptyString,
} from '../utils/http.js';

const router = Router();

// ---- Lists -----------------------------------------------------------------
router.get('/', (req, res, next) => {
  try {
    const userId = req.query.user_id || 'demo_user';
    const lists = db
      .prepare(
        `SELECT l.*,
                (SELECT COUNT(*) FROM list_items WHERE list_id = l.id) AS item_count
           FROM user_lists l
          WHERE l.user_id = ?
          ORDER BY l.created_at DESC`,
      )
      .all(userId);
    res.json({ count: lists.length, lists });
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const { name, emoji, user_id } = req.body ?? {};
    const normalizedName = assertNonEmptyString(name, 'name');
    const info = db
      .prepare('INSERT INTO user_lists (user_id, name, emoji) VALUES (?, ?, ?)')
      .run(user_id || 'demo_user', normalizedName, emoji || '⭐');
    const list = db.prepare('SELECT * FROM user_lists WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ list });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const listId = assertIdParam(req.params.id, 'list id');
    const info = db.prepare('DELETE FROM user_lists WHERE id = ?').run(listId);
    if (info.changes === 0) throw new HttpError(404, 'List not found');
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

// ---- List items ------------------------------------------------------------
router.get('/:id/items', (req, res, next) => {
  try {
    const listId = assertIdParam(req.params.id, 'list id');
    const items = db
      .prepare('SELECT * FROM list_items WHERE list_id = ? ORDER BY added_at DESC')
      .all(listId);
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/items', (req, res, next) => {
  try {
    const { restaurant_id, restaurant_name, note } = req.body ?? {};
    const listId = assertIdParam(req.params.id, 'list id');
    const restaurantId = assertNonEmptyString(restaurant_id, 'restaurant_id');
    const listExists = db.prepare('SELECT 1 FROM user_lists WHERE id = ?').get(listId);
    if (!listExists) throw new HttpError(404, 'List not found');

    const info = db
      .prepare(
        'INSERT INTO list_items (list_id, restaurant_id, restaurant_name, note) VALUES (?, ?, ?, ?)',
      )
      .run(listId, restaurantId, restaurant_name ?? null, note ?? null);
    const item = db.prepare('SELECT * FROM list_items WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/items/:restaurant_id', (req, res, next) => {
  try {
    const listId = assertIdParam(req.params.id, 'list id');
    const restaurantId = assertNonEmptyString(req.params.restaurant_id, 'restaurant_id');
    const info = db
      .prepare('DELETE FROM list_items WHERE list_id = ? AND restaurant_id = ?')
      .run(listId, restaurantId);
    if (info.changes === 0) throw new HttpError(404, 'Item not found');
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/export', (req, res, next) => {
  try {
    const listId = assertIdParam(req.params.id, 'list id');
    const list = db.prepare('SELECT * FROM user_lists WHERE id = ?').get(listId);
    if (!list) throw new HttpError(404, 'List not found');

    const items = db
      .prepare('SELECT * FROM list_items WHERE list_id = ? ORDER BY added_at DESC')
      .all(listId);

    const exportedAt = new Date().toISOString();
    const canonicalPath = `/api/lists/${listId}/export`;
    const canonicalUrl = `${req.protocol}://${req.get('host')}${canonicalPath}`;

    res.json({
      export_version: '1.0.0',
      exported_at: exportedAt,
      list,
      items,
      audit: {
        item_count: items.length,
        exported_by_user_id: list.user_id,
      },
      share: {
        canonical_url: canonicalUrl,
        x_intent_url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `Check out my food list "${list.name}"`,
        )}&url=${encodeURIComponent(canonicalUrl)}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
