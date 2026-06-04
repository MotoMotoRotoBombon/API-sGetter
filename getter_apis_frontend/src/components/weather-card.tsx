"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeather } from "@/lib/api";
import type { WeatherData } from "@/lib/types";

function formatTemp(temp: number): string {
  return `${Math.round(temp)}°C`;
}

function Skeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="h-5 w-24 bg-border rounded mb-4" />
      <div className="space-y-3">
        <div className="h-8 w-20 bg-border rounded" />
        <div className="h-4 w-32 bg-border rounded" />
        <div className="h-4 w-28 bg-border rounded" />
        <div className="h-4 w-24 bg-border rounded" />
      </div>
    </div>
  );
}

export default function WeatherCard({ city }: { city: string }) {
  const { data, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["weather", city],
    queryFn: () => getWeather(city),
  });

  if (isLoading) return <Skeleton />;
  if (error) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Weather</h2>
        <p className="text-text-muted text-sm">{error.message}</p>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Weather</h2>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-text-primary">
          {formatTemp(data.temperature)}
        </p>
        <p className="text-text-secondary capitalize">{data.description}</p>
        <div className="flex gap-6 text-sm text-text-muted mt-3">
          <span>Humidity {data.humidity}%</span>
          <span>Wind {data.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
}