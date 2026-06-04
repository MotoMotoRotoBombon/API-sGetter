import { CityRepository } from '@domain/services/CityRepository';
import { WeatherData, NewsArticle } from '@domain/entities/CityData';

export class StoreCityData {
  constructor(private readonly cityRepository: CityRepository) {}

  async storeWeather(cityName: string, weather: WeatherData): Promise<void> {
    const city = await this.cityRepository.findCityByName(cityName);
    if (!city) return;

    await this.cityRepository.saveWeather({
      cityId: city.id,
      temperature: weather.temperature,
      description: weather.description,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      fetchedAt: new Date().toISOString(),
    });
  }

  async storeNews(cityName: string, news: NewsArticle[]): Promise<void> {
    const city = await this.cityRepository.findCityByName(cityName);
    if (!city) return;

    const records = news.map((article) => ({
      cityId: city.id,
      title: article.title,
      url: article.url,
      source: article.source,
      publishedAt: article.publishedAt,
      fetchedAt: new Date().toISOString(),
    }));

    await this.cityRepository.saveNews(records);
  }
}
