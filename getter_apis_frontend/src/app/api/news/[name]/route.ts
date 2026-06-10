import type { NextRequest } from "next/server";
import { proxyBackend } from "@/lib/backend";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  return proxyBackend(`/news/${encodeURIComponent(name)}`);
}
