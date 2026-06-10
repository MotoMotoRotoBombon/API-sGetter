import SearchBar from "@/components/search-bar";
import Link from "next/link";

const POPULAR_CITIES = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Berlin",
  "Sydney",
  "Dubai",
  "Sao Paulo",
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">
            CityPulse
          </h1>
          <p className="text-text-secondary text-lg">
            City weather and news at a glance
          </p>
          <p className="text-text-muted text-sm">
            Search across 50 cities around the world
          </p>
        </div>

        <SearchBar />

        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city}
              href={`/city/${encodeURIComponent(city)}`}
              className="px-3 py-1.5 text-sm text-text-muted bg-bg-secondary border border-border rounded-full hover:text-text-primary hover:border-accent transition-colors"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
