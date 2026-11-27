import test from "node:test";
import assert from "node:assert/strict";
import {
  NCLEX_RN_CONFIG,
  NCLEX_PN_CONFIG,
  resolveNclexPathway,
  resolveNclexAssessmentGuid,
  resolveNclexCourseGuid,
  isAllowedNclexIdentifier,
  ALLOWED_PROGRAM_IDS,
  ALLOWED_PROGRAM_GUIDS,
  ALLOWED_ASSESSMENT_GUIDS,
  ALLOWED_COURSE_GUIDS,
  ALLOWED_PARENT_NAMES,
} from "../src/lib/config/nclexProgramIdentity";

test("Phase A: Centralized NCLEX Program Identity Configuration", () => {
  // 1. Authoritative NCLEX-RN constants match live backend contracts
  assert.equal(NCLEX_RN_CONFIG.id, 8);
  assert.equal(NCLEX_RN_CONFIG.guidId, "712cb755-999e-4e87-a6a9-b1cdcf67cda2");
  assert.equal(NCLEX_RN_CONFIG.code, "673F28AB");
  assert.equal(NCLEX_RN_CONFIG.name, "NCLEX RN");
  assert.equal(NCLEX_RN_CONFIG.segment, "NCLEX_RN");
  assert.equal(NCLEX_RN_CONFIG.dashboardSlug, "nclex-rn");
  assert.equal(NCLEX_RN_CONFIG.assessmentId, 7);
  assert.equal(NCLEX_RN_CONFIG.assessmentGuidId, "1068be22-8f41-444e-b794-d504752a1018");
  assert.equal(NCLEX_RN_CONFIG.assessmentName, "NCLEX RN GROUP");
  assert.equal(NCLEX_RN_CONFIG.primaryCourseId, 30);
  assert.equal(NCLEX_RN_CONFIG.primaryCourseGuidId, "7efd419d-8d87-4bd3-b765-08b8acbaa65c");
  assert.equal(NCLEX_RN_CONFIG.primaryCourseName, "Client Needs");
  assert.equal(NCLEX_RN_CONFIG.parentName, "NCLEX_RN");

  // 2. Authoritative NCLEX-PN constants match live backend contracts
  assert.equal(NCLEX_PN_CONFIG.id, 7);
  assert.equal(NCLEX_PN_CONFIG.guidId, "f003919e-7865-4219-9948-559bc1b82d53");
  assert.equal(NCLEX_PN_CONFIG.code, "25877FAE");
  assert.equal(NCLEX_PN_CONFIG.name, "NCLEX PN");
  assert.equal(NCLEX_PN_CONFIG.segment, "NCLEX_PN");
  assert.equal(NCLEX_PN_CONFIG.dashboardSlug, "nclex-pn");
  assert.equal(NCLEX_PN_CONFIG.assessmentId, 6);
  assert.equal(NCLEX_PN_CONFIG.assessmentGuidId, "c517e71d-f2d6-43ad-b495-9449aa2ed163");
  assert.equal(NCLEX_PN_CONFIG.assessmentName, "NCLEX PN GROUP");
  assert.equal(NCLEX_PN_CONFIG.primaryCourseId, 40);
  assert.equal(NCLEX_PN_CONFIG.primaryCourseGuidId, "6be437ca-8cc9-4908-bb67-bbe3392a793d");
  assert.equal(NCLEX_PN_CONFIG.primaryCourseName, "Client Needs.");
  assert.equal(NCLEX_PN_CONFIG.parentName, "NCLEX_PN");

  // 3. Fast allowlists strictly contain only RN and PN
  assert.equal(ALLOWED_PROGRAM_IDS.size, 2);
  assert.ok(ALLOWED_PROGRAM_IDS.has(8));
  assert.ok(ALLOWED_PROGRAM_IDS.has(7));
  assert.ok(!ALLOWED_PROGRAM_IDS.has(5)); // HESI A2 excluded
  assert.ok(!ALLOWED_PROGRAM_IDS.has(3)); // ATI TEAS excluded

  assert.equal(ALLOWED_PROGRAM_GUIDS.size, 2);
  assert.ok(ALLOWED_PROGRAM_GUIDS.has("712cb755-999e-4e87-a6a9-b1cdcf67cda2"));
  assert.ok(ALLOWED_PROGRAM_GUIDS.has("f003919e-7865-4219-9948-559bc1b82d53"));

  assert.equal(ALLOWED_ASSESSMENT_GUIDS.size, 2);
  assert.ok(ALLOWED_ASSESSMENT_GUIDS.has("1068be22-8f41-444e-b794-d504752a1018"));
  assert.ok(ALLOWED_ASSESSMENT_GUIDS.has("c517e71d-f2d6-43ad-b495-9449aa2ed163"));

  assert.equal(ALLOWED_COURSE_GUIDS.size, 2);
  assert.ok(ALLOWED_COURSE_GUIDS.has("7efd419d-8d87-4bd3-b765-08b8acbaa65c"));
  assert.ok(ALLOWED_COURSE_GUIDS.has("6be437ca-8cc9-4908-bb67-bbe3392a793d"));

  assert.equal(ALLOWED_PARENT_NAMES.size, 2);
  assert.ok(ALLOWED_PARENT_NAMES.has("NCLEX_RN"));
  assert.ok(ALLOWED_PARENT_NAMES.has("NCLEX_PN"));
});

test("Phase A: Positive and Negative Pathway Resolution & Scope Allowlist", () => {
  // Positive RN resolutions
  assert.equal(resolveNclexPathway("NCLEX_RN"), "NCLEX_RN");
  assert.equal(resolveNclexPathway("nclex-rn"), "NCLEX_RN");
  assert.equal(resolveNclexPathway("rn"), "NCLEX_RN");
  assert.equal(resolveNclexPathway(8), "NCLEX_RN");
  assert.equal(resolveNclexPathway("712cb755-999e-4e87-a6a9-b1cdcf67cda2"), "NCLEX_RN");
  assert.equal(resolveNclexPathway("1068be22-8f41-444e-b794-d504752a1018"), "NCLEX_RN");
  assert.equal(resolveNclexPathway("7efd419d-8d87-4bd3-b765-08b8acbaa65c"), "NCLEX_RN");

  // Positive PN resolutions
  assert.equal(resolveNclexPathway("NCLEX_PN"), "NCLEX_PN");
  assert.equal(resolveNclexPathway("nclex-pn"), "NCLEX_PN");
  assert.equal(resolveNclexPathway("pn"), "NCLEX_PN");
  assert.equal(resolveNclexPathway(7), "NCLEX_PN");
  assert.equal(resolveNclexPathway("f003919e-7865-4219-9948-559bc1b82d53"), "NCLEX_PN");
  assert.equal(resolveNclexPathway("c517e71d-f2d6-43ad-b495-9449aa2ed163"), "NCLEX_PN");
  assert.equal(resolveNclexPathway("6be437ca-8cc9-4908-bb67-bbe3392a793d"), "NCLEX_PN");

  // Negative tests: out-of-scope programmes MUST resolve to null
  assert.equal(resolveNclexPathway("hesi-a2"), null);
  assert.equal(resolveNclexPathway("HESI_A2"), null);
  assert.equal(resolveNclexPathway("ati-teas"), null);
  assert.equal(resolveNclexPathway("ATI_TEAS"), null);
  assert.equal(resolveNclexPathway(5), null); // HESI A2 program ID
  assert.equal(resolveNclexPathway(3), null); // ATI TEAS program ID
  assert.equal(resolveNclexPathway("cna"), null);
  assert.equal(resolveNclexPathway("ged"), null);
  assert.equal(resolveNclexPathway("praxis"), null);
  assert.equal(resolveNclexPathway("random-string"), null);
  assert.equal(resolveNclexPathway(""), null);
  assert.equal(resolveNclexPathway(null), null);
  assert.equal(resolveNclexPathway(undefined), null);

  // Assessment GUID resolution
  assert.equal(
    resolveNclexAssessmentGuid("NCLEX_RN"),
    "1068be22-8f41-444e-b794-d504752a1018"
  );
  assert.equal(
    resolveNclexAssessmentGuid("nclex-rn"),
    "1068be22-8f41-444e-b794-d504752a1018"
  );
  assert.equal(
    resolveNclexAssessmentGuid("NCLEX_PN"),
    "c517e71d-f2d6-43ad-b495-9449aa2ed163"
  );
  assert.equal(
    resolveNclexAssessmentGuid("nclex-pn"),
    "c517e71d-f2d6-43ad-b495-9449aa2ed163"
  );
  assert.equal(resolveNclexAssessmentGuid("hesi-a2"), null);
  assert.equal(resolveNclexAssessmentGuid("ati-teas"), null);

  // Course GUID resolution
  assert.equal(
    resolveNclexCourseGuid("NCLEX_RN"),
    "7efd419d-8d87-4bd3-b765-08b8acbaa65c"
  );
  assert.equal(
    resolveNclexCourseGuid("nclex-rn"),
    "7efd419d-8d87-4bd3-b765-08b8acbaa65c"
  );
  assert.equal(
    resolveNclexCourseGuid("NCLEX_PN"),
    "6be437ca-8cc9-4908-bb67-bbe3392a793d"
  );
  assert.equal(
    resolveNclexCourseGuid("nclex-pn"),
    "6be437ca-8cc9-4908-bb67-bbe3392a793d"
  );
  assert.equal(resolveNclexCourseGuid("hesi-a2"), null);
  assert.equal(resolveNclexCourseGuid("ati-teas"), null);

  // Allowlist membership
  assert.equal(isAllowedNclexIdentifier("NCLEX_RN"), true);
  assert.equal(isAllowedNclexIdentifier("NCLEX_PN"), true);
  assert.equal(isAllowedNclexIdentifier("hesi-a2"), false);
  assert.equal(isAllowedNclexIdentifier("ati-teas"), false);
  assert.equal(isAllowedNclexIdentifier("cna"), false);
});

test("Phase B: BFF Route Files Strict Scope Enforcement", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const read = (rel: string) => fs.readFileSync(path.join(process.cwd(), rel), "utf8");

  // 1. Exam BFF route enforces allowlist and resolves assessment GUID
  const examRoute = read("src/app/api/nexus/strata/assessment/exam/route.ts");
  assert.match(examRoute, /isAllowedNclexIdentifier/);
  assert.match(examRoute, /resolveNclexAssessmentGuid/);
  assert.match(examRoute, /ALLOWED_ASSESSMENT_GUIDS/);
  assert.match(examRoute, /Unsupported or unauthorized programme identifier/);

  // 2. Subject BFF route enforces allowlist and resolves course GUID
  const subjectRoute = read("src/app/api/nexus/strata/learning/subject/route.ts");
  assert.match(subjectRoute, /isAllowedNclexIdentifier/);
  assert.match(subjectRoute, /resolveNclexCourseGuid/);
  assert.match(subjectRoute, /ALLOWED_COURSE_GUIDS/);
  assert.match(subjectRoute, /Unsupported or unauthorized programme identifier/);

  // 3. Subscription item BFF route enforces parentName allowlist
  const subRoute = read("src/app/api/nexus/dominion/subscription/item/route.ts");
  assert.match(subRoute, /ALLOWED_PARENT_NAMES/);
  assert.match(subRoute, /isNclexSubscriptionName/);
  assert.match(subRoute, /Unsupported or unauthorized programme subscription context/);

  // 4. Program BFF route enforces program allowlist
  const programRoute = read("src/app/api/nexus/strata/learning/program/route.ts");
  assert.match(programRoute, /ALLOWED_PROGRAM_IDS/);
  assert.match(programRoute, /ALLOWED_PROGRAM_GUIDS/);

  // 5. Course BFF route enforces course allowlist
  const courseRoute = read("src/app/api/nexus/strata/learning/course/route.ts");
  assert.match(courseRoute, /ALLOWED_PROGRAM_IDS/);
  assert.match(courseRoute, /ALLOWED_PROGRAM_GUIDS/);
});
