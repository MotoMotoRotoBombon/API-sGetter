import { WeatherData } from '@domain/entities/CityData';
import { WeatherProvider } from '@domain/services/WeatherProvider';
import { ExternalApiError } from '@shared/errors';

interface OpenWeatherMapResponse {
  main: { temp: number; humidity: number };
  weather: Array<{ description: string }>;
  wind: { speed: number };
}

export class OpenWeatherMapClient implements WeatherProvider {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private readonly apiKey: string) {}

  async getWeather(city: string): Promise<WeatherData> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ExternalApiError('OpenWeatherMap', `City not found: ${city}`);
      }
      throw new ExternalApiError(
        'OpenWeatherMap',
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as OpenWeatherMapResponse;

    return {
      temperature: data.main.temp,
      description: data.weather[0]?.description ?? 'unknown',
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  }
}
