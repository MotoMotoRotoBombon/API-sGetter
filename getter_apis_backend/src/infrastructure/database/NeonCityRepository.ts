import { CityRepository } from '@domain/services/CityRepository';
import { City, CityWeatherRecord, CityNewsRecord } from '@domain/entities/City';
import { cities, cityWeather, cityNews } from './schema';
import { ilike, sql } from 'drizzle-orm';
import type { Db } from './client';

export class NeonCityRepository implements CityRepository {
  constructor(private readonly db: Db) {}

  async searchCities(query: string, limit = 10): Promise<City[]> {
    const rows = await this.db
      .select()
      .from(cities)
      .where(ilike(cities.name, `${query}%`))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      country: row.country,
      countryCode: row.countryCode,
      lat: row.lat,
      lng: row.lng,
      timezone: row.timezone,
    }));
  }

  async findCityByName(name: string): Promise<City | null> {
    const rows = await this.db
      .select()
      .from(cities)
      .where(sql`LOWER(${cities.name}) = LOWER(${name})`)
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      country: row.country,
      countryCode: row.countryCode,
      lat: row.lat,
      lng: row.lng,
      timezone: row.timezone,
    };
  }

  async saveWeather(record: Omit<CityWeatherRecord, 'id'>): Promise<void> {
    await this.db.insert(cityWeather).values({
      cityId: record.cityId,
      temperature: record.temperature,
      description: record.description,
      humidity: record.humidity,
      windSpeed: record.windSpeed,
      fetchedAt: new Date(record.fetchedAt),
    });
  }

  async saveNews(records: Omit<CityNewsRecord, 'id'>[]): Promise<void> {
    if (records.length === 0) return;

    await this.db.insert(cityNews).values(
      records.map((record) => ({
        cityId: record.cityId,
        title: record.title,
        url: record.url,
        source: record.source,
        publishedAt: new Date(record.publishedAt),
        fetchedAt: new Date(record.fetchedAt),
      }))
    );
  }
}
