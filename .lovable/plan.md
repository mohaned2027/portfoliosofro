## Plan

I'll match the architecture from your uploaded reference (`src/api/request.js` + `endpoints.js` + `mockData/*.json`), then extend the dashboard so every visible piece of content is editable.

### 1. API layer (mirrors your reference exactly)
- `src/api/endpoints.js` — `BASE_URL` + `PORTFOLIO_ENDPOINTS` (public) + `DASHBOARD_ENDPOINTS` (admin) adapted to academic domain (profile, achievements, researches, courses, lectures, experiences, positions, blogs, messages, media, settings, contact).
- `src/api/request.js` — `MOCK_MODE = true` toggle, `simulateDelay`, `FORCE_REAL_API_ENDPOINTS`, `apiFetch / apiGet / apiPost / apiPut / apiPatch / apiDelete`. Token in `localStorage`. Same behavior as your reference.
- `src/api/mockData/*.json` — split current `mockData.ts` into JSONs (profile, achievements, researches, experiences, positions, courses, blogs, messages, media, settings, dashboard).
- `src/api/client.ts` (existing) keeps the same exported `api.*` shape so call sites don't break, but internally calls `apiFetch`. One source of truth, two interfaces.

### 2. Auth flow (matches reference pages)
- `/login` (exists) — keep, wire to `/auth/login`.
- `/forgot-password` (exists) — send email → redirect to `/otp?email=...`.
- `/otp` — new. 6 separate boxes, auto-advance, paste support, resend timer → on success redirect to `/reset-password`.
- `/reset-password` — improved form (new password + confirm + show/hide + strength meter).

### 3. Dashboard — full content control
- **Profile/Hero**: name, titles, department, university, bio, vision, hero subtitle, typewriter phrases, contact info, social links, profile image (drag/drop).
- **Skills**: name + level (slider) + reorder + add/remove.
- **Interests**: tag editor.
- **Stats**: publications, courses, awards, students, citations.
- **Site Settings**: site title, meta description, footer text, primary CTA labels.
- **Education**: full CRUD.
- All existing CRUD modules (achievements, researches, courses, lectures, experiences, positions, blogs, media, messages) get image fields converted to **drag-and-drop uploads** (FileReader → data URL preview).

### 4. UX: SweetAlert + Toaster
- Install `sweetalert2`.
- `src/lib/confirm.ts` — themed confirm dialog used by every delete button (`CrudPage`, messages, media, etc.).
- Toaster (sonner) already wired — keep success/error toasts post-action.

### 5. Reusable bits
- `src/components/common/Dropzone.tsx` — drag/drop image input (preview, remove, file→base64).
- `src/components/common/OtpInput.tsx` — 6-box code input.

### Technical notes
- Project is TanStack Start; new routes stay in `src/routes/` (e.g. `otp.tsx`).
- `request.js` lives at `src/api/request.js` (JS, not TS, to mirror your reference 1:1).
- Existing `api/client.ts` is the thin TS facade so React Query call sites in dashboard/public pages keep working with zero changes.
- `MOCK_MODE` flip + filling `BASE_URL` in `endpoints.js` is the only step needed to go live against a real backend.

### Out of scope for this pass
- Real backend wiring/auth tokens beyond mock.
- Email delivery for OTP — mocked (code `123456` accepted).
