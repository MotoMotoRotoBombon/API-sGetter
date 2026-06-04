export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface City {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;