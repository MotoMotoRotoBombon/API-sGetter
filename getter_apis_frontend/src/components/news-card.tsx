"use client";

import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/lib/api";
import type { NewsArticle } from "@/lib/types";

function Skeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="h-5 w-16 bg-border rounded mb-4" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-border rounded" />
        <div className="h-4 w-3/4 bg-border rounded" />
        <div className="h-4 w-5/6 bg-border rounded" />
      </div>
    </div>
  );
}

function Article({ article }: { article: NewsArticle }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="border-b border-border pb-3 last:border-0 last:pb-0">
        <h3 className="text-text-primary text-sm group-hover:text-accent transition-colors line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
          <span>{article.source}</span>
          <span>·</span>
          <time>{date}</time>
        </div>
      </article>
    </a>
  );
}

export default function NewsCard({ city }: { city: string }) {
  const { data, isLoading, error, refetch, isFetching } = useQuery<NewsArticle[]>({
    queryKey: ["news", city],
    queryFn: () => getNews(city),
  });

  if (isLoading) return <Skeleton />;
  if (error) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-2">News</h2>
        <p className="text-text-muted text-sm">{error.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-4 text-sm font-medium text-accent hover:text-accent-hover disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Try again"}
        </button>
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-2">News</h2>
        <p className="text-text-muted text-sm">
          No recent articles were found for {city}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <h2 className="text-lg font-semibold text-text-primary mb-4">News</h2>
      <div className="space-y-0">
        {data.map((article, i) => (
          <Article key={`${article.url}-${i}`} article={article} />
        ))}
      </div>
    </div>
  );
}
