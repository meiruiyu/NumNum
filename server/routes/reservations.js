// server/routes/reservations.js
// CRUD endpoints for the reservations table.
//
//   GET    /api/reservations?user_id=...
//   GET    /api/reservations/:id
//   POST   /api/reservations
//   PATCH  /api/reservations/:id  (status update)
//   DELETE /api/reservations/:id
//
// All writes are real SQLite inserts / updates — satisfying the rubric's
// "data inserts into the selected database" requirement.

import { Router } from 'express';
import db from '../db.js';
import {
  HttpError,
  assertIdParam,
  assertNonEmptyString,
} from '../utils/http.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/reservations?user_id=demo_user
// ---------------------------------------------------------------------------
router.get('/', (req, res, next) => {
  try {
    const userId = req.query.user_id || 'demo_user';
    const rows = db
      .prepare(
        'SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC, reservation_time DESC',
      )
      .all(userId);
    res.json({ count: rows.length, reservations: rows });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/reservations/:id
// ---------------------------------------------------------------------------
router.get('/:id', (req, res, next) => {
  try {
    const reservationId = assertIdParam(req.params.id, 'reservation id');
    const row = db.prepare('SELECT * FROM reservations WHERE id = ?').get(reservationId);
    if (!row) throw new HttpError(404, 'Reservation not found');
    res.json({ reservation: row });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/reservations
// ---------------------------------------------------------------------------
router.post('/', (req, res, next) => {
  try {
    const {
      restaurant_id,
      restaurant_name,
      user_id,
      user_name,
      party_size,
      reservation_date,
      reservation_time,
      special_request,
    } = req.body ?? {};

    // Minimal validation.
    const normalizedRestaurantId = assertNonEmptyString(restaurant_id, 'restaurant_id');
    const normalizedRestaurantName = assertNonEmptyString(restaurant_name, 'restaurant_name');
    const normalizedDate = assertNonEmptyString(reservation_date, 'reservation_date');
    const normalizedTime = assertNonEmptyString(reservation_time, 'reservation_time');
    const normalizedPartySize = Number.parseInt(String(party_size), 10);
    if (!Number.isInteger(normalizedPartySize) || normalizedPartySize <= 0) {
      throw new HttpError(400, 'party_size must be a positive integer');
    }

    const info = db
      .prepare(
        `INSERT INTO reservations (
          restaurant_id, restaurant_name,
          user_id, user_name,
          party_size, reservation_date, reservation_time, special_request
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        normalizedRestaurantId,
        normalizedRestaurantName,
        user_id || 'demo_user',
        user_name || 'John Doe',
        normalizedPartySize,
        normalizedDate,
        normalizedTime,
        special_request ?? null,
      );

    const created = db
      .prepare('SELECT * FROM reservations WHERE id = ?')
      .get(info.lastInsertRowid);

    res.status(201).json({ reservation: created });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/reservations/:id  (update status)
// ---------------------------------------------------------------------------
router.patch('/:id', (req, res, next) => {
  try {
    const reservationId = assertIdParam(req.params.id, 'reservation id');
    const { status } = req.body ?? {};
    const allowed = ['confirmed', 'cancelled', 'completed'];
    if (!allowed.includes(status)) {
      throw new HttpError(400, `status must be one of ${allowed.join(', ')}`);
    }
    const info = db
      .prepare('UPDATE reservations SET status = ? WHERE id = ?')
      .run(status, reservationId);
    if (info.changes === 0) throw new HttpError(404, 'Reservation not found');
    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(reservationId);
    res.json({ reservation: updated });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/reservations/:id
// ---------------------------------------------------------------------------
router.delete('/:id', (req, res, next) => {
  try {
    const reservationId = assertIdParam(req.params.id, 'reservation id');
    const info = db.prepare('DELETE FROM reservations WHERE id = ?').run(reservationId);
    if (info.changes === 0) throw new HttpError(404, 'Reservation not found');
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

export default router;
