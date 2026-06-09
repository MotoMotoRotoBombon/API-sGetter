import { InMemoryCacheRepository } from './InMemoryCacheRepository';

describe('InMemoryCacheRepository', () => {
  it('stores and retrieves values', async () => {
    const cache = new InMemoryCacheRepository();

    await cache.set('weather:chihuahua', { temperature: 25 });

    await expect(cache.get('weather:chihuahua')).resolves.toEqual({ temperature: 25 });
  });

  it('returns null for expired values', async () => {
    jest.useFakeTimers();
    const cache = new InMemoryCacheRepository();

    await cache.set('weather:chihuahua', { temperature: 25 }, 10);
    jest.advanceTimersByTime(10_000);

    await expect(cache.get('weather:chihuahua')).resolves.toBeNull();
    jest.useRealTimers();
  });
});
