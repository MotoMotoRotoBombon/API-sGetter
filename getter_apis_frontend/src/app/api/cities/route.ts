import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const limit = request.nextUrl.searchParams.get("limit");

  if (!query) {
    return Response.json({ success: false, error: "Query parameter q is required" }, { status: 400 });
  }

  const params = new URLSearchParams({ q: query });
  if (limit) params.set("limit", limit);

  const res = await fetch(`${API_URL}/cities?${params}`);
  const data = await res.json();

  return Response.json(data, { status: res.status });
}