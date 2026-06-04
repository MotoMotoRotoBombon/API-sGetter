import { NewsArticle } from '@domain/entities/CityData';

export interface NewsProvider {
  getNews(city: string): Promise<NewsArticle[]>;
}
