import { NextRequest, NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/api/api/api";
import { getSiteHeaders } from "@/lib/config/siteHeaders";
import {
  resolveNclexCourseGuid,
  isAllowedNclexIdentifier,
  ALLOWED_COURSE_IDS,
  ALLOWED_COURSE_GUIDS,
} from "@/lib/config/nclexProgramIdentity";

export interface DynamicStrataResponse<T = unknown> {
  message?: string;
  error?: string;
  data?: T;
  success?: boolean;
}

// Base Route Logic 📌
const STRATA_GROUP = "learning";
const STRATA_NAME = "subjects";
const BASE_ROUTE = `/api/castoline/strata/${STRATA_GROUP}/${STRATA_NAME}`;

// Helper function to Forward Requests to Backend ⚓
async function forwardToBackend(
  req: NextRequest,
  method: "POST" | "PUT" | "DELETE" | "GET",
  backendPath: string,
  searchParamsModifier?: (params: URLSearchParams) => void,
  responseFilter?: (data: unknown) => unknown
): Promise<NextResponse> {
  try {
    let body: unknown = {};
    if (method !== "GET") {
      body = await req.json().catch(() => ({}));
    }

    const backendBaseUrl = getBackendBaseUrl();
    const searchParams = new URL(req.url).searchParams;
    if (searchParamsModifier) {
      searchParamsModifier(searchParams);
    }
    const queryParams = method === "GET" ? searchParams.toString() : "";
    const url = `${backendBaseUrl}${backendPath}${queryParams ? `?${queryParams}` : ""}`;

    console.log(`🌿 [${STRATA_NAME} Route] Forwarding ${method} To :`, url);
    if (method !== "GET") console.log("Request Body : ", JSON.stringify(body));

    // EXTRACT SESSION HEADERS FIRST
    const castoLine = req.headers.get("x-casto-line");
    const castoBadge = req.headers.get("x-casto-badge");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(await getSiteHeaders()),
    };

    if (castoLine) headers["x-casto-line"] = castoLine;
    if (castoBadge) headers["x-casto-badge"] = castoBadge;

    const backendResponse = await fetch(url, {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    const responseBody: DynamicStrataResponse = await backendResponse.json().catch(() => ({
      error: "Failed to Parse Backend Response ⚓",
    }));

    // Normalize Backend Failures and Errors
    if ("success" in responseBody && responseBody.success === false) {
      responseBody.error = responseBody.message ?? "Unknown Backend Error 🔖";
    }

    // Apply strict NCLEX programme scope filtering if provided
    if (responseFilter && responseBody.data) {
      responseBody.data = responseFilter(responseBody.data) as typeof responseBody.data;
    }

    return NextResponse.json(responseBody, { status: backendResponse.status });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : `Unknown ${method} error`;
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// POST ROUTE -> Store a New Record
export async function POST(req: NextRequest) {
  return forwardToBackend(req, "POST", `${BASE_ROUTE}/store`);
}

// PUT ROUTE -> Update Existing Record
export async function PUT(req: NextRequest) {
  return forwardToBackend(req, "PUT", `${BASE_ROUTE}/update`);
}

// DELETE ROUTE -> Remove / Destroy Record
export async function DELETE(req: NextRequest) {
  return forwardToBackend(req, "DELETE", `${BASE_ROUTE}/delete`);
}

// GET ROUTE -> list [ Supports Filters / Pagination ]
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fetchtype = url.searchParams.get("fetchtype");
  const rawIdentifier = url.searchParams.get("identifier");

  // STRICT NCLEX SCOPE VALIDATION FOR DISTINCT FETCH
  if (fetchtype === "distinct") {
    if (!rawIdentifier) {
      return NextResponse.json(
        { error: "Parent Identifier is Required for distinct subject lookup ⚓" },
        { status: 400 }
      );
    }

    if (!isAllowedNclexIdentifier(rawIdentifier)) {
      return NextResponse.json(
        { error: "Unsupported or unauthorized programme identifier. Only NCLEX-RN and NCLEX-PN are supported." },
        { status: 400 }
      );
    }

    const resolvedCourseGuid = resolveNclexCourseGuid(rawIdentifier);
    if (!resolvedCourseGuid) {
      return NextResponse.json(
        { error: "Unable to resolve authoritative course identifier for NCLEX scope." },
        { status: 400 }
      );
    }

    return forwardToBackend(
      req,
      "GET",
      `${BASE_ROUTE}/list/distinct`,
      (params) => {
        params.set("identifier", resolvedCourseGuid);
      },
      (data: unknown) => {
        if (!data || typeof data !== "object") return data;
        const d = data as { items?: Array<{ courseGuidId?: string; courseId?: number }> };
        if (Array.isArray(d.items)) {
          d.items = d.items.filter((item) => {
            if (item.courseGuidId) {
              return item.courseGuidId.toLowerCase() === resolvedCourseGuid.toLowerCase();
            }
            return true;
          });
        }
        return d;
      }
    );
  }

  // STRICT NCLEX SCOPE FILTERING FOR ABSOLUTE FETCH
  if (fetchtype === "absolute") {
    return forwardToBackend(
      req,
      "GET",
      `${BASE_ROUTE}/list/absolute`,
      undefined,
      (data: unknown) => {
        if (!data || typeof data !== "object") return data;
        const d = data as { items?: Array<{ courseGuidId?: string; courseId?: number }> };
        if (Array.isArray(d.items)) {
          d.items = d.items.filter((item) => {
            if (item.courseGuidId) {
              return ALLOWED_COURSE_GUIDS.has(item.courseGuidId.toLowerCase());
            }
            if (item.courseId) {
              return ALLOWED_COURSE_IDS.has(item.courseId);
            }
            return false;
          });
        }
        return d;
      }
    );
  }

  if (fetchtype === "relative") {
    return forwardToBackend(req, "GET", `${BASE_ROUTE}/list/relative`);
  }

  return NextResponse.json(
    { error: "Invalid Fetchtype" },
    { status: 400 }
  );
}
