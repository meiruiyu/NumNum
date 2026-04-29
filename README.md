# NumNum — NYC Restaurant Discovery Platform

> An Asian-focused restaurant discovery web app for NYC diners.
> Built as a class term project. Live data via Yelp Fusion API + Groq Llama 3 chatbot,
> persisted in SQLite, served by an Express backend and a React + Vite frontend.

---

## Table of Contents

1. [What it does](#what-it-does)
2. [Quick start (5 minutes)](#quick-start-5-minutes)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [npm scripts](#npm-scripts)
6. [API endpoints](#api-endpoints)
7. [Database schema](#database-schema)
8. [Notes for the grader](#notes-for-the-grader)
9. [Known limitations](#known-limitations)

---

## What it does

NumNum helps NYC diners — especially the Asian community — discover restaurants
through real Yelp data, friend recommendations, and an AI assistant.

Key features:

- **School-themed login** — sign in with any email; the app's accent color
  switches automatically based on the email domain
  (`@nyu.edu` → purple, `@columbia.edu` → blue, anything else → orange).
- **Top Picks Near You** — live Yelp Fusion API search around the user's
  current geolocation (falls back to Columbia University Uris Hall if the
  browser denies location access).
- **Real interactive map** — Leaflet + OpenStreetMap with 25+ pins for
  restaurants near Columbia. Hovering a pin opens a popup with name, rating,
  price, and distance; clicking "View details" navigates to the restaurant.
- **Restaurant detail page** — photo carousel (5+ images per place), tabs
  for menu / photos / reviews / info, and a "Friends who've been here"
  social section.
- **Cuisine-templated menus** — 12 menu templates (Chinese, Japanese, Korean,
  Southeast Asian, Cafe & Bubble Tea, Fast Food, Pizza/Italian, Steakhouse,
  Mexican, Indian, Mediterranean, Default). Each restaurant is matched to a
  template based on its primary Yelp category, returning 10 dishes with
  6-language translations and dish photos.
- **NYC Rankings** — 13 ranking categories (Stir-Fry, Ramen, Korean BBQ, Date
  Night, Best Value, Hidden Gems, etc.) each backed by a real Yelp search.
- **Reservations** — date / party-size / time pickers; submitting POSTs to
  the backend and persists to SQLite. The confirmation screen displays the
  database row id (e.g. "Confirmation #3 · saved to database").
- **Friends Space** — LinkedIn-style social feed with profile header, post
  composer (publishes to backend), like/save buttons, friend search, and
  pending-requests view.
- **Search** — debounced live search against Yelp Fusion.
- **Multilingual restaurant menus** — 6 languages with disabled-state for
  the ones still in development.
- **AI chatbot** — global floating button. Powered by Groq Llama 3.3 70B
  (free tier). Knows about NYC restaurants and can suggest spots.

---

## Quick start (5 minutes)

### Prerequisites

You need **two things** installed on your Mac:

1. **Node.js LTS (v20 or v22 recommended)** — download from [nodejs.org](https://nodejs.org/)
   (pick the green "LTS" button).
2. **Xcode Command Line Tools** — required to compile `better-sqlite3`. Open
   Terminal and run:
   ```bash
   xcode-select --install
   ```
   A system dialog will appear; click "Install" and wait ~5 minutes.

### Step 1 — Open the project folder in Terminal

```bash
cd "path/to/Restaurant discovery app"
```

(Replace `path/to/...` with where you unzipped the project.)

### Step 2 — Install dependencies

```bash
npm install --legacy-peer-deps
```

This downloads ~700 MB of packages into `node_modules/`. Takes 1-3 minutes.

### Step 3 — Confirm the .env file is there

The project ships with a working `.env` file that contains the API keys for
Yelp Fusion and Groq. **Don't share or commit this file outside the team.**
You can verify it's present by running:

```bash
ls -la .env
```

If it's missing, copy `.env.example` to `.env` and paste in the keys (see
[Notes for the grader](#notes-for-the-grader) below).

### Step 4 — Run the backend (Terminal window 1)

```bash
npm run server
```

You should see:

```
[db] Initialized at .../data/app.db
[server] API listening on http://localhost:4000
[server] Health check: http://localhost:4000/api/health
```

**Keep this window open.**

### Step 5 — Run the frontend (Terminal window 2)

Open a second Terminal window (`Cmd + N`), `cd` into the same folder, and
run:

```bash
npm run dev
```

You should see:

```
VITE v6.3.5  ready in 595 ms
➜  Local:   http://localhost:5173/
```

### Step 6 — Open in browser

Hold `Cmd` and click the `http://localhost:5173/` link in your terminal, or
just paste it into Safari/Chrome.

You'll land on the **login page**. Sign in with any email + any password
(min 4 chars). For grading we suggest:

| Email | Theme |
| --- | --- |
| `professor@columbia.edu` | Columbia blue |
| `student@nyu.edu` | NYU purple |
| `guest@example.com` | Default orange |

Done! Click around — every section pulls real data from the backend.

---

## Deployment (Vercel + Render)

### Backend (Render)

- **Service type**: Web Service (Node)
- **Root directory**: repository root
- **Build command**: `npm ci`
- **Start command**: `npm run start`
- **Environment variables**:
  - **`PORT`**: provided by Render automatically
  - **`CORS_ORIGIN`**: comma-separated allowlist of your Vercel domains, e.g.
    `https://your-app.vercel.app,https://your-app-git-main.vercel.app`
  - Keep your existing secrets (Yelp/Groq) as-is if used by API routes

### Frontend (Vercel)

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment variables**:
  - **`VITE_API_BASE_URL`**: your Render backend base URL, e.g. `https://numnum-api.onrender.com`

Notes:
- The frontend calls the API using `VITE_API_BASE_URL` in production (no Vite proxy).
- `vercel.json` is included so client-side routes (React Router) work on refresh.

---

## Tech stack

### Frontend

- **React 18** + **TypeScript** + **Vite 6** — modern dev server, hot reload
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — utility-first styling
- **Leaflet** + **react-leaflet** — interactive maps (OpenStreetMap tiles)
- **lucide-react** — icon set
- **Radix UI** — accessibility primitives (used by the design system)

### Backend

- **Express 4** — HTTP server
- **better-sqlite3 11** — embedded SQLite (zero-config, single .db file)
- **dotenv** — environment-variable loader
- **cors** — cross-origin support for the dev frontend

### External APIs

- **Yelp Fusion API** — restaurant search, business detail, reviews
- **Groq API** (OpenAI-compatible) — Llama 3.3 70B for the chatbot
- **OpenStreetMap** — free map tiles, no key required

---

## Project structure

```
Restaurant discovery app/
├── README.md                  ← you are here
├── package.json               ← npm scripts and dependencies
├── vite.config.ts             ← Vite dev server + /api proxy config
├── postcss.config.mjs         ← Tailwind / PostCSS config
├── index.html                 ← Vite HTML entry
├── .env                       ← API keys (NOT for public sharing)
├── .env.example               ← Template for teammates / grader
├── .gitignore                 ← Excludes node_modules, .env, etc.
│
├── src/                       ← Frontend (React)
│   ├── main.tsx               ← React entry — bootstraps auth + theme
│   ├── styles/                ← Global Tailwind / theme CSS
│   └── app/
│       ├── App.tsx            ← Router provider
│       ├── routes.ts          ← All client-side routes (login-gated)
│       ├── api/
│       │   ├── client.ts      ← Typed fetch wrapper to backend
│       │   ├── restaurants.ts ← Domain helpers (search, menu, reservations…)
│       │   ├── transform.ts   ← Yelp business → internal Restaurant type
│       │   └── photos.ts      ← Photo set builder (Yelp + cuisine fallbacks)
│       ├── lib/
│       │   ├── auth.ts        ← localStorage-backed demo auth
│       │   └── theme.ts       ← School → CSS variable mapping
│       ├── components/        ← Reusable UI (BottomNav, ChatBot, etc.)
│       ├── pages/             ← Route pages
│       │   ├── Login.tsx
│       │   ├── Home.tsx
│       │   ├── MapView.tsx
│       │   ├── Search.tsx
│       │   ├── RestaurantDetail.tsx   ← photo carousel + menu + social
│       │   ├── RecommendedDishes.tsx
│       │   ├── Reservation.tsx        ← POSTs to /api/reservations
│       │   ├── FriendsSpace.tsx       ← LinkedIn-style social feed
│       │   ├── AddFriends.tsx
│       │   ├── Chat.tsx
│       │   ├── MyLists.tsx
│       │   ├── Rankings.tsx
│       │   ├── Profile.tsx
│       │   └── ...
│       └── data/restaurants.ts ← Restaurant TypeScript type + filter vocab
│
├── server/                    ← Backend (Express + SQLite)
│   ├── index.js               ← HTTP server entry
│   ├── db.js                  ← SQLite connection + schema apply
│   ├── schema.sql             ← Table definitions
│   ├── yelp.js                ← Yelp Fusion HTTP client
│   ├── menuTemplates.js       ← 12 cuisine menu templates
│   ├── routes/
│   │   ├── restaurants.js     ← search / detail / reviews / menu
│   │   ├── reservations.js    ← reservation CRUD
│   │   ├── lists.js           ← user-curated saved lists
│   │   ├── posts.js           ← Friends Space posts
│   │   └── chat.js            ← Groq Llama 3 proxy
│   ├── middleware/
│   │   └── errorHandler.js    ← unified JSON error formatting
│   └── scripts/
│       └── snapshot.js        ← export DB to data/snapshot.json
│
└── data/                      ← Runtime SQLite (created on first run)
    └── app.db                 ← SQLite database file
```

---

## npm scripts

| Command | What it does |
| --- | --- |
| `npm install --legacy-peer-deps` | Install all dependencies. The flag is needed because `react-leaflet` declares peer-dep ranges that npm dislikes. |
| `npm run dev` | Start the Vite frontend dev server on port 5173 with hot reload. |
| `npm run server` | Start the Express backend on port 4000. Reads `.env`. |
| `npm run dev:server` | Same as `server`, but with Node's `--watch` flag so the server auto-restarts when you edit backend files. |
| `npm run dev:all` | Run `dev` + `dev:server` together (uses `concurrently`). |
| `npm run build` | Production build of the frontend. Output goes to `dist/`. |
| `npm run db:snapshot` | Export every table in the SQLite database to `data/snapshot.json` — handy for grading evidence of database inserts. |

---

## API endpoints

All endpoints live under the `/api` prefix and return JSON.

### Health

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Returns `{ status: "ok", timestamp }`. |

### Restaurants

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/restaurants/search` | Yelp search. Accepts `term`, `location`, `latitude`, `longitude`, `categories`, `price`, `radius`, `sort_by`, `limit`, `offset`. Caches every business returned. |
| GET | `/api/restaurants/:id` | Restaurant detail (cache-first, falls back to Yelp). |
| GET | `/api/restaurants/:id/reviews` | Up to 3 Yelp reviews. |
| GET | `/api/restaurants/:id/menu` | 10-dish menu picked from one of 12 cuisine templates. Cached forever per restaurant id. |
| GET | `/api/restaurants/cached` | Lists the local SQLite cache (paginated). |

### Reservations

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/reservations?user_id=…` | List a user's reservations. |
| GET | `/api/reservations/:id` | Single reservation. |
| POST | `/api/reservations` | Create a reservation. Inserts a row into SQLite. |
| PATCH | `/api/reservations/:id` | Update status (`confirmed` / `cancelled` / `completed`). |
| DELETE | `/api/reservations/:id` | Delete reservation. |

### Lists ("My Lists" / saved restaurants)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/lists?user_id=…` | List user's lists. |
| POST | `/api/lists` | Create new list. |
| DELETE | `/api/lists/:id` | Delete list. |
| GET | `/api/lists/:id/items` | Restaurants in a list. |
| POST | `/api/lists/:id/items` | Add restaurant to list. |
| DELETE | `/api/lists/:id/items/:restaurant_id` | Remove restaurant from list. |
| GET | `/api/lists/:id/export` | Export full list + items as auditable/shareable JSON payload. |
| GET | `/api/poster-image?url=` | Same-origin proxy for Unsplash URLs only — used to inline photos into SVG posters (`data:` URLs in `<img>` cannot load remote `href`). |

### My Lists — Wishlist + Collections (UI)

On **My Lists**, use the gold **Share** button (or **⌘/Ctrl+Shift+S** when not typing in an input). A modal opens with:

- A **poster preview** (SVG) of Wishlist + My Collections.
- **Copy link** — puts a URL in the clipboard; opening it loads a **read-only snapshot** (`#share=…`).
- **X**, **Instagram** (caption + link copied, then opens Instagram), **Reddit** — platform share flows.
- **Download** — saves the poster SVG (rich layout: restaurant photos, address, rating, price, reviews; each collection row shows a single cover image and metadata).

Other networks: paste the copied link or downloaded poster.

### Friends Space posts

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/posts?limit=&offset=` | Paginated feed. |
| POST | `/api/posts` | Publish a new post (used by the Create Post composer). |
| POST | `/api/posts/:id/like` | Increment like count. |
| GET | `/api/posts/:id/comments` | List comments for a post (newest first). |
| POST | `/api/posts/:id/comments` | Add a comment to a post. |
| DELETE | `/api/posts/:id` | Delete post. |

### Chatbot

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/chat` | Forwards a `{ system, messages }` payload to Groq Llama 3.3 70B. Returns `{ reply, provider, model }`. |

### API validation and error contract

- Query/body/path inputs are validated in each route (for example, positive
  integer pagination and required fields like `comment` / `restaurant_id`).
- Failed validation returns **400** with a consistent JSON shape:
  `{ error, path, method }`.
- Missing resources return **404** (e.g., unknown reservation/list/post id).
- Upstream provider issues are mapped to meaningful statuses:
  - `chat` timeout: **504**
  - provider unavailable/non-JSON response: **502**
- Error middleware guarantees a predictable response envelope and includes
  optional `details` when relevant.

---

## Database schema

SQLite database at `data/app.db`. Schema applied automatically on startup
from `server/schema.sql`.

| Table | Purpose |
| --- | --- |
| `restaurants_cache` | Local copy of Yelp business payloads (id, name, rating, price, lat/lng, categories, raw JSON). Includes data checks (rating range, non-negative counts). |
| `reservations` | User-made reservations (party size, date, time, status). Includes constraints for positive `party_size` and allowed status enum. |
| `user_lists` | Custom named restaurant lists per user. |
| `list_items` | Restaurants saved into a list. Enforces unique `(list_id, restaurant_id)` to prevent duplicates. |
| `post_comments` | Lightweight comments under Friends Space posts (`post_id` FK, cascade delete when post is removed). |
| `friend_posts` | Posts created via the Friends Space composer. Includes non-negative `like_count` check. |
| `ai_menus` | Cached menu (10 dishes + translations) per restaurant id. |

To inspect the database visually, install [DB Browser for SQLite](https://sqlitebrowser.org/)
and open `data/app.db`.

---

## Notes for the grader

> This section addresses the rubric line item: *"include a separate CSV or
> JSON file with the data that was inserted into the database"*.

### Where the data inserts live

Every CRUD endpoint actually writes to SQLite. To see real evidence of
inserts after using the app:

1. Click around the app — make a reservation, publish a Friends Space post,
   open a few restaurant detail pages.
2. In a third terminal, from the project root, run:
   ```bash
   npm run db:snapshot
   ```
3. Open `data/snapshot.json`. It contains every row in every table. This is
   the grading evidence that the backend persists user actions.

### About the `.env` file

This zip includes the team's `.env` with working API keys for Yelp Fusion
and Groq. **Please use these keys only for grading; do not redistribute.**
The keys will be revoked at the end of the semester.

If the `.env` is missing or expired, you can paste your own keys into the
provided `.env.example` and rename it to `.env`:

- Yelp Fusion: free signup at <https://www.yelp.com/developers/v3/manage_app>
- Groq: free signup at <https://console.groq.com/keys> (no credit card)

### Mapping to the rubric

| Rubric criterion | Where to look |
| --- | --- |
| Logical folder hierarchy | `src/` for client, `server/` for API, separate `api/` and `lib/` modules. |
| Modular file separation | HTML in `index.html`, CSS in `src/styles/`, TSX components in `src/app/`, server JS in `server/`. |
| Readable code style | Function-component React with TypeScript; JSDoc on backend functions. |
| Meaningful names | `searchRestaurants`, `buildMenuFromTemplate`, `pickTemplateKey`, `cacheBusinesses`, etc. |
| Inline comments | Every file has a top-of-file purpose block + comments on tricky logic. |
| Fidelity to Figma | Every page in `src/app/pages/` was originally generated from the Figma design and refined. |
| Responsive layouts | Tailwind `sm:` / `md:` / `lg:` breakpoints used throughout. |
| Semantic markup | `<main>`, `<nav>`, `<section>`, `<button>` used appropriately. |
| Core interactive features | Login, search, filter, map, reservations, posting, chat, list management — all functional. |
| Clean event handling & state | React `useState`/`useEffect` hooks, no class components, effects always cancel via a `cancelled` flag. |
| RESTful endpoints | Documented in [API endpoints](#api-endpoints). |
| Correct DB schema use & queries | Prepared statements via better-sqlite3 (see `server/routes/restaurants.js` `upsertStmt`). |
| Robust error handling | `errorHandler` middleware + try/catch in every route + frontend `ApiError` class. |
| Data inserts into DB | Every POST/PATCH/DELETE actually writes; run `npm run db:snapshot` to dump. |
| Clear setup/run instructions | This README, "Quick start" section. |
| Dependency list | This README, "Tech stack" section + `package.json`. |
| Description of key modules | This README, "Project structure" section. |

---

## Known limitations

- **Yelp Fusion API does not return menu data** (deprecated since 2018).
  We synthesize plausible menus from 12 cuisine templates instead. This is
  documented in `server/menuTemplates.js`.
- **Reviews limited to 3** — Yelp Fusion's reviews endpoint caps at 3.
- **Login is local only** — no real auth, just localStorage. Demo project
  scope.
- **Friend graph is mocked** — the "Friends who've been here" section uses
  deterministic mock friends keyed by restaurant name. Real social graph is
  beyond term-project scope.
- **Map markers limited to ~25 per page** — fanning out 14 parallel Yelp
  searches plus deduping leaves us with that range. Yelp's free tier caps
  at 5,000 calls/day, well above demo usage.
- **First map load can take 5-10 seconds** because the page fires 14
  parallel Yelp requests. Subsequent visits pull from cache.
