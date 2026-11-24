import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  ACTIVE_NCLEX_DASHBOARDS,
  ACTIVE_NCLEX_SEGMENTS,
  NCLEX_SEGMENT_DASHBOARD_MAP,
  isActiveNclexSegment,
  isExcludedNonNclexPath,
  resolveNclexDashboardSlug,
} from "../src/lib/config/nclexRouteBoundary.ts";
import {
  APP_ACRONYM,
  APP_DESCRIPTION,
  APP_NAME,
  APP_TITLE,
} from "../src/lib/config/config.ts";
import { SITE_LINKS } from "../src/lib/config/siteLinks.ts";

const root = process.cwd();
const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

test("Decision A: PrepFord application identity constants are established", () => {
  assert.equal(APP_NAME, "PrepFord");
  assert.equal(APP_TITLE, "PrepFord");
  assert.equal(APP_ACRONYM, "PF");
  assert.match(APP_DESCRIPTION, /NCLEX-RN and NCLEX-PN/);
});

test("Decision A: client-imported config.ts and next.config.ts do not expose SKEW_LINE_APP_KEY or backend base URLs", () => {
  const configTs = read("src/lib/config/config.ts");
  assert.equal(/export const APP_KEY\b/.test(configTs), false);
  assert.equal(/export const BACKEND\b/.test(configTs), false);

  const nextConfig = read("next.config.ts");
  assert.equal(/SKEW_LINE_APP_KEY\s*:/.test(nextConfig), false);
  assert.equal(/SKEW_LINE_DOTNET_BASE_URL\s*:/.test(nextConfig), false);
  assert.equal(/SKEW_LINE_LARAVEL_BASE_URL\s*:/.test(nextConfig), false);
  assert.equal(/SKEW_LINE_FASTAPI_BASE_URL\s*:/.test(nextConfig), false);
});

test("Decision A: siteHeaders.ts is server-only and preserves BFF site-header contract", () => {
  const siteHeaders = read("src/lib/config/siteHeaders.ts");
  assert.match(siteHeaders, /import "server-only"/);
  assert.match(siteHeaders, /"x-site-key":\s*siteKey/);
  assert.match(siteHeaders, /"x-site-domain":\s*siteDomain/);
  assert.match(siteHeaders, /"x-site-name":\s*SITE_HEADER_NAME/);
});

test("Decision B: NCLEX route boundary constants and segment helpers allow only NCLEX-RN and NCLEX-PN", () => {
  assert.deepEqual(ACTIVE_NCLEX_SEGMENTS, ["NCLEX_RN", "NCLEX_PN"]);
  assert.deepEqual(ACTIVE_NCLEX_DASHBOARDS, ["nclex-rn", "nclex-pn"]);
  assert.deepEqual(NCLEX_SEGMENT_DASHBOARD_MAP, {
    NCLEX_RN: "nclex-rn",
    NCLEX_PN: "nclex-pn",
  });

  assert.equal(isActiveNclexSegment("NCLEX_RN"), true);
  assert.equal(isActiveNclexSegment("NCLEX_PN"), true);
  assert.equal(isActiveNclexSegment("nclex-rn"), true);
  assert.equal(isActiveNclexSegment("ATI_TEAS"), false);
  assert.equal(isActiveNclexSegment("HESI_A2"), false);
  assert.equal(isActiveNclexSegment("RN_NURSING"), false);
  assert.equal(isActiveNclexSegment("LPN_NURSING"), false);
});

test("Decision B: isExcludedNonNclexPath blocks out-of-scope routes and permits active NCLEX and shared routes", () => {
  const excludedPaths = [
    "/pages/exams/ati-teas",
    "/pages/exams/hesi-a2",
    "/pages/exams/lpn-nursing",
    "/pages/exams/rn-nursing",
    "/pages/exams/pre-nursing",
    "/pages/exams/cna",
    "/pages/exams/ged",
    "/pages/exams/certifications",
    "/pages/exams/praxis",
    "/dashboards/ati-teas",
    "/dashboards/ati-teas/vista/assessment/exams/absolute",
    "/dashboards/hesi-a2",
    "/dashboards/hesi-a2/auth/login",
    "/dashboards/lpn-nursing",
    "/dashboards/rn-nursing",
    "/dashboards/rn-nusring",
    "/web/ati-teas/vista/exam/generic",
    "/web/hesi-a2/vista/exam/atlas",
    "/web/lpn-nursing/vista/exam/zen",
    "/web/rn-nursing/vista/exam/pulse",
    "/services/ati-teas",
    "/services/hesi-a2",
    "/services/ged",
    "/rn-nursing",
  ];

  for (const p of excludedPaths) {
    assert.equal(isExcludedNonNclexPath(p), true, `Expected ${p} to be excluded`);
  }

  const allowedPaths = [
    "/",
    "/explore",
    "/auth/login",
    "/auth/register",
    "/pages/entrance",
    "/pages/exams/nclex-rn",
    "/pages/exams/nclex-pn",
    "/dashboards/nclex-rn",
    "/dashboards/nclex-rn/vista/subscriptions/items",
    "/dashboards/nclex-pn",
    "/dashboards/nclex-pn/vista/subscriptions/packages",
    "/web/nclex-rn/vista/exam/generic",
    "/web/nclex-pn/vista/exam/atlas",
    "/api/nexus/strata/assessment/exam",
  ];

  for (const p of allowedPaths) {
    assert.equal(isExcludedNonNclexPath(p), false, `Expected ${p} to be allowed`);
  }
});

test("Decision B: resolveNclexDashboardSlug normalizes valid identifiers to nclex-rn or nclex-pn", () => {
  assert.equal(resolveNclexDashboardSlug("nclex-pn"), "nclex-pn");
  assert.equal(resolveNclexDashboardSlug("NCLEX_PN"), "nclex-pn");
  assert.equal(resolveNclexDashboardSlug("/web/nclex-pn/vista/exam/generic"), "nclex-pn");
  assert.equal(resolveNclexDashboardSlug("nclex-rn"), "nclex-rn");
  assert.equal(resolveNclexDashboardSlug("ati-teas"), null);
  assert.equal(resolveNclexDashboardSlug(undefined), "nclex-rn");
});

test("Decision B: all 12 out-of-scope route layouts enforce notFound() while preserving underlying files", () => {
  const excludedLayouts = [
    "src/app/(web)/pages/exams/ati-teas/layout.tsx",
    "src/app/(web)/pages/exams/hesi-a2/layout.tsx",
    "src/app/(web)/pages/exams/lpn-nursing/layout.tsx",
    "src/app/(web)/pages/exams/rn-nursing/layout.tsx",
    "src/app/dashboards/ati-teas/layout.tsx",
    "src/app/dashboards/hesi-a2/layout.tsx",
    "src/app/dashboards/lpn-nursing/layout.tsx",
    "src/app/dashboards/rn-nursing/layout.tsx",
    "src/app/web/(livexams)/ati-teas/vista/exam/(layout)/layout.tsx",
    "src/app/web/(livexams)/hesi-a2/vista/exam/(layout)/layout.tsx",
    "src/app/web/(livexams)/lpn-nursing/vista/exam/(layout)/layout.tsx",
    "src/app/web/(livexams)/rn-nursing/vista/exam/(layout)/layout.tsx",
  ];

  for (const rel of excludedLayouts) {
    const content = read(rel);
    assert.match(content, /\bnotFound\(\)/, `Expected notFound() in ${rel}`);
  }

  const middlewareContent = read("src/middleware.ts");
  assert.match(middlewareContent, /isExcludedNonNclexPath/);
});

test("Decision B: SITE_LINKS contains no out-of-scope exam routes", () => {
  for (const link of SITE_LINKS) {
    assert.equal(
      isExcludedNonNclexPath(link.href),
      false,
      `SITE_LINKS entry ${link.name} points to excluded path ${link.href}`
    );
  }
});

test("Decision C: SubscriptionItem enforces 11-point pre-checkout commercial disclosure and explicit opt-in consent", () => {
  const subItem = read("src/app/(web)/pages/subscription/item/SubscriptionItem.tsx");
  assert.match(subItem, /1\. Subscription Plan Name/);
  assert.match(subItem, /2\. Included Features &amp; Entitlements/);
  assert.match(subItem, /3\. Price &amp; Currency/);
  assert.match(subItem, /4\. Billing Frequency \/ Access Term/);
  assert.match(subItem, /5\. Payment Type \(Recurring vs\. One-Time\)/);
  assert.match(subItem, /6\. Trial Duration &amp; Conversion Terms/);
  assert.match(subItem, /7\. Renewal Conditions/);
  assert.match(subItem, /8\. Cancellation Procedure/);
  assert.match(subItem, /9\. Refund Policy &amp; Applicable Conditions/);
  assert.match(subItem, /10\. Additional Charges or Limitations/);
  assert.match(subItem, /11\. Expiration &amp; Failed Payment Behavior/);
  assert.match(subItem, /const \[termsAccepted, setTermsAccepted\] = useState\(false\)/);
  assert.match(subItem, /disabled=\{!termsAccepted \|\| isSubmitting\}/);
});

test("Decision C: Subscription packages pages do not fabricate cancellation or auto-renew success", () => {
  for (const rel of [
    "src/app/dashboards/nclex-rn/vista/subscriptions/packages/page.tsx",
    "src/app/dashboards/nclex-pn/vista/subscriptions/packages/page.tsx",
  ]) {
    const content = read(rel);
    assert.equal(/Cancelled Successfully/.test(content), false, `Fabricated cancel message found in ${rel}`);
    assert.equal(/Auto Renew Updated For/.test(content), false, `Fabricated auto-renew message found in ${rel}`);
    assert.match(content, /requires backend provider verification/);
  }
});
