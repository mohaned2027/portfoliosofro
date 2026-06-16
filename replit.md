# Dr. Mohamed Sobhy Elbakry — Academic Portfolio

An academic portfolio web app for Dr. Mohamed Sobhy Elbakry, Associate Professor & Head of the ECE Department. Showcases research publications, courses, achievements, experience, positions, and blog posts, with a full admin dashboard for content management.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, React Router DOM v7, TanStack Query
- UI: shadcn/ui components (Radix primitives), Framer Motion, Recharts, Sonner
- API: Express 5 (artifacts/api-server)
- DB: PostgreSQL + Drizzle ORM (provisioned separately)
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/portfolio/` — main frontend app (`@workspace/portfolio`)
  - `src/pages/` — all page components (public + admin, flat-file naming convention)
  - `src/components/` — shared UI: `common/`, `public/`, `admin/`, `effects/`, `ui/`
  - `src/context/` — React contexts (Auth, Data, AdminData, Theme, SiteSettings, Notification)
  - `src/api/` — API client (`client.js`), endpoints (`endpoints.js`), mock data (`mockData/`), request helper (`request.js`)
  - `src/hooks/` — custom hooks
  - `src/styles.css` — main theme file with Tailwind v4 config + dark/light CSS variables
- `artifacts/api-server/` — Express backend (`@workspace/api-server`)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/db/src/schema/` — Drizzle ORM schema

## Architecture decisions

- **Mock mode**: `MOCK_MODE = true` in `src/api/request.js` — all data comes from in-memory JSON. Set to `false` to use the real backend. The admin panel CRUD operations work in mock mode.
- **Flat-file page naming**: Pages use TanStack-Router-style naming convention (`_public.about.jsx`, `_public.blog.$id.jsx`) — these are plain React components used with React Router DOM routes defined in `App.jsx`.
- **Dark-first theme**: Default color scheme is dark (deep navy + electric blue). Light mode available via ThemeContext toggle.
- **No Next.js**: This was a Vercel/v0 project imported as-is. It was already Vite + React — no Next.js conversion needed.

## Product

- **Public portfolio**: Home, About, Research, Achievements, Blog, Courses, Experiences, Positions, Contact pages
- **Admin dashboard**: Full CRUD for all content types (researches, blogs, courses, achievements, etc.) behind login
- **Auth**: Mock login (any email + password ≥ 4 chars). OTP flow for password reset (mock OTP: 123456)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always import `App.jsx` not `App.tsx` — the main app logic lives in JSX files copied from the original Vercel project
- `src/index.css` just re-exports `src/styles.css` — edit `styles.css` for theme changes
- `laravel-echo` and `pusher-js` are installed but only active when `MOCK_MODE=false` and Reverb env vars are set
- The admin panel is accessible at `/admin` — login with any email and password ≥ 4 characters in mock mode

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
