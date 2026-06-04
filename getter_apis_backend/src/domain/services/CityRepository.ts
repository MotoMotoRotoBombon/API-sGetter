import { City, CityWeatherRecord, CityNewsRecord } from '@domain/entities/City';

export interface CityRepository {
  searchCities(query: string, limit?: number): Promise<City[]>;
  findCityByName(name: string): Promise<City | null>;
  saveWeather(record: Omit<CityWeatherRecord, 'id'>): Promise<void>;
  saveNews(records: Omit<CityNewsRecord, 'id'>[]): Promise<void>;
}
