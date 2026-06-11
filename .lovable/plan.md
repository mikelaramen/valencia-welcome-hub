# SettleInValencia — Build Plan

I'll build the **Product-led precision** direction (deep navy + warm terracotta on cream, Newsreader serif + Inter, dashboard mock in the hero). It fits a SaaS with an AI roadmap/dashboard at its core.

Stack: TanStack Start + React + TS + Tailwind v4 + shadcn (already set up), Lovable Cloud (Supabase) for DB/Auth/RLS, Lovable AI Gateway (`google/gemini-3-flash-preview`) for roadmap generation. EN/ES via `i18next` + `react-i18next` from day one.

Because the PRD is large, I'll deliver in 5 phases so you can review each before continuing.

---

## Phase 1 — Design system + public website (EN/ES)

- Install fonts (`@fontsource/newsreader`, `@fontsource/inter`), wire tokens (navy `#0c1b33`, terracotta `#cf5e38`, cream `#fdfbf7`) into `src/styles.css` via `@theme inline` against existing shadcn variables.
- i18n setup: `i18next`, locale detector, `LanguageProvider`, `en.json` / `es.json`, EN/ES toggle in nav.
- Shared layout: sticky nav + footer in `__root.tsx` (with `<Outlet />` preserved), generate hero/founder/blog images via `imagegen`.
- Routes (each with its own `head()` meta, EN/ES titles & descriptions):
  - `/` Home — hero with roadmap mock, How It Works, services preview, founder teaser, blog teaser, CTA band.
  - `/how-it-works`, `/services`, `/about`, `/contact`, `/blog`, `/blog/$slug`, `/resources`.
- Blog list/detail read from `blog_posts` (seeded with a couple of posts).
- Contact form → stores lead in `consultations` (or a dedicated `leads` table).

## Phase 2 — Lovable Cloud, auth, schema, RLS

- Enable Lovable Cloud.
- Migration creates all PRD tables (`profiles`, `relocation_profiles`, `roadmap_steps`, `recommendations`, `consultations`, `services`, `knowledge_base`, `blog_posts`, `partners`) plus `app_role` enum + `user_roles` table + `has_role()` security-definer (admin gating, per platform rules — roles NEVER on profiles).
- GRANTs + RLS on every table: users read/write only their own rows; `blog_posts` / `services` publicly readable when `published`/`active`; admin-only writes everywhere via `has_role(auth.uid(),'admin')`.
- Trigger `handle_new_user` → auto-create `profiles` row on signup.
- Auth: email/password + Google (via `lovable.auth.signInWithOAuth`, broker). `/auth` page with sign in / sign up, `/reset-password` page.
- `_authenticated/route.tsx` is integration-managed — I won't author it; protected routes go under `src/routes/_authenticated/`.

## Phase 3 — Assessment + AI Roadmap generation

- `/assessment` multi-step wizard (6 steps per PRD), progress bar, zod-validated, anonymous-friendly (saves to `localStorage` until signup, then persists to `relocation_profiles`).
- Last step → "Create account to see your plan" → signup → redirect to dashboard.
- Server function `generateRoadmap` (auth-protected, `requireSupabaseAuth`):
  - Calls Lovable AI Gateway (Gemini) with a Valencia-specialized system prompt (always includes the "not legal advice" disclaimer).
  - Uses AI SDK `Output.object` schema → `{ summary, roadmap_steps[], recommendations[] }`.
  - Persists `generated_plan` JSON + inserts rows into `roadmap_steps` and `recommendations`.
- Loading state with progress messaging; error handling for 429/402 (rate limit / credits).

## Phase 4 — Private dashboard

Under `/_authenticated/dashboard/...`:
- Overview: progress %, next actions, profile summary.
- **My Roadmap**: vertical timeline grouped by category, status toggles (todo/in-progress/done), due dates — mutations update `roadmap_steps`.
- **My Checklist**: flat actionable list filtered from roadmap, checkbox-driven.
- **Recommendations**: cards from `recommendations`.
- **Resources**: list from `knowledge_base` (locale-aware).
- **Services**: catalog from `services` + "Book consultation" → inserts `consultations` row.
- **Account**: profile editor (name, language, nationality).

## Phase 5 — Admin panel + polish

Under `/_authenticated/admin/...` (gated by `has_role('admin')` + `_admin` pathless layout):
- Users, Leads (consultations), Services CRUD, Knowledge base CRUD, Partners CRUD, Blog post editor, basic Analytics (counts + recent activity).
- Mobile QA pass on all routes, SEO meta + `public/llms.txt` + `public/robots.txt` + sitemap, accessibility pass (focus states, alt text, contrast).

---

## Technical notes

- **Tables/RLS**: every table gets GRANTs + RLS in the same migration. User-owned tables scoped via `auth.uid() = user_id`. Public reads (blog/services) scoped to `published = true` / `active = true`. Admin writes via `has_role(auth.uid(),'admin')`.
- **AI safety**: system prompt forbids binding legal advice; UI shows a persistent disclaimer on roadmap/recommendation surfaces.
- **i18n**: all user-facing strings via `t()`; AI prompts switch language based on `profiles.language`.
- **Server boundaries**: all Supabase writes/AI calls via `createServerFn` (not in loaders of public routes); admin actions via `requireSupabaseAuth` + role check inside the handler.
- **Out of MVP** (per PRD): online payments, marketplace, mobile app, advanced doc management, CRM integrations.

---

## What I'd like to confirm before starting Phase 1

Nothing blocking — I'll proceed phase by phase and pause for your review after each phase ships. If you want a different order (e.g. dashboard mock before backend), say so now; otherwise I'll start with Phase 1 as soon as you approve.
