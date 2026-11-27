import { NextRequest, NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/api/api/api";
import { getSiteHeaders } from "@/lib/config/siteHeaders";
import { ALLOWED_PARENT_NAMES, resolveNclexPathway } from "@/lib/config/nclexProgramIdentity";

export interface DynamicDominionResponse<T = unknown> {
  message?: string;
  error?: string;
  data?: T;
  success?: boolean;
}

// Base Route Logic 📌
const STRATA_GROUP = "subscription";
const STRATA_NAME = "items";
const BASE_ROUTE = `/api/castoline/nexus/${STRATA_GROUP}/${STRATA_NAME}`;

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

    const responseBody: DynamicDominionResponse = await backendResponse.json().catch(() => ({
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

// Helper to test if a subscription name belongs to NCLEX
function isNclexSubscriptionName(name?: string | null): boolean {
  if (!name) return false;
  const upper = name.toUpperCase();
  return upper.includes("NCLEX RN") || upper.includes("NCLEX-RN") || upper.includes("NCLEX PN") || upper.includes("NCLEX-PN") || (upper.startsWith("RN ") && !upper.includes("HESI") && !upper.includes("TEAS")) || (upper.startsWith("PN ") && !upper.includes("HESI") && !upper.includes("TEAS"));
}

// GET ROUTE -> list [ Supports Filters / Pagination ]
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fetchtype = url.searchParams.get("fetchtype");
  const parentName = url.searchParams.get("parentName");

  // STRICT NCLEX SCOPE VALIDATION FOR DISTINCT FETCH
  if (fetchtype === "distinct") {
    if (parentName) {
      const pathway = resolveNclexPathway(parentName);
      if (!pathway || !ALLOWED_PARENT_NAMES.has(pathway)) {
        return NextResponse.json(
          { error: "Unsupported or unauthorized programme subscription context. Only NCLEX-RN and NCLEX-PN plans are accessible." },
          { status: 400 }
        );
      }

      return forwardToBackend(
        req,
        "GET",
        `${BASE_ROUTE}/list/distinct`,
        (params) => {
          params.set("parentName", pathway);
        },
        (data: unknown) => {
          if (!data || typeof data !== "object") return data;
          const d = data as { items?: Array<{ name?: string }> };
          if (Array.isArray(d.items)) {
            // Guarantee no leak of non-NCLEX items
            d.items = d.items.filter((item) => isNclexSubscriptionName(item.name));
          }
          return d;
        }
      );
    }

    return forwardToBackend(req, "GET", `${BASE_ROUTE}/list/distinct`);
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
        const d = data as { items?: Array<{ name?: string }> };
        if (Array.isArray(d.items)) {
          // Strictly exclude any HESI, TEAS, or non-NCLEX subscription plan
          d.items = d.items.filter((item) => isNclexSubscriptionName(item.name));
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
