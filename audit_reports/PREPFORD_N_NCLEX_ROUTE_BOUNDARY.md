# PREPFORD-N — NCLEX ROUTE BOUNDARY AND EXCLUSION REPORT

**Project:** PrepFord-N\
**Workspace:** `C:\Users\gitau\Documents\PrepFord-N`\
**Phase:** Phase 1 Controlled Implementation\
**Owner Decision Reference:** Decision B — `approve_after_checks`\
**Active Product Scope:** `NCLEX-RN` (`nclex-rn`) and `NCLEX-PN` (`nclex-pn`) only\
**Verification Date:** 2026-11-24

---

## 1. Executive Summary

Under Owner Decision B (`approve_after_checks`), a complete route and dependency inventory was executed across all `1,674` source files (`496` Next.js `page.tsx`, `layout.tsx`, and `route.ts` files) in `PrepFord-N` prior to excluding any non-NCLEX route.

### Key Dependency & Boundary Findings
1. **Zero Inbound Code Imports from Out-of-Scope Route Trees:** Static import analysis across the entire `src/` directory confirmed **`0` inbound imports** from any of the four out-of-scope track directories (`ati-teas`, `hesi-a2`, `lpn-nursing`, `rn-nursing`) into `nclex-rn`, `nclex-pn`, `(web)`, `components/`, `lib/`, or `web/(livexams)/partials/`.
2. **Shared Infrastructure Used by Both In-Scope and Out-of-Scope Tracks:**
   - All `61` BFF API Route Handlers (`src/app/api/**`), all hooks (`src/lib/hooks/**`), all services (`src/lib/services/**`), all contexts (`src/lib/contexts/**`), all shared dashboard modules (`src/app/dashboards/shared/**`), all 38 question-type renderers and live exam partials (`src/app/web/(livexams)/partials/**`), and all common UI components (`src/components/**`) are shared infrastructure required by `NCLEX-RN` and `NCLEX-PN`.
3. **29 Shared Navigation, Discovery, Search, and Modal References Found:**
   - Shared public and exam components contained hardcoded fallback defaults (`DEFAULT_DASHBOARD = "ati-teas"`, `CURRENT_PANEL = "ati-teas"`, `router.push("/dashboards/ati-teas/vista/subscriptions/items")`) and multi-pathway `SEGMENT_DASHBOARD_MAP` entries that routed learners into out-of-scope pathways.
4. **Controlled, Non-Destructive, Reversible Exclusion Implemented:**
   - In accordance with Decision B (*"Do not delete large route trees, entire directories, database entities, API handlers, or content structures"* and *"Preserve recoverability through an appropriate Git baseline or documented file-level recovery procedure"*), out-of-scope routes were excluded via:
     1. Authoritative boundary policy module: [nclexRouteBoundary.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/lib/config/nclexRouteBoundary.ts)
     2. Server/Edge middleware 404 gate: [middleware.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/middleware.ts)
     3. Layout-level `notFound()` guards across all `12` top-level out-of-scope route layouts
     4. NCLEX-only scoping across all shared navigation, discovery, search, DIY builder, callback, and access-gate modules.
   - **Zero files or directories were deleted from disk**, ensuring 100% deterministic file-level recoverability without requiring Git initialization.

---

## 2. Active NCLEX-RN and NCLEX-PN Route Inventory

### 2.1 Active NCLEX-RN Routes (`SHARED_PRESERVE` / Active In-Scope)

| Route Pattern | Source Location | Purpose |
|---|---|---|
| `/pages/exams/nclex-rn` | [src/app/(web)/pages/exams/nclex-rn/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/nclex-rn/page.tsx) | Public NCLEX-RN pathway overview & subscription plan catalogue |
| `/dashboards/nclex-rn` | [src/app/dashboards/nclex-rn/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-rn/page.tsx) | Primary NCLEX-RN learner dashboard, analytics summary, and DIY exam launcher |
| `/dashboards/nclex-rn/auth/login` | `src/app/dashboards/nclex-rn/auth/login/page.tsx` | NCLEX-RN dashboard sign-in |
| `/dashboards/nclex-rn/auth/register` | `src/app/dashboards/nclex-rn/auth/register/page.tsx` | NCLEX-RN dashboard registration |
| `/dashboards/nclex-rn/auth/logout` | `src/app/dashboards/nclex-rn/auth/logout/page.tsx` | NCLEX-RN dashboard sign-out |
| `/dashboards/nclex-rn/auth/account/**` | `src/app/dashboards/nclex-rn/auth/account/{show,edit,support,recovery/*,security/*,verify/*}/page.tsx` | Learner profile, password/PIN, 2FA, and verification management (9 routes) |
| `/dashboards/nclex-rn/vista/assessment/assessments/**` | `src/app/dashboards/nclex-rn/vista/assessment/assessments/{absolute,distinct,distinct/overview,relative}/page.tsx` | NCLEX-RN assessment discovery (4 routes) |
| `/dashboards/nclex-rn/vista/assessment/exams/**` | `src/app/dashboards/nclex-rn/vista/assessment/exams/{absolute,distinct,distinct/overview,progress/absolute,reports/absolute,reports/distinct,reports/relative,results/distinct}/page.tsx` | NCLEX-RN exams, progress analytics, attempt reports, and distinct results review (8 routes) |
| `/dashboards/nclex-rn/vista/learning/**` | `src/app/dashboards/nclex-rn/vista/learning/{programs,courses,subjects}/**/page.tsx` | NCLEX-RN learning hierarchy (programs, courses, subjects, study notes — 13 routes) |
| `/dashboards/nclex-rn/vista/subscriptions/items` | [src/app/dashboards/nclex-rn/vista/subscriptions/items/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-rn/vista/subscriptions/items/page.tsx) | NCLEX-RN subscription plan catalogue & checkout initiation |
| `/dashboards/nclex-rn/vista/subscriptions/packages` | [src/app/dashboards/nclex-rn/vista/subscriptions/packages/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-rn/vista/subscriptions/packages/page.tsx) | NCLEX-RN active/historical learner subscription packages |
| `/dashboards/nclex-rn/vista/pages/**` | `src/app/dashboards/nclex-rn/vista/pages/{about-us,contact-us,support,terms-of-service}/page.tsx` | NCLEX-RN dashboard informational & support pages (4 routes) |
| `/web/nclex-rn/vista/exam/{atlas,cascade,classic,generic,glacial,orbit,pulse,zen}` | `src/app/web/(livexams)/nclex-rn/vista/exam/(layout)/{atlas,cascade,classic,generic,glacial,orbit,pulse,zen}/page.tsx` | NCLEX-RN live examination engine across 8 exam layouts (8 routes) |

### 2.2 Active NCLEX-PN Routes (`SHARED_PRESERVE` / Active In-Scope)

| Route Pattern | Source Location | Purpose |
|---|---|---|
| `/pages/exams/nclex-pn` | [src/app/(web)/pages/exams/nclex-pn/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/nclex-pn/page.tsx) | Public NCLEX-PN pathway overview & subscription plan catalogue |
| `/dashboards/nclex-pn` | [src/app/dashboards/nclex-pn/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-pn/page.tsx) | Primary NCLEX-PN learner dashboard, analytics summary, and exam launcher |
| `/dashboards/nclex-pn/auth/**` | `src/app/dashboards/nclex-pn/auth/{login,register,logout,account/**}/page.tsx` | NCLEX-PN dashboard auth & account security pages (12 routes) |
| `/dashboards/nclex-pn/vista/assessment/**` | `src/app/dashboards/nclex-pn/vista/assessment/{assessments,exams}/**/page.tsx` | NCLEX-PN assessment discovery, exams, progress analytics, reports, and results (12 routes) |
| `/dashboards/nclex-pn/vista/learning/**` | `src/app/dashboards/nclex-pn/vista/learning/{programs,courses,subjects}/**/page.tsx` | NCLEX-PN learning hierarchy (13 routes) |
| `/dashboards/nclex-pn/vista/subscriptions/{items,packages}` | [src/app/dashboards/nclex-pn/vista/subscriptions/items/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-pn/vista/subscriptions/items/page.tsx), [packages/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-pn/vista/subscriptions/packages/page.tsx) | NCLEX-PN subscription plan catalogue & learner subscription packages (2 routes) |
| `/dashboards/nclex-pn/vista/pages/**` | `src/app/dashboards/nclex-pn/vista/pages/{about-us,contact-us,support,terms-of-service}/page.tsx` | NCLEX-PN dashboard informational & support pages (4 routes) |
| `/web/nclex-pn/vista/exam/{atlas,cascade,classic,generic,glacial,orbit,pulse,zen}` | `src/app/web/(livexams)/nclex-pn/vista/exam/(layout)/{atlas,cascade,classic,generic,glacial,orbit,pulse,zen}/page.tsx` | NCLEX-PN live examination engine across 8 exam layouts (8 routes) |

---

## 3. Out-of-Scope Route Inventory & Classification Matrix

All affected routes, directories, and shared modules were audited against the 8 mandatory checks in Decision B and classified using the required taxonomy (`SAFE_TO_EXCLUDE`, `SHARED_PRESERVE`, `REQUIRES_REFACTORING`, `REQUIRES_OWNER_DECISION`, `NOT_YET_VERIFIED`).

| Item / Route Group | File Count | Inbound Imports from NCLEX/Shared | Classification | Phase 1 Disposition |
|---|---|---|---|---|
| `/pages/exams/ati-teas` (`src/app/(web)/pages/exams/ati-teas/{layout,page}.tsx`) | 2 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `layout.tsx`. Files preserved on disk. |
| `/pages/exams/hesi-a2` (`src/app/(web)/pages/exams/hesi-a2/{layout,page}.tsx`) | 2 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `layout.tsx`. Files preserved on disk. |
| `/pages/exams/lpn-nursing` (`src/app/(web)/pages/exams/lpn-nursing/{layout,page}.tsx`) | 2 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `layout.tsx`. Files preserved on disk. |
| `/pages/exams/rn-nursing` (`src/app/(web)/pages/exams/rn-nursing/{layout,page}.tsx`) | 2 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `layout.tsx`. Files preserved on disk. |
| `/dashboards/ati-teas/**` (`src/app/dashboards/ati-teas/**` — 35 pages) | 84 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `src/app/dashboards/ati-teas/layout.tsx`. Files preserved on disk. |
| `/dashboards/hesi-a2/**` (`src/app/dashboards/hesi-a2/**` — 35 pages) | 84 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `src/app/dashboards/hesi-a2/layout.tsx`. Files preserved on disk. |
| `/dashboards/lpn-nursing/**` (`src/app/dashboards/lpn-nursing/**` — 35 pages) | 84 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `src/app/dashboards/lpn-nursing/layout.tsx`. Files preserved on disk. |
| `/dashboards/rn-nursing/**` (`src/app/dashboards/rn-nursing/**` — 35 pages) | 84 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `src/app/dashboards/rn-nursing/layout.tsx`. Files preserved on disk. |
| `/web/ati-teas/vista/exam/**` (`src/app/web/(livexams)/ati-teas/**` — 8 layouts) | 100 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `(layout)/layout.tsx`. Files preserved on disk. |
| `/web/hesi-a2/vista/exam/**` (`src/app/web/(livexams)/hesi-a2/**` — 8 layouts) | 100 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `(layout)/layout.tsx`. Files preserved on disk. |
| `/web/lpn-nursing/vista/exam/**` (`src/app/web/(livexams)/lpn-nursing/**` — 8 layouts) | 100 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `(layout)/layout.tsx`. Files preserved on disk. |
| `/web/rn-nursing/vista/exam/**` (`src/app/web/(livexams)/rn-nursing/**` — 8 layouts) | 100 files | 0 | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate + `notFound()` in `(layout)/layout.tsx`. Files preserved on disk. |
| Dead links to `/services/{ati-teas,hesi-a2,ged}`, `/pages/exams/{pre-nursing,cna,ged,certifications,praxis}`, `/dashboards/rn-nusring` | N/A (URLs only) | Referenced in Navbar, Actions, Resources | `SAFE_TO_EXCLUDE` | **Excluded** via `middleware.ts` 404 gate and removed from UI navigation/cards. |
| `src/app/dashboards/shared/**` (`diyExamCreation.tsx`, `diyExamQuestionCreation.tsx`, `DistinctSubjects.tsx`, `ActiveSubscriptionPackage.tsx`) | 4 files | Imported by `nclex-rn` & `nclex-pn` | `SHARED_PRESERVE` | **Preserved intact.** Used directly by NCLEX-RN and NCLEX-PN dashboards and exam pages. |
| `src/app/web/(livexams)/partials/**` (38 question types, toolbar, header, navigator, calculator, modals) | 59 files | Imported by `nclex-rn` & `nclex-pn` exam layouts | `SHARED_PRESERVE` (`AlertModal.tsx`: `REQUIRES_REFACTORING`) | **Preserved intact.** Refactored `AlertModal.tsx` to route dynamically to `/dashboards/nclex-{rn,pn}/vista/subscriptions/items` instead of hardcoded `/dashboards/ati-teas/vista/subscriptions/items`. |
| `src/app/api/**` (BFF Route Handlers for `auth`, `users`, `nexus/strata`, `nexus/dominion/subscription`, `seek`, `media`, `system`) | 61 files | Used by all client services & hooks | `SHARED_PRESERVE` | **Preserved intact.** All backend endpoints are shared between NCLEX-RN and NCLEX-PN. |
| `src/lib/{api,contexts,hooks,services,utils}/**` | 150+ files | Imported across all NCLEX and web modules | `SHARED_PRESERVE` | **Preserved intact.** |
| Shared navigation, discovery, search, DIY builder, callback, and access-gate pages (`Navbar`, `siteLinks.ts`, `entrance`, `notes`, `shop`, `blogs`, `actions`, `resources`, `home`, `create`, `seek`, `SeekModal`, `DashboardsAccessGate`, `VistaHierarchyProgramOutline`, `auth/update/2fa`, `subscription/package`) | 18 files | Shared across `(web)` and NCLEX dashboards | `REQUIRES_REFACTORING` | **Refactored in Phase 1** to scope `SEGMENT_DASHBOARD_MAP`, links, cards, and fallback dashboards exclusively to `nclex-rn` and `nclex-pn`. |
| Backend database records for non-NCLEX programs (`ATI TEAS`, `HESI A2`, `RN Nursing Exams`, `LPN Nursing Exams`) returned by `/api/castoline/strata/learning/programs/list/*` | Backend DB entities | Returned by shared `useRelativeStrataPrograms` hook | `REQUIRES_OWNER_DECISION` | **Preserved untouched on backend.** Filtered safely on the frontend via `NCLEX_SEGMENT_DASHBOARD_MAP` (`NCLEX_RN`, `NCLEX_PN`). |

---

## 4. Shared Dependency & Misclassification Analysis

During dependency verification (Check 4: *"Identify routes that are incorrectly classified as non-NCLEX but contain reusable or shared functionality"*), the following critical shared routes and components were identified as containing hardcoded `"ati-teas"` defaults despite being core NCLEX / platform features:

1. **Custom DIY Exam Builder ([src/app/(web)/pages/create/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/create/page.tsx)):**
   - **Finding:** Although `/pages/create` is the platform-wide custom exam builder, lines 29–30 and 102 hardcoded `TARGET_NAME = "Ati Teas"`, `TARGET_SEGMENT = "ATI_TEAS"`, and `TARGET_PANEL = "ati-teas"`.
   - **Resolution:** Classified as `SHARED_PRESERVE` + `REQUIRES_REFACTORING`. Updated defaults to `TARGET_NAME = "NCLEX-RN"`, `TARGET_SEGMENT = "NCLEX_RN"`, `TARGET_PANEL = "nclex-rn"`, and filtered selectable programs to `NCLEX_RN` and `NCLEX_PN`.
2. **Global Search Page & Modal ([src/app/(web)/pages/seek/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/seek/page.tsx) & [src/components/common/modals/seek/SeekModal.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/components/common/modals/seek/SeekModal.tsx)):**
   - **Finding:** Both global search components hardcoded `const DEFAULT_DASHBOARD = "ati-teas"`, routing every course, subject, exam, and question search result to `/dashboards/ati-teas/...` or `/web/ati-teas/vista/exam/generic`.
   - **Resolution:** Updated `DEFAULT_DASHBOARD` to `"nclex-rn"` and added `resolveSeekDashboard(item)` to route NCLEX-PN items to `"nclex-pn"` and NCLEX-RN items to `"nclex-rn"`.
3. **Live Exam Subscription Alert Modal ([src/app/web/(livexams)/partials/subscription/AlertModal.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/partials/subscription/AlertModal.tsx)):**
   - **Finding:** Shared by all live exam layouts (including `nclex-rn` and `nclex-pn`), but line 63 hardcoded `router.push("/dashboards/ati-teas/vista/subscriptions/items")`.
   - **Resolution:** Updated to resolve the active NCLEX panel from `usePathname()` via `resolveNclexDashboardSlug(pathname)`.
4. **Subscription Checkout Return Callback ([src/app/(web)/pages/subscription/package/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/subscription/package/page.tsx)):**
   - **Finding:** Line 15 defaulted `dashboard` to `"ati-teas"` when the `dashboard` query parameter was absent.
   - **Resolution:** Updated to `resolveNclexDashboardSlug(searchParams.get("dashboard"))` (defaulting to `"nclex-rn"`).
5. **Two-Factor Authentication Settings ([src/app/(web)/auth/update/2fa/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/auth/update/2fa/page.tsx)):**
   - **Finding:** Line 9 hardcoded `const CURRENT_PANEL = "ati-teas"` for its unauthenticated login redirect (`/dashboards/${CURRENT_PANEL}/auth/login`).
   - **Resolution:** Updated `CURRENT_PANEL` to `"nclex-rn"`.

---

## 5. Safe Exclusions Completed & Files Modified

### 5.1 Authoritative Boundary & Middleware Enforcement
- Created [src/lib/config/nclexRouteBoundary.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/lib/config/nclexRouteBoundary.ts) defining `ACTIVE_NCLEX_SEGMENTS`, `ACTIVE_NCLEX_DASHBOARDS`, `NCLEX_SEGMENT_DASHBOARD_MAP`, `EXCLUDED_NON_NCLEX_TRACKS`, `isExcludedNonNclexPath()`, `isActiveNclexSegment()`, and `resolveNclexDashboardSlug()`.
- Updated [src/middleware.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/middleware.ts) to intercept any request matching `isExcludedNonNclexPath(req.nextUrl.pathname)` and return an HTTP `404` rewrite to `/_not-found`.

### 5.2 Layout-Level Defense-in-Depth Guards (`12` Files)
Added `notFound()` from `next/navigation` to all 12 top-level out-of-scope layout files:
1. [src/app/(web)/pages/exams/ati-teas/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/ati-teas/layout.tsx)
2. [src/app/(web)/pages/exams/hesi-a2/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/hesi-a2/layout.tsx)
3. [src/app/(web)/pages/exams/lpn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/lpn-nursing/layout.tsx)
4. [src/app/(web)/pages/exams/rn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/exams/rn-nursing/layout.tsx)
5. [src/app/dashboards/ati-teas/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/ati-teas/layout.tsx)
6. [src/app/dashboards/hesi-a2/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/hesi-a2/layout.tsx)
7. [src/app/dashboards/lpn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/lpn-nursing/layout.tsx)
8. [src/app/dashboards/rn-nursing/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/rn-nursing/layout.tsx)
9. [src/app/web/(livexams)/ati-teas/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/ati-teas/vista/exam/(layout)/layout.tsx)
10. [src/app/web/(livexams)/hesi-a2/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/hesi-a2/vista/exam/(layout)/layout.tsx)
11. [src/app/web/(livexams)/lpn-nursing/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/lpn-nursing/vista/exam/(layout)/layout.tsx)
12. [src/app/web/(livexams)/rn-nursing/vista/exam/(layout)/layout.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/web/(livexams)/rn-nursing/vista/exam/(layout)/layout.tsx)

### 5.3 Shared Navigation, Discovery & Access-Gate Alignment (`16` Files)
1. [src/lib/config/siteLinks.ts](file:///c:/Users/gitau/Documents/PrepFord-N/src/lib/config/siteLinks.ts)
2. [src/app/(web)/includes/navbar/index.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/includes/navbar/index.tsx)
3. [src/app/(web)/pages/entrance/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/entrance/page.tsx)
4. [src/app/(web)/pages/notes/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/notes/page.tsx)
5. [src/app/(web)/pages/shop/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/shop/page.tsx)
6. [src/app/(web)/pages/(more)/blogs/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/(more)/blogs/page.tsx)
7. [src/app/(web)/pages/actions/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/actions/page.tsx)
8. [src/app/(web)/pages/resources/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/resources/page.tsx)
9. [src/app/(web)/pages/home/home.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/home/home.tsx)
10. [src/app/(web)/pages/create/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/create/page.tsx)
11. [src/app/(web)/pages/seek/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/pages/seek/page.tsx)
12. [src/components/common/modals/seek/SeekModal.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/components/common/modals/seek/SeekModal.tsx)
13. [src/components/common/dashboards/modals/DashboardsAccessGate.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/components/common/dashboards/modals/DashboardsAccessGate.tsx)
14. [src/app/dashboards/nclex-rn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-rn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx)
15. [src/app/dashboards/nclex-pn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/dashboards/nclex-pn/includes/sidebar/partials/left/vista/outline/VistaHierarchyProgramOutline.tsx)
16. [src/app/(web)/auth/update/2fa/page.tsx](file:///c:/Users/gitau/Documents/PrepFord-N/src/app/(web)/auth/update/2fa/page.tsx)

---

## 6. Deferred Exclusions & Rollback / Recovery Plan

### 6.1 Deferred Actions
- **Physical File Deletion of Out-of-Scope Route Directories (`744` files across `12` directories):** Deferred intentionally per Decision B (*"Do not delete large route trees, entire directories..."*) and because `PrepFord-N` currently operates without an initialized Git repository (Rule 3 prohibits `git init` without separate owner authorization). Keeping the non-NCLEX files inert on disk behind the `middleware.ts` and `layout.tsx` `notFound()` gates guarantees zero risk of irreversible file loss.
- **Backend Database Filtering of Non-NCLEX Programs/Assessments:** Deferred because the hosted LexmaCasto backend currently shares `WEBSITE_*` target identifiers across sibling applications. Filtering is enforced non-destructively at the `PrepFord-N` presentation and routing boundary.

### 6.2 File-Level Recovery Procedure
Because no files were deleted from disk, any excluded route tree can be restored deterministically by:
1. Removing the track slug from `EXCLUDED_NON_NCLEX_TRACKS` in `src/lib/config/nclexRouteBoundary.ts`.
2. Removing the `notFound()` call from the corresponding track's `layout.tsx` (`src/app/(web)/pages/exams/<track>/layout.tsx`, `src/app/dashboards/<track>/layout.tsx`, and `src/app/web/(livexams)/<track>/vista/exam/(layout)/layout.tsx`).
