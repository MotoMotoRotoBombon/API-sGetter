import { WeatherData } from '@domain/entities/CityData';
import { CityPulseEvent } from '@domain/entities/CityPulseEvent';
import { CacheRepository } from '@domain/services/CacheRepository';
import { WeatherProvider } from '@domain/services/WeatherProvider';
import { EventPublisher } from '@domain/services/EventPublisher';
import { StoreCityData } from '@application/use-cases/StoreCityData';

const CACHE_TTL_SECONDS = 600;

export class GetWeather {
  constructor(
    private readonly weatherProvider: WeatherProvider,
    private readonly cacheRepository: CacheRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly storeCityData?: StoreCityData
  ) {}

  async execute(city: string): Promise<WeatherData> {
    const cacheKey = `weather:${city.toLowerCase()}`;

    const cached = await this.cacheRepository.get<WeatherData>(cacheKey);
    if (cached) return cached;

    const weather = await this.weatherProvider.getWeather(city);
    await this.cacheRepository.set(cacheKey, weather, CACHE_TTL_SECONDS);

    const event: CityPulseEvent = {
      type: 'weather-fetched',
      city,
      data: { temperature: weather.temperature, description: weather.description },
      timestamp: new Date().toISOString(),
    };
    await this.eventPublisher.publish(event);

    if (this.storeCityData) {
      this.storeCityData.storeWeather(city, weather).catch(() => {});
    }

    return weather;
  }
}
