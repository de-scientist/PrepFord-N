/**
 * PrepFord-N — Authoritative Backend NCLEX Program Identity & Centralized Allowlist
 *
 * This module defines the exact backend identifiers, assessment group GUIDs,
 * course GUIDs, and allowlist validation rules discovered from the authoritative
 * hosted .NET backend (http://108.61.9.189:8008).
 *
 * STRICT SCOPE ENFORCEMENT:
 * Only NCLEX-RN and NCLEX-PN are supported products in PrepFord-N.
 * All other backend tracks (HESI A2, ATI TEAS, CNA, etc.) are strictly excluded.
 */

export interface NclexProgramConfig {
  readonly id: number;
  readonly guidId: string;
  readonly code: string;
  readonly name: string;
  readonly segment: "NCLEX_RN" | "NCLEX_PN";
  readonly dashboardSlug: "nclex-rn" | "nclex-pn";
  readonly assessmentId: number;
  readonly assessmentGuidId: string;
  readonly assessmentName: string;
  readonly primaryCourseId: number;
  readonly primaryCourseGuidId: string;
  readonly primaryCourseName: string;
  readonly parentName: "NCLEX_RN" | "NCLEX_PN";
}

export const NCLEX_RN_CONFIG: NclexProgramConfig = {
  id: 8,
  guidId: "712cb755-999e-4e87-a6a9-b1cdcf67cda2",
  code: "673F28AB",
  name: "NCLEX RN",
  segment: "NCLEX_RN",
  dashboardSlug: "nclex-rn",
  assessmentId: 7,
  assessmentGuidId: "1068be22-8f41-444e-b794-d504752a1018",
  assessmentName: "NCLEX RN GROUP",
  primaryCourseId: 30,
  primaryCourseGuidId: "7efd419d-8d87-4bd3-b765-08b8acbaa65c",
  primaryCourseName: "Client Needs",
  parentName: "NCLEX_RN",
} as const;

export const NCLEX_PN_CONFIG: NclexProgramConfig = {
  id: 7,
  guidId: "f003919e-7865-4219-9948-559bc1b82d53",
  code: "25877FAE",
  name: "NCLEX PN",
  segment: "NCLEX_PN",
  dashboardSlug: "nclex-pn",
  assessmentId: 6,
  assessmentGuidId: "c517e71d-f2d6-43ad-b495-9449aa2ed163",
  assessmentName: "NCLEX PN GROUP",
  primaryCourseId: 40,
  primaryCourseGuidId: "6be437ca-8cc9-4908-bb67-bbe3392a793d",
  primaryCourseName: "Client Needs.",
  parentName: "NCLEX_PN",
} as const;

export const NCLEX_CONFIGS: Record<"NCLEX_RN" | "NCLEX_PN", NclexProgramConfig> = {
  NCLEX_RN: NCLEX_RN_CONFIG,
  NCLEX_PN: NCLEX_PN_CONFIG,
} as const;

// Allowlists for fast validation
export const ALLOWED_PROGRAM_IDS = new Set<number>([
  NCLEX_RN_CONFIG.id,
  NCLEX_PN_CONFIG.id,
]);

export const ALLOWED_PROGRAM_GUIDS = new Set<string>([
  NCLEX_RN_CONFIG.guidId.toLowerCase(),
  NCLEX_PN_CONFIG.guidId.toLowerCase(),
]);

export const ALLOWED_ASSESSMENT_IDS = new Set<number>([
  NCLEX_RN_CONFIG.assessmentId,
  NCLEX_PN_CONFIG.assessmentId,
]);

export const ALLOWED_ASSESSMENT_GUIDS = new Set<string>([
  NCLEX_RN_CONFIG.assessmentGuidId.toLowerCase(),
  NCLEX_PN_CONFIG.assessmentGuidId.toLowerCase(),
]);

export const ALLOWED_COURSE_IDS = new Set<number>([
  NCLEX_RN_CONFIG.primaryCourseId,
  NCLEX_PN_CONFIG.primaryCourseId,
]);

export const ALLOWED_COURSE_GUIDS = new Set<string>([
  NCLEX_RN_CONFIG.primaryCourseGuidId.toLowerCase(),
  NCLEX_PN_CONFIG.primaryCourseGuidId.toLowerCase(),
]);

export const ALLOWED_PARENT_NAMES = new Set<string>([
  "NCLEX_RN",
  "NCLEX_PN",
]);

/**
 * Resolves any input (name, slug, id, GUID, code) to its authoritative NCLEX pathway ("NCLEX_RN" | "NCLEX_PN").
 * Returns null if the identifier is unknown, invalid, or belongs to an unsupported track (e.g. HESI, TEAS).
 */
export function resolveNclexPathway(
  input?: string | number | null,
  context?: "program" | "assessment" | "course"
): "NCLEX_RN" | "NCLEX_PN" | null {
  if (input === null || input === undefined) return null;

  const str = String(input).trim();
  const lower = str.toLowerCase();
  const upper = str.toUpperCase().replace(/-/g, "_");

  // Direct pathway matches
  if (upper === "NCLEX_RN" || lower === "nclex-rn" || lower === "rn") {
    return "NCLEX_RN";
  }
  if (upper === "NCLEX_PN" || lower === "nclex-pn" || lower === "pn") {
    return "NCLEX_PN";
  }

  // GUID matches (globally unique)
  if (
    lower === NCLEX_RN_CONFIG.guidId.toLowerCase() ||
    lower === NCLEX_RN_CONFIG.assessmentGuidId.toLowerCase() ||
    lower === NCLEX_RN_CONFIG.primaryCourseGuidId.toLowerCase()
  ) {
    return "NCLEX_RN";
  }

  if (
    lower === NCLEX_PN_CONFIG.guidId.toLowerCase() ||
    lower === NCLEX_PN_CONFIG.assessmentGuidId.toLowerCase() ||
    lower === NCLEX_PN_CONFIG.primaryCourseGuidId.toLowerCase()
  ) {
    return "NCLEX_PN";
  }

  // Numeric ID resolution
  const num = Number(str);
  if (!Number.isNaN(num)) {
    if (context === "assessment") {
      if (num === NCLEX_RN_CONFIG.assessmentId) return "NCLEX_RN";
      if (num === NCLEX_PN_CONFIG.assessmentId) return "NCLEX_PN";
    }
    if (context === "course") {
      if (num === NCLEX_RN_CONFIG.primaryCourseId) return "NCLEX_RN";
      if (num === NCLEX_PN_CONFIG.primaryCourseId) return "NCLEX_PN";
    }

    // Default: Program IDs (8: RN, 7: PN) take precedence for general integer IDs
    if (num === NCLEX_RN_CONFIG.id) return "NCLEX_RN";
    if (num === NCLEX_PN_CONFIG.id) return "NCLEX_PN";
    if (num === NCLEX_PN_CONFIG.assessmentId) return "NCLEX_PN";
    if (num === NCLEX_RN_CONFIG.primaryCourseId) return "NCLEX_RN";
    if (num === NCLEX_PN_CONFIG.primaryCourseId) return "NCLEX_PN";
  }

  // Codes
  if (upper === NCLEX_RN_CONFIG.code || upper === "CLIENT_NEEDS") {
    return "NCLEX_RN";
  }
  if (upper === NCLEX_PN_CONFIG.code) {
    return "NCLEX_PN";
  }

  return null;
}

/**
 * Resolves an exam parent identifier to the authoritative backend Assessment GUID.
 * If the input is already a valid Assessment GUID, returns it.
 * If the input is "NCLEX_RN" or "nclex-rn", returns the RN Assessment GUID (1068be22-8f41-444e-b794-d504752a1018).
 * If the input is "NCLEX_PN" or "nclex-pn", returns the PN Assessment GUID (c517e71d-f2d6-43ad-b495-9449aa2ed163).
 * Returns null if the identifier is out of scope.
 */
export function resolveNclexAssessmentGuid(
  input?: string | number | null
): string | null {
  if (input === null || input === undefined) return null;
  const str = String(input).trim();
  const lower = str.toLowerCase();

  if (lower === NCLEX_RN_CONFIG.assessmentGuidId.toLowerCase() || str === String(NCLEX_RN_CONFIG.assessmentId)) {
    return NCLEX_RN_CONFIG.assessmentGuidId;
  }
  if (lower === NCLEX_PN_CONFIG.assessmentGuidId.toLowerCase() || str === String(NCLEX_PN_CONFIG.assessmentId)) {
    return NCLEX_PN_CONFIG.assessmentGuidId;
  }

  const pathway = resolveNclexPathway(input, "assessment");
  if (pathway === "NCLEX_RN") {
    return NCLEX_RN_CONFIG.assessmentGuidId;
  }
  if (pathway === "NCLEX_PN") {
    return NCLEX_PN_CONFIG.assessmentGuidId;
  }

  return null;
}

/**
 * Resolves a subject parent identifier to the authoritative backend Course GUID.
 * If the input is already a valid Course GUID, returns it.
 * If the input is "NCLEX_RN" or "nclex-rn", returns the RN Course GUID (7efd419d-8d87-4bd3-b765-08b8acbaa65c).
 * If the input is "NCLEX_PN" or "nclex-pn", returns the PN Course GUID (6be437ca-8cc9-4908-bb67-bbe3392a793d).
 * Returns null if the identifier is out of scope.
 */
export function resolveNclexCourseGuid(
  input?: string | number | null
): string | null {
  if (input === null || input === undefined) return null;
  const str = String(input).trim();
  const lower = str.toLowerCase();

  if (lower === NCLEX_RN_CONFIG.primaryCourseGuidId.toLowerCase() || str === String(NCLEX_RN_CONFIG.primaryCourseId)) {
    return NCLEX_RN_CONFIG.primaryCourseGuidId;
  }
  if (lower === NCLEX_PN_CONFIG.primaryCourseGuidId.toLowerCase() || str === String(NCLEX_PN_CONFIG.primaryCourseId)) {
    return NCLEX_PN_CONFIG.primaryCourseGuidId;
  }

  const pathway = resolveNclexPathway(input, "course");
  if (pathway === "NCLEX_RN") {
    return NCLEX_RN_CONFIG.primaryCourseGuidId;
  }
  if (pathway === "NCLEX_PN") {
    return NCLEX_PN_CONFIG.primaryCourseGuidId;
  }

  return null;
}

/**
 * Checks whether an input identifier is strictly allowed within NCLEX-RN or NCLEX-PN.
 */
export function isAllowedNclexIdentifier(input?: string | number | null): boolean {
  return resolveNclexPathway(input) !== null;
}
