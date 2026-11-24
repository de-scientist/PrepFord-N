/**
 * PrepFord-N Authoritative NCLEX-Only Route & Pathway Boundary
 *
 * Active product scope is strictly limited to:
 * - NCLEX-RN (segment: "NCLEX_RN", slug: "nclex-rn")
 * - NCLEX-PN (segment: "NCLEX_PN", slug: "nclex-pn")
 *
 * Out-of-scope pathways (ATI TEAS, HESI A2, RN Nursing School, LPN Nursing School,
 * Pre-Nursing, CNA, GED, Praxis, and general Certifications) are excluded from active
 * navigation, discovery, and route resolution while preserving shared code and recoverability.
 */

export type ActiveNclexSegment = "NCLEX_RN" | "NCLEX_PN";
export type ActiveNclexDashboardSlug = "nclex-rn" | "nclex-pn";

export const ACTIVE_NCLEX_SEGMENTS: readonly ActiveNclexSegment[] = [
  "NCLEX_RN",
  "NCLEX_PN",
] as const;

export const ACTIVE_NCLEX_DASHBOARDS: readonly ActiveNclexDashboardSlug[] = [
  "nclex-rn",
  "nclex-pn",
] as const;

export const NCLEX_SEGMENT_DASHBOARD_MAP: Record<string, ActiveNclexDashboardSlug> = {
  NCLEX_RN: "nclex-rn",
  NCLEX_PN: "nclex-pn",
};

export const EXCLUDED_NON_NCLEX_TRACKS: readonly string[] = [
  "ati-teas",
  "hesi-a2",
  "lpn-nursing",
  "rn-nursing",
  "rn-nusring",
  "pre-nursing",
  "cna",
  "ged",
  "certification",
  "certifications",
  "praxis",
] as const;

const EXCLUDED_ROUTE_PREFIXES: readonly string[] = EXCLUDED_NON_NCLEX_TRACKS.flatMap(
  (track) => [
    `/pages/exams/${track}`,
    `/dashboards/${track}`,
    `/web/${track}`,
    `/services/${track}`,
    `/${track}`,
  ]
);

/**
 * Returns true if the given URL pathname targets an excluded non-NCLEX pathway route.
 */
export function isExcludedNonNclexPath(pathname: string): boolean {
  if (!pathname) return false;
  const normalized = pathname.trim().toLowerCase().replace(/\/+$/, "") || "/";

  for (const prefix of EXCLUDED_ROUTE_PREFIXES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true if a backend program segment belongs to the active NCLEX scope.
 */
export function isActiveNclexSegment(segment?: string | null): segment is ActiveNclexSegment {
  if (!segment) return false;
  const upper = segment.trim().toUpperCase().replace(/-/g, "_");
  return upper === "NCLEX_RN" || upper === "NCLEX_PN";
}

/**
 * Resolves any pathway/program/dashboard identifier or URL pathname to a valid
 * active NCLEX dashboard slug ("nclex-rn" or "nclex-pn"), defaulting to "nclex-rn".
 */
export function resolveNclexDashboardSlug(
  input?: string | null,
  fallback: ActiveNclexDashboardSlug = "nclex-rn"
): ActiveNclexDashboardSlug | null {
  if (!input) return fallback;
  const lower = input.trim().toLowerCase();
  if (
    lower === "nclex-pn" ||
    lower === "nclex_pn" ||
    lower === "pn" ||
    lower.includes("nclex-pn") ||
    lower.includes("nclex_pn") ||
    lower.includes("nclex pn")
  ) {
    return "nclex-pn";
  }
  if (
    lower === "nclex-rn" ||
    lower === "nclex_rn" ||
    lower === "rn" ||
    lower.includes("nclex-rn") ||
    lower.includes("nclex_rn") ||
    lower.includes("nclex rn")
  ) {
    return "nclex-rn";
  }
  return null;
}
