import { WeatherData } from '@domain/entities/CityData';

export interface WeatherProvider {
  getWeather(city: string): Promise<WeatherData>;
}
