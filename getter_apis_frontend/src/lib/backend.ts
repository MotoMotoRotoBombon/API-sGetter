const DEFAULT_API_URL = "http://localhost:3000/dev";

function getApiUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_URL
  ).replace(/\/+$/, "");
}

export async function proxyBackend(path: string): Promise<Response> {
  try {
    const response = await fetch(`${getApiUrl()}${path}`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return Response.json(
        {
          success: false,
          error: `Backend returned an invalid response (${response.status})`,
        },
        { status: 502 },
      );
    }

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Could not connect to the CityPulse backend",
      },
      { status: 502 },
    );
  }
}
