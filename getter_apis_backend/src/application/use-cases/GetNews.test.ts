import { GetNews } from '@application/use-cases/GetNews';
import { NewsArticle } from '@domain/entities/CityData';
import { NewsProvider } from '@domain/services/NewsProvider';
import { CacheRepository } from '@domain/services/CacheRepository';
import { EventPublisher } from '@domain/services/EventPublisher';

const mockNews: NewsArticle[] = [
  {
    title: 'Breaking news in London',
    url: 'https://example.com/london-news',
    source: 'Example News',
    publishedAt: '2024-01-01T00:00:00Z',
  },
];

const createMockProvider = (news: NewsArticle[] = mockNews): NewsProvider => ({
  getNews: jest.fn().mockResolvedValue(news),
});

const createMockCache = (cached: NewsArticle[] | null = null): CacheRepository => ({
  get: jest.fn().mockResolvedValue(cached),
  set: jest.fn().mockResolvedValue(undefined),
});

const createMockPublisher = (): EventPublisher => ({
  publish: jest.fn().mockResolvedValue(undefined),
});

describe('GetNews', () => {
  it('returns cached news when available', async () => {
    const useCase = new GetNews(
      createMockProvider(),
      createMockCache(mockNews),
      createMockPublisher()
    );

    const result = await useCase.execute('London');

    expect(result).toEqual(mockNews);
  });

  it('fetches from provider on cache miss and caches result', async () => {
    const provider = createMockProvider(mockNews);
    const cache = createMockCache(null);
    const publisher = createMockPublisher();

    const useCase = new GetNews(provider, cache, publisher);
    const result = await useCase.execute('London');

    expect(result).toEqual(mockNews);
    expect(provider.getNews).toHaveBeenCalledWith('London');
    expect(cache.set).toHaveBeenCalledWith('news:london', mockNews, 1800);
  });

  it('publishes a news-fetched event on cache miss', async () => {
    const provider = createMockProvider(mockNews);
    const cache = createMockCache(null);
    const publisher = createMockPublisher();

    const useCase = new GetNews(provider, cache, publisher);
    await useCase.execute('London');

    expect(publisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'news-fetched',
        city: 'London',
      })
    );
  });

  it('does not call provider or publisher on cache hit', async () => {
    const provider = createMockProvider();
    const cache = createMockCache(mockNews);
    const publisher = createMockPublisher();

    const useCase = new GetNews(provider, cache, publisher);
    await useCase.execute('London');

    expect(provider.getNews).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('normalizes city name to lowercase for cache key', async () => {
    const provider = createMockProvider(mockNews);
    const cache = createMockCache(null);
    const publisher = createMockPublisher();

    const useCase = new GetNews(provider, cache, publisher);
    await useCase.execute('NewYork');

    expect(cache.set).toHaveBeenCalledWith('news:newyork', mockNews, 1800);
  });
});
