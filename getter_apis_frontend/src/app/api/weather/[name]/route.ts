import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const res = await fetch(`${API_URL}/weather/${encodeURIComponent(name)}`);
  const data = await res.json();
  return Response.json(data, { status: res.status });
}