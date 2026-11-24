// src/app/api/seek/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/api/api/api";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

export interface DynamicSeekResponse<T = unknown> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// ───────────────────────────────────────────────────────────────────────────────
// BASE ROUTE LOGIC
// ───────────────────────────────────────────────────────────────────────────────

const BASE_ROUTE = "/api/castoline/strata/seek";

// ?fetchtype=...  →  backend segment
const FETCHTYPE_TO_SEGMENT: Record<string, string> = {
  absolute: "absolute",
  distinct: "distinct",
  suggest: "suggest",
  history: "history",
};

// ───────────────────────────────────────────────────────────────────────────────
// FORWARD HELPER
// ───────────────────────────────────────────────────────────────────────────────

async function forwardToBackend(
  req: NextRequest,
  method: "GET" | "DELETE",
  segment: string
): Promise<NextResponse> {
  try {
    const backendBaseUrl = getBackendBaseUrl();

    // forward every query param except our own routing key
    const params = new URL(req.url).searchParams;
    params.delete("fetchtype");
    const qs = params.toString();

    const url = `${backendBaseUrl}${BASE_ROUTE}/${segment}${qs ? `?${qs}` : ""}`;
    console.log(`🌿 [seek Route] Forwarding ${method} To :`, url);

    // session headers coming from the browser
    // session headers coming from the browser (same as the other strata routes)
    const castoLine = req.headers.get("x-casto-line");
    const castoBadge = req.headers.get("x-casto-badge");
    const sessionId = req.headers.get("x-session-id");

    const siteHeaders = await getSiteHeaders();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(siteHeaders as Record<string, string>),
    };

    if (castoLine) headers["x-casto-line"] = castoLine;
    if (castoBadge) headers["x-casto-badge"] = castoBadge;
    if (sessionId) headers["x-session-id"] = sessionId;

    // Diagnostic: which headers actually leave this route
    console.log("🔐 [seek Route] Sending headers:", Object.keys(headers).join(", "));

    const backendResponse = await fetch(url, { method, headers, cache: "no-store" });

    const rawText = await backendResponse.text();
    let responseBody: DynamicSeekResponse;
    try {
      responseBody = rawText ? JSON.parse(rawText) : {};
    } catch {
      responseBody = { error: `Backend returned ${backendResponse.status} (non-JSON): ${rawText.slice(0, 300)}` };
    }

    if (!backendResponse.ok && !responseBody.error) {
      responseBody.error =
        backendResponse.status === 401
          ? "Backend rejected the request (401). Session headers or route key not accepted ⚓"
          : backendResponse.status === 403
            ? "Backend forbids this route for your role (403) ⚓"
            : `Backend error ${backendResponse.status} ⚓`;
    }

    // console.log(
    //   "📌 [seek Route] Status:", backendResponse.status,
    //   "| sent x-casto-line:", !!castoLine,
    //   "| x-casto-badge:", !!castoBadge,
    //   "| x-session-id:", !!sessionId
    // );

    // Normalize backend failures
    if ("success" in responseBody && responseBody.success === false) {
      responseBody.error = responseBody.error ?? responseBody.message ?? "Unknown Backend Error 🔖";
    }

    return NextResponse.json(responseBody, { status: backendResponse.status });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : `Unknown ${method} error`;
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// GET  → absolute | distinct | history
// ───────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const fetchtype = new URL(req.url).searchParams.get("fetchtype") ?? "";
  const segment = FETCHTYPE_TO_SEGMENT[fetchtype];

  if (!segment) {
    return NextResponse.json({ error: "Invalid Fetchtype" }, { status: 400 });
  }
  return forwardToBackend(req, "GET", segment);
}

// ───────────────────────────────────────────────────────────────────────────────
// DELETE → clear history
// ───────────────────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const fetchtype = new URL(req.url).searchParams.get("fetchtype");
  if (fetchtype !== "history") {
    return NextResponse.json({ error: "Invalid Fetchtype" }, { status: 400 });
  }
  return forwardToBackend(req, "DELETE", "history");
}

// ───────────────────────────────────────────────────────────────────────────────
// The End By : B.L.S.M.C ;  -  Skewblanc - The Winds Chase Us ⚓
// ───────────────────────────────────────────────────────────────────────────────