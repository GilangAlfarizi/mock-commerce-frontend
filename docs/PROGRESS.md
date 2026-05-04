# Mock Commerce Frontend — progress and agent checkpoints

**Role:** Living source of truth for product scope, phased delivery, backend alignment, and **what is actually built**. Canonical API shapes live in **`docs/swagger.json`** — this file is for orientation, planning, and handoff.

**When to open this file:** Before implementing routes, data fetching, or admin flows; after shipping a milestone (append progress log); when resuming work after a gap.

---

## Agent checkpoints (read first)

Use this list as a **fast re-orient** whenever you return to the repo.

1. **Contract:** `docs/swagger.json` (Swagger 2.0). Host in file is `localhost:8080` — override in env when wiring HTTP.
2. **Current phase:** §4 — Phase 1 (navbar + storefront scaffolding) is the next coding pass unless the progress log says otherwise.
3. **What exists:** §5 — snapshot table; grep `src/app` if the table might be stale. Internal admin: `/login`, `/admin/categories` (CRUD), other `/admin/*` routes may be stubs.
4. **Deferred:** §4 — no cart, checkout, Midtrans, or admin orders until backend exposes them.
5. **Implementation order (storefront):** Home → Products list → Product detail (Phase 2).
6. **Do not** duplicate full OpenAPI schemas here — generate TS types or follow `$ref` from Swagger.

---

## 1. Purpose and audience

- **Humans:** Stable outline of storefront + admin, what is in scope now vs later, and how we align with the backend.
- **Agents:** Quick context without re-reading full chat history; use checkpoints above on every session.

---

## 2. Stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js (App Router under `src/app/`) — this repo may use a non-standard Next; see `AGENTS.md` / `node_modules/next/dist/docs/` if APIs differ from expectations |
| UI | shadcn-style components (`src/components/ui/`) |
| Backend | Separate app; this repo is **frontend only** (storefront + internal admin) |

---

## 3. Long-term vision (full product)

Not all of this exists in code or backend today.

### Storefront (customers)

- **Landing:** Hero / featured imagery, highlights for selected products.
- **Catalog:** Product list with **category multi-select**, **sort by price** (high / low), **pagination**, **product detail** (slug-based, aligned with public API).
- **Later (guest, no login):** Cart, checkout, customer details, **Midtrans Snap**, post-payment email (FE/BE split TBD when APIs exist).

### Admin / internal (owner)

- **Categories, products, variants** management.
- **Later:** Orders list, processing state, shipment tracking receipt, customer email with tracking.

---

## 4. Execution phases and deferrals

### Phase 1 — Navbar + storefront scaffolding (next implementation pass when requested)

Tackle **together** in one pass:

- **Navbar:** Structure, links, styling per product requirements / references.
- **Products (scaffold):** Routes and shell UI for list (placeholders for filter, sort, pagination) and detail (**dynamic `slug`** → `GET /products/{slug}`).

**Checkpoint:** Navigation and route skeletons exist so Phase 2 is incremental UI + data.

### Phase 2 — Storefront pages (one by one)

**Order:** Home → Products → Product detail.

- Wire list: multi-category filter, price sort, pagination to public products API per Swagger.

### Phase 3 — Admin (after storefront MVP)

- **Login** (`POST /login`; `POST /register` if needed).
- **Shell:** Sidebar + layout for internal routes.
- **CRUD:** Categories, products, variants (`/admin/...` paths in Swagger).

### Explicitly deferred

Until backend stabilizes these domains:

- **Customer:** Cart, checkout, Midtrans Snap, payment-success email.
- **Admin:** Orders, processing, shipment receipt, shipment notification email.

**Checkpoint:** Update deferrals when APIs land.

---

## 5. Codebase snapshot

Refresh this table when meaningful files ship.

| Area | Status |
|------|--------|
| App Router | `src/app/layout.tsx`, `src/app/page.tsx`, route groups `(public)/`, `(internal)/` |
| Home shell | `src/features/public/components/navbar.tsx` (path may differ from older docs) |
| Storefront products | `src/app/(public)/products/`, related features under `src/features/public/` |
| **Internal admin** | **`/login`** — `src/app/(internal)/login/page.tsx`; JWT in `localStorage` via `src/lib/auth-storage.ts` |
| **Admin shell** | **`/admin/*`** — sidebar + auth gate: `src/app/(internal)/admin/layout.tsx`, `src/features/internal/components/` |
| **Admin categories CRUD** | **Built** — `src/app/(internal)/admin/categories/page.tsx`, `src/services/admin/categories/`, hooks `useAdminCategories` + category mutations |
| Admin products / variants / orders UI | **Stub routes** — `src/app/(internal)/admin/products|variants|orders/page.tsx`; empty stubs under `src/services/admin/*`, `src/hooks/use-admin-*.ts` |
| Reusable admin table kit | `src/components/globals/` — `DataTable`, `PageHeader`, `ConfirmDialog`, row action buttons, `inferColumnsFromKeys` |

---

## 6. API quick reference

**Canonical:** [`docs/swagger.json`](./swagger.json)

| Concern | Paths |
|----------|--------|
| Public categories | `GET /categories`, `GET /categories/{slug}` |
| Public products | `GET /products`, `GET /products/{slug}` |
| Auth | `POST /login`, `POST /register` |
| Admin categories | `GET/POST /admin/categories`, `GET/PUT/DELETE /admin/categories/{id}` |
| Admin products | `GET/POST /admin/products`, `GET/PUT/DELETE /admin/products/{id}` |
| Admin variants | `GET/POST /admin/products/{id}/variants`, `GET/PUT/DELETE /admin/products/{id}/variants/{variantId}` |

---

## 7. Progress log

Append a row for meaningful milestones (docs, features, infra).

| Date | Note |
|------|------|
| 2026-04-30 | Added `docs/PROJECT_CONTEXT.md`: scope, phased roadmap, Swagger alignment, deferred checkout/orders. |
| 2026-05-04 | Renamed/repurposed to `docs/PROGRESS.md`: agent checkpoints, same scope content; removed `PROJECT_CONTEXT.md`. |
| 2026-05-04 | Internal admin: `/login` (email/password), `/admin` shell with sidebar (Categories, Products, Variants, Orders), full **Categories** CRUD vs Swagger; JWT in `localStorage` + axios interceptors; stub pages + empty modules for other admin domains. |

---

## 8. Notes for future agents

- First roadmap execution was **documentation**; navbar, product routes, and admin UI ship in separate passes when requested (with navbar requirements as needed).
- If `README.md` still points here, keep it as the primary **human + agent** onboarding link for scope and phase.
