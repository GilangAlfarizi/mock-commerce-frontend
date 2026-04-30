# Mock Commerce Frontend — project context and execution roadmap

This document is the shared source of truth for **product scope**, **what is in scope now versus deferred**, **how we align with the backend API**, and a **living progress log**. It is not a substitute for the OpenAPI spec; use it for orientation and planning.

---

## 1. Purpose and audience

- **For you:** A stable outline of the storefront and admin app, phased delivery, and deferred features tied to backend readiness.
- **For agents and contributors:** Quick context before touching routes, data fetching, or admin flows—without re-reading the full chat history.

---

## 2. Stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js (App Router under `src/app/`) |
| UI | shadcn-style components (`src/components/ui/`) |
| Backend | Separate application; this repo is the customer-facing and internal-admin **frontend** only |

---

## 3. Long-term vision (full product)

These capabilities describe the **eventual** product, not necessarily what exists in code or backend today.

### Storefront (customers)

- **Landing:** Hero or featured imagery and highlights for selected products.
- **Catalog:** Product list with **category multi-select** filter, **sort by price** (highest / lowest), **pagination**, and navigation to a **product detail** page (slug-based, aligned with public API).
- **Later — order flow (guest, no customer login):** Cart, checkout page, customer details capture, **Midtrans Snap** for payment, email after successful payment (exact ownership split between backend and frontend TBD when APIs exist).

### Admin / internal (owner)

- Manage **categories**, **products**, and **product variants**.
- **Later — orders:** View orders, change processing state, enter **shipment tracking receipt**, trigger customer email with tracking info.

---

## 4. Current execution focus

Work proceeds in **phases**. API shapes and status codes are defined in the repo’s Swagger file (see §6).

### Phase 1 — Navbar + storefront scaffolding (next implementation pass)

Do this **together** in one pass when you start coding (after this doc exists):

- **Navbar:** Structure, links, and styling per your provided detail, examples, and target look.
- **Products (scaffold):** Routes and shell UI for:
  - **Product list** — layout placeholders or controls for **filter** (category multi-select when wired), **sort** (price high / low), **pagination**.
  - **Product detail** — dynamic route using **slug** to match `GET /products/{slug}` in Swagger.

**Goal:** Navigation and route skeletons exist so Phase 2 is incremental UI and data.

### Phase 2 — Storefront pages, built one by one

**Order:** Home → Products → Product detail.

- Use **`docs/swagger.json`** for response DTOs and query conventions on list/detail endpoints.
- **Products:** Implement real multi-category filter, price sort, and pagination against the public products API as specified in Swagger.

### Phase 3 — Admin (after storefront MVP)

- **Login** (`POST /login` in Swagger; `POST /register` exists if needed).
- **Shell:** Sidebar menu and layout for internal routes.
- **CRUD:** Categories, products, and variants via admin paths in Swagger (`/admin/categories`, `/admin/products`, `/admin/products/{id}/variants`, etc.).

### Explicitly deferred (no backend for this scope yet)

Until the backend exposes and stabilizes these domains:

- **Customer:** Cart, checkout, Midtrans Snap, payment-success email.
- **Admin:** Order list, processing, shipment receipt entry, shipment notification email.

Update this section when those APIs land.

---

## 5. Current codebase snapshot

| Area | Status |
|------|--------|
| App Router | `src/app/layout.tsx`, `src/app/page.tsx`, route group `src/app/(public)/home/` |
| Home shell | `src/features/home/components/navbar.tsx` |
| Product list / filters / sort / pagination / detail routes | **Not built** (Phase 1–2) |
| Admin route group, login, sidebar, CRUD screens | **Not built** (Phase 3) |

---

## 6. API reference

**Canonical contract:** [`docs/swagger.json`](./swagger.json) (Swagger 2.0, host in file is `localhost:8080` — override via environment in the app when implementing).

### Path index (by concern)

| Concern | Paths (from Swagger) |
|----------|----------------------|
| Public categories | `GET /categories`, `GET /categories/{slug}` |
| Public products | `GET /products`, `GET /products/{slug}` |
| Auth | `POST /login`, `POST /register` |
| Admin categories | `GET/POST /admin/categories`, `GET/PUT/DELETE /admin/categories/{id}` |
| Admin products | `GET/POST /admin/products`, `GET/PUT/DELETE /admin/products/{id}` |
| Admin variants | `GET/POST /admin/products/{id}/variants`, `GET/PUT/DELETE /admin/products/{id}/variants/{variantId}` |

Do **not** duplicate full schemas here; generate TypeScript types or read `$ref` definitions from the same file when implementing.

---

## 7. Progress log

| Date | Note |
|------|------|
| 2026-04-30 | Added `docs/PROJECT_CONTEXT.md`: scope, phased roadmap, Swagger alignment, deferred checkout/orders. |

*(Append a new row when meaningful milestones ship.)*

---

## 8. First agreed execution (this doc)

The first execution pass for this roadmap was **documentation only:** this file plus a pointer from `README.md`. Navbar, product routes, and admin UI follow in separate passes when you request implementation and supply navbar requirements where needed.
