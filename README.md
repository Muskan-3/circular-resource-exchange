# EcoLoop

AI-powered circular economy resource exchange platform — connects people and businesses to
exchange reusable/waste materials (fabric scraps, wood offcuts, packaging, surplus inventory,
electronics, furniture) instead of discarding them.

Built as a solo B.Tech portfolio project. **Phase 1 (this state): base platform** — auth,
listing CRUD, browse/filter, seed data. AI semantic matching, photo tagging, impact scoring,
and route optimization land in later phases.

## Stack

- Next.js (App Router, TypeScript) + Tailwind CSS — frontend and backend (API routes) in one app
- MongoDB via Mongoose
- Auth: email/password, JWT in an httpOnly cookie (`jose` + `bcryptjs`)

## Setup

1. **MongoDB** — have a MongoDB instance reachable (local `mongod`, or an Atlas cluster).
2. Copy the env template and fill it in:
   ```bash
   cp .env.example .env
   ```
   - `MONGODB_URI` — your connection string.
   - `JWT_SECRET` — any long random string, e.g. `openssl rand -base64 32`.
   - `ANTHROPIC_API_KEY` — leave blank for now; only needed once Phase 2/3 (AI matching,
     photo tagging) land, and those fall back to mock behavior without it.
3. Install dependencies and seed the database with demo data:
   ```bash
   npm install
   npm run seed
   ```
   This creates 5 demo users (password for all: `password123`, e.g. `priya@example.com`)
   and ~20 sample listings across every category.
4. Run the app:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## What's here

- `/register`, `/login` — email/password auth, JWT stored in an httpOnly cookie.
- `/listings` — browse with category and location filters.
- `/listings/new`, `/listings/[id]/edit` — create/edit a listing (auth required; photo upload
  saves to `public/uploads`).
- `/listings/[id]` — listing detail, with owner-only edit/delete actions.
- `src/proxy.ts` — Next.js 16 "Proxy" (formerly Middleware) guarding the create/edit routes.

## Notes

- Photo uploads are written to the local filesystem (`public/uploads`) — fine for local/demo
  use, but won't persist on most serverless hosts (e.g. Vercel). This will be addressed in the
  deployment phase.
- Role (donor/business/collector) is stored per user but doesn't gate any actions yet, per the
  project's "keep permissions simple" ground rule.
# circular-resource-exchange
