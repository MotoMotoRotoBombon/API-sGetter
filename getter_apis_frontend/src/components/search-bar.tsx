"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/lib/api";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: cities, isFetching } = useQuery({
    queryKey: ["cities", query],
    queryFn: () => searchCities(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(cityName: string) {
    setQuery("");
    setIsOpen(false);
    router.push(`/city/${encodeURIComponent(cityName)}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search a city..."
          className="w-full bg-bg-secondary border border-border rounded-lg py-2.5 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
        {isFetching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && cities && cities.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-bg-secondary border border-border rounded-lg shadow-lg overflow-hidden">
          {cities.map((city) => (
            <li key={city.id}>
              <button
                onClick={() => handleSelect(city.name)}
                className="w-full text-left px-4 py-2.5 hover:bg-bg-card transition-colors flex items-center justify-between"
              >
                <span className="text-text-primary">{city.name}</span>
                <span className="text-text-muted text-sm">
                  {city.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}