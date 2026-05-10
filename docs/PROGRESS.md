# Mock Commerce Frontend — progress and agent checkpoints

**Role:** Living source of truth for product scope, phased delivery, backend alignment, and **what is actually built**. Canonical API shapes live in **`docs/swagger.json`** — this file is for orientation, planning, and handoff.

**When to open this file:** Before implementing routes, data fetching, or admin flows; after shipping a milestone (append progress log); when resuming work after a gap.

---

## Agent checkpoints (read first)

Use this list as a **fast re-orient** whenever you return to the repo.

1. **Contract:** `docs/swagger.json` (Swagger 2.0). Host in file is `localhost:8080` — override in env when wiring HTTP.
2. **Current phase:** §4.1–4.2 are **implemented in code**; polish or backend-driven edge cases may still need owner review.
3. **What exists:** §5 — snapshot table; grep `src/app` if the table might be stale. Internal: `/login`, admin shell, **categories / products / variants** CRUD; **orders** list + detail/edit dialogs + PATCH flows; public **`/order/[orderNumber]`** tracking page.
4. **Deferred:** §4 — cart, checkout, Midtrans, post-payment flows (unless Swagger already lists them and product asks to ship).
5. **Implementation order (done for §4.1–4.2):** Admin orders + public tracking shipped; next passes are QA / owner tweaks.
6. **Do not** duplicate full OpenAPI schemas here — generate TS types or follow `$ref` from Swagger.
7. **Style / decisions:** When building **admin orders**, match **other admin pages** (tables, headers, dialogs, spacing) unless the owner specifies an exception. **Ask before large improvisations** or architectural one-offs.

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
- **Order tracking (public):** `GET /order/{orderNumber}` — customer-facing page at **`/order/[orderNumber]`** (App Router dynamic segment; same `orderNumber` as in backend email). **Built.**

### Admin / internal (owner)

- **Categories, products, variants** — implemented and working against Swagger.
- **Orders** — admin UI integrated with list/detail/PATCH flows (see §5 snapshot).
- **Email:** Backend will send customers a link to the public tracking URL; FE only needs the page + correct client fetch.

---

## 4. Execution phases and deferrals

### Shipped (high level)

- **Responsive storefront** with public API integration (categories, products, product detail, filters/sort/pagination as scoped).
- **Internal admin:** auth, shell, **categories**, **products**, and **variants** CRUD aligned with Swagger and consistent admin patterns.

### 4.1 Remaining work — admin orders (`/admin/orders`)

Implement end-to-end against Swagger; **mirror layout and components** from categories / products / variants admin unless the owner calls out an exception.

| # | Task |
|---|------|
| 1 | **`orders-view.tsx`:** Make the data table **as compelling** as other admin list pages (same kit: `DataTable`, `PageHeader`, density, actions column patterns). |
| 2 | **Row actions:** Add **View detail** on every row (navigation or dialog per existing admin conventions). |
| 3 | **Edit:** Edit opens a dialog (or same pattern as other admin edits) but must **prefetch via admin get order detail** (`GET /admin/orders/{id}`) so all fields needed for three sections are available. |
| 4 | **Three edit domains (three `PATCH` endpoints in Swagger):** (a) `.../order-detail`, (b) `.../customer-detail`, (c) `.../shipping-detail`. **Disable** all section inputs until the admin clicks **Edit** for that section; then allow **Save** for that section only. |
| 5 | **Two tables on the orders admin page:** **Top:** prominent “**active**” orders (statuses treated as active per API: e.g. pending / processing / shipped — follow Swagger list filter semantics). **Bottom:** **order history** (delivered / cancelled / history filter). |
| 6 | **History UX:** History is a **separate section** below the active table, **collapsed inside a dropdown** (or disclosure) **default closed** so admins are not overwhelmed. |
| 7 | **Lifecycle rule:** When the admin **completes** “update order detail” (all inputs **required** while that section is in edit mode), the order should **move from the active table to the history table** (reflect backend status change after save; if BE behavior differs, confirm with owner before faking state on the client). |

### 4.2 Remaining work — public order tracking

| # | Task |
|---|------|
| 1 | New route **`/order/[orderNumber]`** (Next dynamic segment; corresponds to Swagger **`GET /order/{orderNumber}`**). Purpose: customer **tracks** order from link in **backend email notification**. |

### Explicitly deferred (broader product)

- **Customer:** Full cart, checkout, Midtrans Snap, payment-success flows — unless/until product prioritizes and APIs are stable.
- **Admin:** Shipment receipt upload / notification email content — backend-driven; FE only if APIs appear in Swagger and scope expands.

**Checkpoint:** After orders + tracking ship, refresh §5 and append §7.

---

## 5. Codebase snapshot

Refresh this table when meaningful files ship.

| Area | Status |
|------|--------|
| App Router | `src/app/layout.tsx`, `src/app/page.tsx`, route groups `(public)/`, `(internal)/` |
| Home shell | `src/features/public/components/navbar.tsx` (path may differ from older docs) |
| Storefront | **Responsive + API-integrated** public flows under `src/app/(public)/` and `src/features/public/` |
| **Public order tracking** | **Built** — `src/app/(public)/order/[orderNumber]/page.tsx` + `src/services/public/order.service.ts` → `GET /order/{orderNumber}` |
| **Internal admin** | **`/login`** — `src/app/(internal)/login/page.tsx`; JWT in `localStorage` via `src/lib/auth-storage.ts` |
| **Admin shell** | **`/admin/*`** — sidebar + auth gate: `src/app/(internal)/admin/layout.tsx`, `src/features/internal/components/` |
| **Admin categories CRUD** | **Built** — aligned with Swagger |
| **Admin products + variants CRUD** | **Built** — working; services/hooks under `src/services/admin/`, `src/hooks/` |
| **Admin orders** | **Built** — `orders-view.tsx` (active + collapsible history, `Status` query), `order-read-dialog.tsx`, `order-edit-dialog.tsx` (three PATCH sections), `src/services/admin/orders/order.service.ts`, hooks `useAdminOrderDetail` + patch mutations |
| Reusable admin table kit | `src/components/globals/` — `DataTable`, `PageHeader`, `ConfirmDialog`, row action buttons, `inferColumnsFromKeys` — **use as reference for orders** |

---

## 6. API quick reference

**Canonical:** [`docs/swagger.json`](./swagger.json)

| Concern | Paths |
|----------|--------|
| Public categories | `GET /categories`, `GET /categories/{slug}` |
| Public products | `GET /products`, `GET /products/{slug}` |
| **Public order tracking** | **`GET /order/{orderNumber}`** — customer track page |
| Auth | `POST /login`, `POST /register` |
| Admin categories | `GET/POST /admin/categories`, `GET/PUT/DELETE /admin/categories/{id}` |
| Admin products | `GET/POST /admin/products`, `GET/PUT/DELETE /admin/products/{id}` |
| Admin variants | `GET/POST /admin/products/{id}/variants`, `GET/PUT/DELETE /admin/products/{id}/variants/{variantId}` |
| **Admin orders** | **`GET /admin/orders?Status=`** `active` \| `history` (active = pending/processing/shipped; history = delivered/cancelled per Swagger), **`GET /admin/orders/{id}`**, **`PATCH /admin/orders/{id}/order-detail`**, **`PATCH /admin/orders/{id}/customer-detail`**, **`PATCH /admin/orders/{id}/shipping-detail`** |

---

## 7. Progress log

Append a row for meaningful milestones (docs, features, infra).

| Date | Note |
|------|------|
| 2026-04-30 | Added `docs/PROJECT_CONTEXT.md`: scope, phased roadmap, Swagger alignment, deferred checkout/orders. |
| 2026-05-04 | Renamed/repurposed to `docs/PROGRESS.md`: agent checkpoints, same scope content; removed `PROJECT_CONTEXT.md`. |
| 2026-05-04 | Internal admin: `/login` (email/password), `/admin` shell with sidebar (Categories, Products, Variants, Orders), full **Categories** CRUD vs Swagger; JWT in `localStorage` + axios interceptors; stub pages + empty modules for other admin domains. |
| 2026-05-10 | **Shipped §4.1–4.2:** Admin **orders** — active table (highlighted) + **collapsible history** (history list fetched only after expand), row **View** / **Edit**, read-only dialog + edit dialog prefetched via **`GET /admin/orders/{id}`**, three independently gated **PATCH** sections (order / customer / shipping; saving **order detail** closes dialog so refreshed lists reflect a move to history when BE marks delivered/cancelled). List query uses Swagger **`Status`**. Public **`/order/[orderNumber]`** (server) for email deep links → **`GET /order/{orderNumber}`**. Validate against real API envelopes if they differ from Swagger. |

---

## 8. Notes for future agents

- Navbar, product routes, admin CRUD including **orders**, and public order tracking have shipped; refine against real API responses if envelopes differ from Swagger.
- If `README.md` still points here, keep it as the primary **human + agent** onboarding link for scope and phase.
- **Orders admin:** Treat **categories/products/variants** screens as the visual and interaction reference. **Ask the owner** before big decisions or improvisation.
