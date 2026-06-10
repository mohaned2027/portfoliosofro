# Prof. Dr. Mohammed — Academic Portfolio

A full-featured academic portfolio and admin dashboard for a university professor. Public visitors can browse research, courses, achievements, blog posts, experiences, and contact the professor. Admins can log in to manage all content via a rich dashboard.

## Run & Operate

- `pnpm --filter @workspace/professor-portfolio run dev` — run the frontend (auto-started by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, React Router v7, Tailwind CSS v4, shadcn/ui
- Admin: Custom CRUD dashboard, mock API client
- Theme: Dark navy/electric blue academic theme with custom CSS variables
- API: Express 5 (scaffold, not yet wired to DB)
- DB: PostgreSQL + Drizzle ORM (scaffold)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/professor-portfolio/src/` — all frontend source
- `artifacts/professor-portfolio/src/pages/` — public + admin route components
- `artifacts/professor-portfolio/src/components/` — UI, admin, public, effects components
- `artifacts/professor-portfolio/src/api/client.js` — mock API client (in-memory store)
- `artifacts/professor-portfolio/src/data/mockData/` — JSON seed data
- `artifacts/professor-portfolio/src/context/` — Auth, Data, Theme contexts
- `artifacts/professor-portfolio/src/styles.css` — theme CSS variables (oklch colors, dark/light)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)

## Architecture decisions

- App uses an in-memory mock API client (`src/api/client.js`) — all data is seeded from JSON files and persists only in memory. No real backend is wired up yet.
- Dark mode is default; theme toggled via `ThemeContext` using CSS class on `<html>`.
- React Router v7 with flat file naming convention for pages (e.g. `_public.about.jsx`).
- Admin routes are protected by `AuthContext` which reads from localStorage.
- Custom CSS variables use oklch color space for the navy/electric-blue palette.

## Product

- **Public portfolio**: Home, About, Research, Achievements, Blog, Courses, Experiences, Positions, Contact
- **Admin dashboard**: Login, CRUD management for all content categories, profile + settings pages
- **Auth**: Mock login (any email + 4+ char password works), OTP + reset password flow

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `styles.css` uses `@import "tailwindcss"` (Tailwind v4 — no config file needed).
- The mock API client simulates latency (350ms) and supports pagination, search, sort.
- To wire up a real backend: replace `src/api/client.js` calls with the generated React Query hooks from `@workspace/api-client-react`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
