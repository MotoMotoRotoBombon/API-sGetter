import { NewsArticle } from '@domain/entities/CityData';
import { NewsProvider } from '@domain/services/NewsProvider';
import { ExternalApiError } from '@shared/errors';

interface NewsApiArticle {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export class NewsApiClient implements NewsProvider {
  private readonly baseUrl = 'https://newsapi.org/v2/everything';

  constructor(private readonly apiKey: string) {}

  async getNews(city: string): Promise<NewsArticle[]> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new ExternalApiError('NewsAPI', 'Invalid or missing API key');
      }
      throw new ExternalApiError('NewsAPI', `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as NewsApiResponse;

    if (data.status !== 'ok') {
      throw new ExternalApiError('NewsAPI', `Unexpected response status: ${data.status}`);
    }

    return data.articles.map((article: NewsApiArticle) => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
  }
}
