import { CacheRepository } from '@domain/services/CacheRepository';

interface CacheEntry {
  value: unknown;
  expiresAt?: number;
}

export class InMemoryCacheRepository implements CacheRepository {
  private readonly entries = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);

    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.entries.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }
}
