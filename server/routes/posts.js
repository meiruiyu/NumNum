// server/routes/posts.js
// Endpoints for friend_posts — the Friends Space feed.
//
//   GET    /api/posts                 -> paginated feed
//   POST   /api/posts                 -> publish new post
//   POST   /api/posts/:id/like        -> increment like count
//   GET    /api/posts/:id/comments    -> list comments on a post
//   POST   /api/posts/:id/comments    -> create comment on a post
//   DELETE /api/posts/:id             -> remove a post

import { Router } from 'express';
import db from '../db.js';
import {
  HttpError,
  assertIdParam,
  assertNonEmptyString,
  parsePagination,
} from '../utils/http.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/posts?limit=20&offset=0
// ---------------------------------------------------------------------------
router.get('/', (req, res, next) => {
  try {
    const { limit, offset } = parsePagination(req.query, { limit: 20, maxLimit: 100 });
    const rows = db
      .prepare(
        'SELECT * FROM friend_posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
      )
      .all(limit, offset);
    res.json({ count: rows.length, posts: rows });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/posts
// ---------------------------------------------------------------------------
router.post('/', (req, res, next) => {
  try {
    const {
      author_id,
      author_name,
      restaurant_id,
      restaurant_name,
      comment,
    } = req.body ?? {};
    const normalizedComment = assertNonEmptyString(comment, 'comment');
    const info = db
      .prepare(
        `INSERT INTO friend_posts (
           author_id, author_name, restaurant_id, restaurant_name, comment
         ) VALUES (?, ?, ?, ?, ?)`,
      )
      .run(
        author_id || 'demo_user',
        author_name || 'John Doe',
        restaurant_id ?? null,
        restaurant_name ?? null,
        normalizedComment,
      );
    const post = db.prepare('SELECT * FROM friend_posts WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/posts/:id/like
// ---------------------------------------------------------------------------
router.post('/:id/like', (req, res, next) => {
  try {
    const postId = assertIdParam(req.params.id, 'post id');
    const info = db
      .prepare('UPDATE friend_posts SET like_count = like_count + 1 WHERE id = ?')
      .run(postId);
    if (info.changes === 0) throw new HttpError(404, 'Post not found');
    const post = db.prepare('SELECT * FROM friend_posts WHERE id = ?').get(postId);
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/posts/:id/comments
// ---------------------------------------------------------------------------
router.get('/:id/comments', (req, res, next) => {
  try {
    const postId = assertIdParam(req.params.id, 'post id');
    const post = db.prepare('SELECT id FROM friend_posts WHERE id = ?').get(postId);
    if (!post) throw new HttpError(404, 'Post not found');

    const comments = db
      .prepare(
        'SELECT * FROM post_comments WHERE post_id = ? ORDER BY created_at DESC, id DESC',
      )
      .all(postId);
    res.json({ count: comments.length, comments });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/posts/:id/comments
// ---------------------------------------------------------------------------
router.post('/:id/comments', (req, res, next) => {
  try {
    const postId = assertIdParam(req.params.id, 'post id');
    const { comment, author_id, author_name } = req.body ?? {};
    const normalizedComment = assertNonEmptyString(comment, 'comment');

    const post = db.prepare('SELECT id FROM friend_posts WHERE id = ?').get(postId);
    if (!post) throw new HttpError(404, 'Post not found');

    const info = db
      .prepare(
        `INSERT INTO post_comments (post_id, author_id, author_name, comment)
         VALUES (?, ?, ?, ?)`,
      )
      .run(postId, author_id || 'demo_user', author_name || 'John Doe', normalizedComment);

    const created = db
      .prepare('SELECT * FROM post_comments WHERE id = ?')
      .get(info.lastInsertRowid);
    res.status(201).json({ comment: created });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/posts/:id
// ---------------------------------------------------------------------------
router.delete('/:id', (req, res, next) => {
  try {
    const postId = assertIdParam(req.params.id, 'post id');
    const info = db.prepare('DELETE FROM friend_posts WHERE id = ?').run(postId);
    if (info.changes === 0) throw new HttpError(404, 'Post not found');
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
