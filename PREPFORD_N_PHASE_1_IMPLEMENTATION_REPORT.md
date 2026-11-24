# PREPFORD-N — PHASE 1 IMPLEMENTATION REPORT

**Project:** PrepFord-N\
**Target Directory:** `C:\Users\gitau\Documents\PrepFord-N`\
**Reference Repositories:**
- `Qlex`: `C:\Users\gitau\Documents\Qlex`
- `Nurvia-Prep`: `C:\Users\gitau\Documents\Nurvia-Prep`
- Historical `PREform` / `PrepFord`: `C:\Users\gitau\Documents\PrepFord`

**Authorization Status:** Phase 1 Only\
**Implementation Date:** 2026-11-24

---

## 1. Scope and Authorization Reference

This report documents the controlled execution of **Phase 1** in `C:\Users\gitau\Documents\PrepFord-N` under the project owner's Phase 1 Controlled Implementation Authorization, applying the three binding owner decisions:

| Area | Owner Decision | Execution Boundary Applied |
|---|---|---|
| **Decision A — Tenant identity** | `approve_verify` | Verified application and backend tenant identity using read-only live backend evidence; established independent `PrepFord` (`PF`) frontend identity; eliminated client-bundle secret exposure; made zero unauthorized credential, `.env.local`, or backend registration changes. |
| **Decision B — Non-NCLEX routes** | `approve_after_checks` | Completed full 1,674-file dependency audit; verified zero inbound code imports from out-of-scope tracks into NCLEX or shared code; excluded non-NCLEX routes (`ati-teas`, `hesi-a2`, `lpn-nursing`, `rn-nursing`, `pre-nursing`, `cna`, `ged`, `certifications`, `praxis`) non-destructively via middleware + layout `notFound()` guards and NCLEX-only UI navigation scoping; preserved 100% of files on disk for instant recoverability. |
| **Decision C — Subscription checkout** | `approve_transparent` | Inspected `PrepFord-N` and historical `PrepFord` checkout and subscription architectures; implemented an 11-point pre-checkout commercial terms disclosure modal with explicit opt-in consent; removed fabricated client-side cancellation/auto-renew success toasts; hardened callback authority notices; activated zero live financial operations. |

No Phase 2+ activities (design-system overhaul, marketing redesign, auth transformation, learner dashboard rebuild, CAT/IRT exam engine modification, admin RBAC, database migration, or production deployment) were initiated.

---

## 2. Repository Baseline and Working-Tree State

- **Baseline Stack:** Next.js `^15.5.19` (App Router), React `^18.3.1`, TypeScript `^5` (`strict: true`), Tailwind CSS `^4`.
- **Source Inventory:** `1,674` files under `src/` (`496` `page.tsx`, `layout.tsx`, and `route.ts` files) prior to Phase 1, plus `26` existing Phase 0 audit reports under `audit_reports/`.
- **Version Control Baseline:** No `.git` directory exists in `C:\Users\gitau\Documents\PrepFord-N`. In strict compliance with Mandatory Preservation Rule 3 (*"Do not initialize a Git repository, create commits, push, or deploy without separate owner authorization"*), Git was not initialized and recoverability was preserved by keeping all excluded route trees on disk behind reversible middleware and layout guards.
- **Environment & Secrets Baseline:** `.env.local` (`13,978` bytes) was inspected strictly via redacted server-side key checks and was **not modified** (Mandatory Preservation Rule 5). Zero secret values were printed, logged, or recorded in any report or test file.

---

## 3. Reference Architecture and Product Intelligence Summary (Section 3.1)

| Dimension | `Qlex` (`C:\Users\gitau\Documents\Qlex`) | `Nurvia-Prep` (`C:\Users\gitau\Documents\Nurvia-Prep`) | Historical `PrepFord` (`C:\Users\gitau\Documents\PrepFord`) | `PrepFord-N` Phase 1 Baseline Established |
|---|---|---|---|---|
| **Backend & Transport** | Next.js BFF (`/api/*`) -> LexmaCasto `.NET` (`https://explicitbackend.com`) with `backendValidation.ts` secret isolation | Next.js BFF (`/api/*`) -> LexmaCasto `.NET` (`http://108.61.9.189:8008`) | Next.js BFF (`/api/*`) -> custom ASP.NET Core gateway + in-memory fallback catalog (`products.ts`, `subscription-store.ts`) | Preserved Next.js BFF (`apiFetch` -> `/api/*` -> LexmaCasto `.NET`); isolated `SKEW_LINE_APP_KEY` and backend base URLs to server-only scope. |
| **Brand & Identity** | `'Rhenis Nursing'` / `'QC'` via `.env.local` | `APP_NAME = "Nurvia-Prep"` (`NP`) decoupled from `SITE_HEADER_NAME` | `src/lib/brand.ts` (`BRAND.name = "PrepFord"`, `support@prepford.com`, NCLEX-RN & NCLEX-PN positioning) | Established `APP_NAME = "PrepFord"`, `APP_TITLE = "PrepFord"`, `APP_ACRONYM = "PF"`, `support@prepford.com`, decoupled from `SITE_HEADER_NAME`. |
| **Active Pathways** | 6 tracks (`ati-teas`, `hesi-a2`, `lpn-nursing`, `nclex-pn`, `nclex-rn`, `rn-nursing`) | 6 tracks | Strictly `NCLEX-RN` and `NCLEX-PN` (`src/lib/pathway-enforcement.ts`) | Strictly `NCLEX-RN` (`nclex-rn`) and `NCLEX-PN` (`nclex-pn`) via `nclexRouteBoundary.ts`, `middleware.ts`, and layout `notFound()` guards. |
| **Checkout & Subscriptions** | 1-click `SubscriptionItem.tsx` POST to backend; unimplemented cancel toast | Same Dominion BFF flow | Cart + pre-checkout confirmation modal (`cart/page-client.tsx`) + fail-closed `payment-provider.ts` | Preserved Dominion BFF server-authoritative flow; added 11-point pre-checkout commercial terms disclosure modal + fail-closed cancel/auto-renew notice. |

---

## 4. Changes Implemented and Files Affected

### 4.1 Decision A — PrepFord Identity & BFF Secret Isolation (`7` Files)
1. [src/lib/config/config.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/lib/config/config.ts) — Established `APP_NAME = "PrepFord"`, `APP_TITLE = "PrepFord"`, `APP_ACRONYM = "PF"`, PrepFord NCLEX-RN/PN `APP_DESCRIPTION`, `support@prepford.com` fallback emails, and `SITE_HEADER_NAME = process.env.SKEW_LINE_APP_NAME || "PrepFord"`. Removed client-exported `APP_KEY` and `BACKEND` URL arrays.
2. [src/lib/config/siteHeaders.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/lib/config/siteHeaders.ts) — Read `SKEW_LINE_APP_KEY` and `SKEW_LINE_APP_DOMAIN` directly inside `server-only` `getSiteHeaders()` and used `SITE_HEADER_NAME` for `x-site-name` so backend tenant headers remain unchanged.
3. [next.config.ts](file:///c:/Users/gitau/Documents/PrepFord-N/next.config.ts) — Removed `SKEW_LINE_LARAVEL_BASE_URL`, `SKEW_LINE_FASTAPI_BASE_URL`, and `SKEW_LINE_DOTNET_BASE_URL` from client-bundled `nextConfig.env`.
4. [src/app/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/layout.tsx) — Updated root metadata from `'Castoline LMS'` to `'PrepFord — NCLEX-RN & NCLEX-PN Exam Preparation'`.
5. [src/app/(web)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/layout.tsx) — Updated public layout metadata to `PrepFord – NCLEX-RN & NCLEX-PN Exam Prep`.
6. [src/app/(web)/explore/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/explore/page.tsx) — Updated site directory metadata to reference NCLEX-RN and NCLEX-PN only.
7. [src/app/dashboards/nclex-rn/includes/footer/Footer.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-rn/includes/footer/Footer.tsx) & [src/app/dashboards/nclex-pn/includes/footer/Footer.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-pn/includes/footer/Footer.tsx) — Replaced hardcoded `Qlex Nursing` copyright with `{APP_NAME}`.

### 4.2 Decision B — NCLEX-Only Route Boundary & Navigation Alignment (`29` Files)
1. [src/lib/config/nclexRouteBoundary.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/lib/config/nclexRouteBoundary.ts) *(New)* — Central NCLEX-only route boundary module (`ACTIVE_NCLEX_SEGMENTS`, `ACTIVE_NCLEX_DASHBOARDS`, `NCLEX_SEGMENT_DASHBOARD_MAP`, `EXCLUDED_NON_NCLEX_TRACKS`, `isExcludedNonNclexPath()`, `isActiveNclexSegment()`, `resolveNclexDashboardSlug()`).
2. [src/middleware.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/middleware.ts) — Added server-side 404 rewrite gate for any request matching `isExcludedNonNclexPath(req.nextUrl.pathname)`.
3. **12 Excluded Route-Tree Layouts (`notFound()` Guard):**
   - [src/app/(web)/pages/exams/ati-teas/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/ati-teas/layout.tsx)
   - [src/app/(web)/pages/exams/hesi-a2/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/hesi-a2/layout.tsx)
   - [src/app/(web)/pages/exams/lpn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/lpn-nursing/layout.tsx)
   - [src/app/(web)/pages/exams/rn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/rn-nursing/layout.tsx)
   - [src/app/dashboards/ati-teas/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/ati-teas/layout.tsx)
   - [src/app/dashboards/hesi-a2/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/hesi-a2/layout.tsx)
   - [src/app/dashboards/lpn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/lpn-nursing/layout.tsx)
   - [src/app/dashboards/rn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/rn-nursing/layout.tsx)
   - [src/app/web/(livexams)/ati-teas/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/ati-teas/vista/exam/(layout)/layout.tsx)
   - [src/app/web/(livexams)/hesi-a2/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/hesi-a2/vista/exam/(layout)/layout.tsx)
   - [src/app/web/(livexams)/lpn-nursing/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/lpn-nursing/vista/exam/(layout)/layout.tsx)
   - [src/app/web/(livexams)/rn-nursing/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/rn-nursing/vista/exam/(layout)/layout.tsx)
4. **15 Shared Navigation, Discovery, Search, DIY Builder & Access-Gate Files:**
   - [src/lib/config/siteLinks.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/lib/config/siteLinks.ts)
   - [src/app/(web)/includes/navbar/index.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/includes/navbar/index.tsx)
   - [src/app/(web)/pages/entrance/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/entrance/page.tsx)
   - [src/app/(web)/pages/notes/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/notes/page.tsx)
   - [src/app/(web)/pages/shop/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/shop/page.tsx)
   - [src/app/(web)/pages/(more)/blogs/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/(more)/blogs/page.tsx)
   - [src/app/(web)/pages/actions/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/actions/page.tsx)
   - [src/app/(web)/pages/resources/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/resources/page.tsx)
   - [src/app/(web)/pages/home/home.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/home/home.tsx)
   - [src/app/(web)/pages/create/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/create/page.tsx)
   - [src/app/(web)/pages/seek/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/seek/page.tsx)
   - [src/components/common/modals/seek/SeekModal.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/components/common/modals/seek/SeekModal.tsx)
   - [src/components/common/dashboards/modals/DashboardsAccessGate.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/components/common/dashboards/modals/DashboardsAccessGate.tsx)
   - [src/app/dashboards/nclex-rn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-rn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx)
   - [src/app/dashboards/nclex-pn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-pn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx)
   - [src/app/(web)/auth/update/2fa/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/auth/update/2fa/page.tsx)

### 4.3 Decision C — Transparent Subscription Checkout (`5` Files)
1. [src/app/(web)/pages/subscription/item/SubscriptionItem.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/subscription/item/SubscriptionItem.tsx) — Implemented the 11-point Transparent Checkout Review & Disclosure Modal with explicit unchecked-by-default learner consent prior to calling `dominionService("SubscriptionPackage", "Store", ...)`.
2. [src/app/dashboards/nclex-rn/vista/subscriptions/packages/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-rn/vista/subscriptions/packages/page.tsx) & [src/app/dashboards/nclex-pn/vista/subscriptions/packages/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-pn/vista/subscriptions/packages/page.tsx) — Removed fabricated client-side `"Cancelled Successfully"` / `"Auto Renew Updated"` success toasts and replaced them with a fail-closed informational notice referencing the Subscription ID.
3. [src/app/(web)/pages/subscription/package/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/subscription/package/page.tsx) — Resolved `dashboard` via `resolveNclexDashboardSlug` (`nclex-rn` default) and added an explicit server-authority verification notice.
4. [src/app/web/(livexams)/partials/subscription/AlertModal.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/partials/subscription/AlertModal.tsx) — Replaced `"View Our Cheap Subscription Plans"` with `"View Subscription Plans & Pricing"` and routed dynamically to `/dashboards/nclex-{rn,pn}/vista/subscriptions/items`.

### 4.4 Testing & Type Configuration (`2` Files)
1. [tests/phase1-foundation.test.ts](file:///c:/Users/gitau/Documents/PrepFord-N/tests/phase1-foundation.test.ts) *(New)* — 10 automated unit and contract tests covering Decisions A, B, and C.
2. [tsconfig.json](file:///c:/Users/gitau/Documents/PrepFord-N/tsconfig.json) — Added `"allowImportingTsExtensions": true` (matching `Qlex/tsconfig.json`) so Node native TypeScript test imports typecheck cleanly under `noEmit: true`.

---

## 5. Tests and Verification Results Summary

Full command outputs and evidence are recorded in [PREPFORD_N_PHASE_1_VERIFICATION.md](file:///c:/Users/gitau/Documents/PrepFord-N/PREPFORD_N_PHASE_1_VERIFICATION.md):

| Check | Command | Result |
|---|---|---|
| **Phase 1 Unit & Contract Test Suite** | `node --test tests/phase1-foundation.test.ts` | **PASS (`10/10` tests, `0` failures)** |
| **ESLint (All Modified & Added Phase 1 Files)** | `node .\node_modules\eslint\bin\eslint.js ...` | **PASS (`0` errors, `0` warnings)** |
| **TypeScript Compiler Typecheck** | `run_typecheck.cjs` (`ts.createIncrementalProgram`) | **PASS (`0` diagnostics across `1,615` project files)** |
| **Read-Only Live Backend Identity Probe** | `probe_tenant.mjs` & `probe_sub_and_license.mjs` against `http://108.61.9.189:8008` | **VERIFIED** (`GET /health` -> `200 "healthy"`; verified `x-site-key` `WEBSITE_1`..`WEBSITE_11` scoping vs `x-site-key: "PrepFord"` returning `0` records) |

---

## 6. Known Limitations, Outstanding Risks, and Deferred Work

1. **Unresolved Backend Tenant Registration (`Decision A` Escalation):**
   - The authoritative LexmaCasto backend currently scopes all `NCLEX RN` and `NCLEX PN` records to `WEBSITE_1`..`WEBSITE_11` and does not recognize `x-site-key: "PrepFord"`. `PrepFord-N` currently operates using the existing 10-character `WEBSITE_*` key in `.env.local` (shared with `Nurvia-Prep`). Dedicated backend tenant registration or exclusive assignment of that `WEBSITE_*` key requires backend-owner action.
2. **Backend Self-Service Cancellation & Auto-Renew Endpoints (`Decision C` Deferred Work):**
   - The LexmaCasto backend route keys for learner-initiated cancellation and auto-renew toggling are not yet wired in `dominionService.ts`. The UI now fails closed and directs learners to support with their Subscription ID rather than fabricating success.
3. **Later-Phase Security & Architecture Items (Deferred to Phases 2–10):**
   - Non-`HttpOnly` `document.cookie` storage for `skew_blanc_session_line` / `skew_blanc_session_badge`, auth route console logging cleanup, server-side middleware auth gating, and exam-submission debounce flushing belong to Phases 4, 6, and 8 and were intentionally not modified in Phase 1.

---

## 7. Rollback Considerations

Every Phase 1 change is modular and non-destructive:
- **Zero File Deletions:** All `744` files in the four excluded track directories (`ati-teas`, `hesi-a2`, `lpn-nursing`, `rn-nursing`) remain intact on disk.
- **Zero `.env.local` or Database Modifications:** No environment secrets or backend database records were altered.
- **File-Level Rollback:** Any individual Decision A, B, or C change can be rolled back by reverting the specific file edits listed in Section 4.
