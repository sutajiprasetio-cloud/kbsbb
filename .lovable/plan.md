## Goal

Turn KBSBB into a dynamic CMS: a secure admin panel at `/admin` powered by Lovable Cloud (Postgres + Auth + Storage), with the existing public pages reading from the database so every edit appears live. The current site stays intact — pages keep their design and fall back to their current static content when tables are empty.

Because this covers 13 content modules, auth, donations, media, settings, and roles, I'll deliver it in **5 phases**. Each phase is fully working on its own — you can review, request changes, and only then move on.

---

## Phase 1 — Foundation (auth, roles, admin shell, dashboard)

**Backend (Lovable Cloud)**
- Enable Lovable Cloud.
- `profiles` table (name, avatar) linked to `auth.users`.
- `app_role` enum (`super_admin`, `admin`, `editor`) + separate `user_roles` table + `has_role()` security-definer function (privilege-escalation safe).
- Trigger auto-creating a profile on signup; first user promoted to `super_admin`.
- RLS on everything: public tables readable by `anon`, writes restricted to admins/editors via `has_role`.

**Auth**
- `/auth` — login + signup (email/password, Google optional later).
- `/auth/forgot-password` + `/reset-password` pages.
- `_authenticated/` route gate; `_authenticated/admin` requires `admin` or `super_admin`.
- Change password inside admin profile menu.

**Admin shell**
- New route tree `/admin/*` with a modern sidebar layout (collapsible, mobile drawer), topbar with user menu, breadcrumbs, dark mode reused from the site.
- Dashboard: stat cards (donations total/count, donors, volunteers, programs), latest 5 news, recent activity feed (from an `activity_log` table written by triggers on key tables).
- Toast notifications (`sonner`) + form validation (`zod` + `react-hook-form`) as the standard everywhere.

**Deliverable:** you can sign up, get promoted to super admin, log into `/admin`, and see the dashboard. Public site unchanged.

---

## Phase 2 — Core content modules (public site goes dynamic)

CRUD in admin + public pages read from DB (with static fallback so nothing breaks empty).

- Hero Slider (image, title, subtitle, CTA, order, active)
- About + Vision & Mission (single-row settings)
- Programs
- News (title, slug, cover, body, published_at, status)
- Events (title, date, location, cover, body)
- Gallery (image, caption, album)
- Testimonials
- Partners (logo, name, url)
- Team Members
- FAQ (question, answer, order)
- Contact Information (single-row settings)

Each module gets: list page with **search + pagination + sort**, create/edit form with validation, delete confirmation, image upload where relevant, optimistic UI, toasts.

Data tables built on `@tanstack/react-table` + shadcn.

**Deliverable:** every listed public page reads live from the CMS.

---

## Phase 3 — Donations

- `donation_categories`, `donation_campaigns` (goal, raised, cover, deadline, status), `donations` (donor, amount, campaign, method, status, note), `donors` (auto-upserted from donations).
- Admin: campaign CRUD, donor database with search, donations table with status filter, **manual confirmation** action, CSV export, reports (totals by campaign / month, simple charts with `recharts`).
- Public `/donate` page: live campaigns with real progress bars; donation form writes a `pending` donation (payment gateway integration out of scope — flagged as follow-up).
- Volunteers module: public `/volunteer` form writes to `volunteers` table; admin list + status (`new` / `contacted` / `active` / `archived`).

**Deliverable:** end-to-end donation & volunteer intake, fully manageable.

---

## Phase 4 — Media library & settings

- Storage bucket `media` (public). Media library UI: grid view, upload (drag & drop, multi-file), preview, search by name, delete, copy URL, "pick" mode reused inside every CRUD form's image field.
- Video support (upload + external embed URL).
- Settings module (single-row `site_settings`): logo, favicon, site name/tagline, social links (IG/FB/YT/TikTok/LinkedIn/WhatsApp), contact email, Google Maps embed, SEO defaults (title, description, OG image). Header/footer/root metadata read from this row.

**Deliverable:** non-technical admins can rebrand and re-SEO the site without touching code.

---

## Phase 5 — User management & polish

- User management page (super admin only): list users, invite by email, assign/remove roles, deactivate, view last login.
- Activity log viewer with filters.
- Audit: role changes and destructive actions are logged.
- Final pass: mobile admin polish, empty states, loading skeletons, 403/404 pages inside admin, security scan.

---

## Tech / conventions

- Stack stays the same: TanStack Start, TanStack Query, shadcn/ui, Tailwind, Lovable Cloud (Supabase under the hood).
- Roles via `user_roles` + `has_role()` — never on `profiles` (security requirement).
- All mutations via `createServerFn` with `requireSupabaseAuth` middleware where writes need auth; RLS as second line of defense.
- Public reads use narrow `TO anon` SELECT policies (no service-role in loaders).
- Folder layout:
  ```text
  src/routes/
    admin/                     ← admin shell + modules
    auth.tsx, reset-password.tsx
  src/features/<module>/       ← queries, mutations, forms, tables
  src/components/admin/        ← shared admin UI (DataTable, PageHeader, …)
  ```

---

## What I'd like to confirm before starting Phase 1

1. **Green-light Phase 1 now?** I'll enable Lovable Cloud, build auth + admin shell + dashboard, then hand back for review before Phase 2.
2. **First admin account:** should the very first user who signs up be auto-promoted to `super_admin`? (Recommended — otherwise there's no way in.)
3. **Payment gateway for donations (Phase 3):** Midtrans, Xendit, Stripe, or manual/bank-transfer only for now? (Manual is fine to start; gateway can be added later.)
4. **Google sign-in on the admin login page:** yes or email/password only?

Reply with answers (or just "go") and I'll start Phase 1.
