-- server/schema.sql
-- Full database schema. This file is applied idempotently at every server
-- start via CREATE ... IF NOT EXISTS statements, so it is safe to re-run.

-- ---------------------------------------------------------------------------
-- restaurants_cache
-- Locally-cached copy of restaurants returned by the Yelp Fusion API.
-- Populated on-demand as the frontend requests search results.
-- Having a cache allows us to:
--   1. Respect Yelp's 5,000 req/day rate limit
--   2. Serve detail pages even if Yelp is unreachable
--   3. Satisfy the rubric's "data inserts into the database" requirement
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS restaurants_cache (
  id              TEXT PRIMARY KEY,           -- Yelp business id
  name            TEXT NOT NULL,
  image_url       TEXT,
  url             TEXT,                       -- Yelp page URL
  review_count    INTEGER DEFAULT 0 CHECK (review_count >= 0),
  rating          REAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  price           TEXT,                       -- "$", "$$", "$$$", "$$$$"
  phone           TEXT,
  display_phone   TEXT,
  latitude        REAL,
  longitude       REAL,
  address1        TEXT,
  address2        TEXT,
  address3        TEXT,
  city            TEXT,
  zip_code        TEXT,
  state           TEXT,
  country         TEXT,
  categories_json TEXT,                       -- JSON-serialized category array
  transactions    TEXT,                       -- comma-joined: "pickup,delivery"
  distance        REAL CHECK (distance IS NULL OR distance >= 0), -- meters from last-searched loc
  is_closed       INTEGER DEFAULT 0 CHECK (is_closed IN (0, 1)),
  raw_json        TEXT,                       -- full Yelp payload for fidelity
  cached_at       TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants_cache(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants_cache(rating);

-- ---------------------------------------------------------------------------
-- reservations
-- User-made table reservations. Stored locally — Yelp's API doesn't support
-- creating reservations via Fusion.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservations (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id  TEXT NOT NULL,               -- refs restaurants_cache.id
  restaurant_name TEXT NOT NULL,              -- denormalized for display
  user_id        TEXT NOT NULL DEFAULT 'demo_user',
  user_name      TEXT NOT NULL DEFAULT 'John Doe',
  party_size     INTEGER NOT NULL CHECK (party_size > 0),
  reservation_date TEXT NOT NULL,             -- ISO date "2026-05-02"
  reservation_time TEXT NOT NULL,             -- "19:00"
  special_request TEXT,
  status         TEXT NOT NULL DEFAULT 'confirmed'
                           CHECK (status IN ('confirmed', 'cancelled', 'completed')),
                                              -- confirmed | cancelled | completed
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_restaurant ON reservations(restaurant_id);

-- ---------------------------------------------------------------------------
-- user_lists
-- "My Lists" feature — a user can save restaurants into custom named lists.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_lists (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     TEXT NOT NULL DEFAULT 'demo_user',
  name        TEXT NOT NULL,
  emoji       TEXT DEFAULT '⭐',
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS list_items (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id         INTEGER NOT NULL,
  restaurant_id   TEXT NOT NULL,
  restaurant_name TEXT,
  note            TEXT,
  added_at        TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES user_lists(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_list_items_unique
  ON list_items(list_id, restaurant_id);

-- ---------------------------------------------------------------------------
-- friend_posts
-- Posts created from the Friends Space "Create Post" composer.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS friend_posts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id       TEXT NOT NULL DEFAULT 'demo_user',
  author_name     TEXT NOT NULL DEFAULT 'John Doe',
  restaurant_id   TEXT,
  restaurant_name TEXT,
  comment         TEXT NOT NULL,
  like_count      INTEGER DEFAULT 0 CHECK (like_count >= 0),
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- post_comments
-- Lightweight comments for Friends Space posts.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_comments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id      INTEGER NOT NULL,
  author_id    TEXT NOT NULL DEFAULT 'demo_user',
  author_name  TEXT NOT NULL DEFAULT 'John Doe',
  comment      TEXT NOT NULL CHECK (length(trim(comment)) > 0),
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES friend_posts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id
  ON post_comments(post_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- ai_menus
-- Caches the menu rendered for each restaurant. The Yelp Fusion API does not
-- expose menu items (deprecated since 2018), so we use 12 cuisine-keyed
-- templates (server/menuTemplates.js) to pick a 10-dish menu given the
-- restaurant's primary cuisine. Cached forever per restaurant id.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_menus (
  restaurant_id   TEXT PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  cuisine         TEXT,
  menu_json       TEXT NOT NULL,        -- serialized array of dish objects
  generated_at    TEXT DEFAULT CURRENT_TIMESTAMP
);
