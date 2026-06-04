export interface City {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface CityWeatherRecord {
  id: number;
  cityId: number;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  fetchedAt: string;
}

export interface CityNewsRecord {
  id: number;
  cityId: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  fetchedAt: string;
}
