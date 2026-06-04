import { City } from '@domain/entities/City';
import { CityRepository } from '@domain/services/CityRepository';

export class SearchCities {
  constructor(private readonly cityRepository: CityRepository) {}

  async execute(query: string, limit?: number): Promise<City[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    return this.cityRepository.searchCities(query.trim(), limit);
  }
}
