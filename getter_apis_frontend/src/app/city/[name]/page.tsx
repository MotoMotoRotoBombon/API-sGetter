"use client";

import Link from "next/link";
import SearchBar from "@/components/search-bar";
import WeatherCard from "@/components/weather-card";
import NewsCard from "@/components/news-card";
import { use } from "react";

export default function CityPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const city = decodeURIComponent(name);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link
          href="/"
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <SearchBar />
        </div>
      </header>

      <h1 className="text-2xl font-bold text-text-primary">{city}</h1>

      <div className="space-y-4">
        <WeatherCard city={city} />
        <NewsCard city={city} />
      </div>
    </div>
  );
}