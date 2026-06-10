const BASE_URL = "";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.error ?? `API error: ${res.status}`);
  }

  if (json?.success && json.data !== undefined) {
    return json.data as T;
  }

  if (json?.success === false) {
    throw new Error(json.error ?? "Unknown API error");
  }

  if (json === null) {
    throw new Error("The server returned an invalid response");
  }

  return json as T;
}

export async function searchCities(query: string, limit?: number) {
  const params = new URLSearchParams({ q: query });
  if (limit) params.set("limit", String(limit));
  return fetchApi<Array<import("./types").City>>(`/api/cities?${params}`);
}

export async function getWeather(city: string) {
  return fetchApi<import("./types").WeatherData>(`/api/weather/${encodeURIComponent(city)}`);
}

export async function getNews(city: string) {
  return fetchApi<Array<import("./types").NewsArticle>>(`/api/news/${encodeURIComponent(city)}`);
}
