export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export interface AirQualityData {
  aqi: number;
  dominantPollutant: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface CityData {
  city: string;
  weather?: WeatherData;
  airQuality?: AirQualityData;
  news?: NewsArticle[];
  updatedAt: string;
}
