import type { NextRequest } from "next/server";
import { proxyBackend } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const limit = request.nextUrl.searchParams.get("limit");

  if (!query) {
    return Response.json({ success: false, error: "Query parameter q is required" }, { status: 400 });
  }

  const params = new URLSearchParams({ q: query });
  if (limit) params.set("limit", limit);

  return proxyBackend(`/cities?${params}`);
}
