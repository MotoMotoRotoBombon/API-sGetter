import { NewsArticle } from '@domain/entities/CityData';
import { CityPulseEvent } from '@domain/entities/CityPulseEvent';
import { CacheRepository } from '@domain/services/CacheRepository';
import { NewsProvider } from '@domain/services/NewsProvider';
import { EventPublisher } from '@domain/services/EventPublisher';
import { StoreCityData } from '@application/use-cases/StoreCityData';

const CACHE_TTL_SECONDS = 1800;

export class GetNews {
  constructor(
    private readonly newsProvider: NewsProvider,
    private readonly cacheRepository: CacheRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly storeCityData?: StoreCityData
  ) {}

  async execute(city: string): Promise<NewsArticle[]> {
    const cacheKey = `news:${city.toLowerCase()}`;

    const cached = await this.cacheRepository.get<NewsArticle[]>(cacheKey);
    if (cached) return cached;

    const news = await this.newsProvider.getNews(city);
    await this.cacheRepository.set(cacheKey, news, CACHE_TTL_SECONDS);

    const event: CityPulseEvent = {
      type: 'news-fetched',
      city,
      data: { articleCount: news.length },
      timestamp: new Date().toISOString(),
    };
    await this.eventPublisher.publish(event);

    if (this.storeCityData) {
      this.storeCityData.storeNews(city, news).catch(() => {});
    }

    return news;
  }
}
