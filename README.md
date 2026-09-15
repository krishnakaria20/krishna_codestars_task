# CP Pulse — Competitive Programming Analytics Dashboard

A live, animated year-in-review dashboard that aggregates public competitive-programming data across multiple platforms into one visual story.

## Platforms integrated

- **Codeforces** — official public API: profile, contest ratings, submissions, solved problems, difficulty, tags, languages and activity.
- **LeetCode** — public GraphQL endpoint: profile, accepted-problem counts, contest rating/ranking and submission calendar where exposed.
- **CodeChef** — public profile page parsing: rating/solved/contest figures when the public page exposes them. This is more fragile than an official API.
- **AtCoder** — public user history endpoint: contest history and ratings. AtCoder's public history does not expose a universal solved-problem count, so that field remains unavailable rather than fabricated.

The app is designed to degrade gracefully: if one platform is unavailable, the other connected platforms still load.

## Features

- Multi-platform profile connection
- Live public API/data integration
- Unified solved/contest/platform metrics
- Rating timeline
- Difficulty breakdown
- Programming-language list where source data exposes it
- Topic/tag analysis where source data exposes it
- Best activity streak from available activity dates
- Most productive month from available activity events
- Activity heatmap/pulse
- Recent public work where available
- Platform-by-platform comparison cards
- Loading and error states
- Responsive mobile/desktop UI
- Scroll-triggered animations with Framer Motion
- PNG export of the final summary card

## Stack

### Frontend
React, Vite, Framer Motion, Recharts, Axios, html-to-image

### Backend
Node.js, Express, Axios, Cheerio

## Run locally

### 1. Backend

```bash
cd server
npm install
npm run dev
```

Backend: `http://localhost:5000`

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Frontend: `http://localhost:5173`

No API key is required for the public sources currently used.

## API

`GET /api/health`

Checks backend availability.

`GET /api/analyze?codeforces=tourist&leetcode=...&codechef=...&atcoder=...`

Fetches all supplied profiles concurrently, normalizes the responses, and returns platform data plus unified analytics.

## Architecture

```text
Browser
  ↓
React dashboard
  ↓
Axios /api/analyze
  ↓
Express API
  ├── Codeforces service ──→ Codeforces public API
  ├── LeetCode service ────→ LeetCode public GraphQL
  ├── CodeChef service ────→ Public profile page
  └── AtCoder service ─────→ Public user history
  ↓
Normalize + aggregate
  ↓
Unified JSON
  ↓
Charts / cards / activity / export
```

## Data limitations

Public APIs are not equally available across competitive-programming platforms. Codeforces provides the most complete official API. LeetCode's public GraphQL endpoint is not presented as a stable official developer API. CodeChef profile parsing depends on the current public HTML structure. AtCoder's public history endpoint is useful for contest ratings but does not provide a universal solved-problem metric. The dashboard intentionally displays unavailable metrics as unavailable instead of inventing values.

## Deployment

Deploy the `server` and `client` as separate Node/Vite services. The client proxy is intended for local development; for production, configure the frontend API base URL or deploy the frontend and backend behind the same origin/reverse proxy.
