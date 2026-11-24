import { NextRequest, NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/lib/api/api/api";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

export async function GET(req: NextRequest) {
  try {
    const qs = new URL(req.url).searchParams.toString();
    const url = `${getBackendBaseUrl()}/api/castoline/strata/support/validate${qs ? `?${qs}` : ""}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((await getSiteHeaders()) as Record<string, string>),
    };
    for (const h of ["x-casto-line", "x-casto-badge", "x-session-id"]) {
      const v = req.headers.get(h);
      if (v) headers[h] = v;
    }

    const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
    const raw = await res.text();
    let body: Record<string, unknown>;
    try { body = raw ? JSON.parse(raw) : {}; }
    catch { body = { error: `Backend returned ${res.status} (non-JSON)` }; }

    if (!res.ok && !body.error) body.error = `Backend error ${res.status} ⚓`;
    return NextResponse.json(body, { status: res.status });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}