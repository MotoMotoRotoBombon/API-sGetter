import { NewsApiClient } from '@infrastructure/external/NewsApiClient';

const mockApiResponse = (body: object, status = 200) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 404 ? 'Not Found' : status === 401 ? 'Unauthorized' : 'OK',
    json: async () => body,
  });
};

describe('NewsApiClient', () => {
  let client: NewsApiClient;
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  beforeEach(() => {
    global.fetch = jest.fn();
    client = new NewsApiClient('test-api-key');
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('fetches and maps news articles', async () => {
    mockApiResponse({
      status: 'ok',
      totalResults: 2,
      articles: [
        {
          title: 'News about London',
          url: 'https://example.com/1',
          source: { name: 'BBC' },
          publishedAt: '2024-01-01T00:00:00Z',
        },
        {
          title: 'More London news',
          url: 'https://example.com/2',
          source: { name: 'The Guardian' },
          publishedAt: '2024-01-02T00:00:00Z',
        },
      ],
    });

    const result = await client.getNews('London');

    expect(result).toEqual([
      {
        title: 'News about London',
        url: 'https://example.com/1',
        source: 'BBC',
        publishedAt: '2024-01-01T00:00:00Z',
      },
      {
        title: 'More London news',
        url: 'https://example.com/2',
        source: 'The Guardian',
        publishedAt: '2024-01-02T00:00:00Z',
      },
    ]);
  });

  it('throws ExternalApiError on 401', async () => {
    mockApiResponse({}, 401);

    await expect(client.getNews('London')).rejects.toThrow('NewsAPI: Invalid or missing API key');
  });

  it('throws ExternalApiError on 403', async () => {
    mockApiResponse({}, 403);

    await expect(client.getNews('London')).rejects.toThrow('NewsAPI: Invalid or missing API key');
  });

  it('throws ExternalApiError on other HTTP errors', async () => {
    mockApiResponse({}, 500);

    await expect(client.getNews('London')).rejects.toThrow('NewsAPI: HTTP 500');
  });

  it('throws ExternalApiError when response status is not ok', async () => {
    mockApiResponse({ status: 'error', totalResults: 0, articles: [] });

    await expect(client.getNews('London')).rejects.toThrow(
      'NewsAPI: Unexpected response status: error'
    );
  });

  it('calls the correct URL with encoded city and API key', async () => {
    mockApiResponse({ status: 'ok', totalResults: 0, articles: [] });

    await client.getNews('New York');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://newsapi.org/v2/everything?q=New%20York&language=en&sortBy=publishedAt&pageSize=10&apiKey=test-api-key'
    );
  });
});
