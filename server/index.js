// server/index.js
// Express app entry point. Boots HTTP server, wires routes, initializes SQLite.
//
// Run with:  npm run server
// Default port: 4000 (override with PORT env var).

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import restaurantsRouter from './routes/restaurants.js';
import reservationsRouter from './routes/reservations.js';
import listsRouter from './routes/lists.js';
import postsRouter from './routes/posts.js';
import chatRouter from './routes/chat.js';
import popularDishesRouter from './routes/popular-dishes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const PORT = process.env.PORT || 4000;

const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / server-to-server / curl (no Origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      return cb(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

// Health check — simple sanity endpoint.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Same-origin image fetch for SVG posters (data-URL SVG in <img> cannot load remote href).
const POSTER_IMAGE_URL_RE = /^https:\/\/(images\.unsplash\.com|plus\.unsplash\.com)\//;
app.get('/api/poster-image', async (req, res, next) => {
  try {
    const raw = req.query.url;
    if (typeof raw !== 'string' || !POSTER_IMAGE_URL_RE.test(raw)) {
      return res.status(400).type('text/plain').send('Invalid or disallowed image URL');
    }
    const upstream = await fetch(raw, {
      headers: { 'User-Agent': 'NumNum-Poster/1.0' },
    });
    if (!upstream.ok) {
      return res.status(upstream.status).type('text/plain').send('Upstream fetch failed');
    }
    const ct = upstream.headers.get('content-type') || 'application/octet-stream';
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buf);
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/lists', listsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/chat', chatRouter);
app.use('/api', popularDishesRouter);

// 404 + error handler must come last.
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize DB schema, then start listening.
initDatabase();
app.listen(PORT, () => {
  console.log(`[server] API listening on http://localhost:${PORT}`);
  console.log(`[server] Health check: http://localhost:${PORT}/api/health`);
});
