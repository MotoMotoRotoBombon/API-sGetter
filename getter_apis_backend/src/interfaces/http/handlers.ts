import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetHealth } from '@application/use-cases/GetHealth';
import { GetWeather } from '@application/use-cases/GetWeather';
import { GetNews } from '@application/use-cases/GetNews';
import { SearchCities } from '@application/use-cases/SearchCities';
import { StoreCityData } from '@application/use-cases/StoreCityData';
import { OpenWeatherMapClient } from '@infrastructure/external/OpenWeatherMapClient';
import { NewsApiClient } from '@infrastructure/external/NewsApiClient';
import { DynamoDBCacheRepository } from '@infrastructure/cache/DynamoDBCacheRepository';
import { InMemoryCacheRepository } from '@infrastructure/cache/InMemoryCacheRepository';
import { SNSPublisher } from '@infrastructure/messaging/SNSPublisher';
import { ConsoleEventPublisher } from '@infrastructure/messaging/ConsoleEventPublisher';
import { createDb } from '@infrastructure/database/client';
import { NeonCityRepository } from '@infrastructure/database/NeonCityRepository';
import { CacheRepository } from '@domain/services/CacheRepository';
import { EventPublisher } from '@domain/services/EventPublisher';
import { AppError } from '@shared/errors';
import { formatResponse, formatError } from './response';

const getHealth = new GetHealth();

const isOffline = process.env.IS_OFFLINE === 'true';

const cacheRepository: CacheRepository = isOffline
  ? new InMemoryCacheRepository()
  : new DynamoDBCacheRepository(process.env.CACHE_TABLE_NAME ?? '');

const eventPublisher: EventPublisher = isOffline
  ? new ConsoleEventPublisher()
  : new SNSPublisher(process.env.SNS_TOPIC_ARN ?? '');

let storeCityData: StoreCityData | undefined;
let searchCities: SearchCities | undefined;

const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
  const db = createDb(databaseUrl);
  const cityRepository = new NeonCityRepository(db);
  storeCityData = new StoreCityData(cityRepository);
  searchCities = new SearchCities(cityRepository);
}

const getWeather = new GetWeather(
  new OpenWeatherMapClient(process.env.OPENWEATHER_API_KEY ?? ''),
  cacheRepository,
  eventPublisher,
  storeCityData
);

const getNews = new GetNews(
  new NewsApiClient(process.env.NEWS_API_KEY ?? ''),
  cacheRepository,
  eventPublisher,
  storeCityData
);

export const ping = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const result = getHealth.execute();
    return formatResponse(200, result);
  } catch (error) {
    return formatError(500, error instanceof Error ? error.message : 'Internal server error');
  }
};

export const weather = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const city = event.pathParameters?.city;

    if (!city) {
      return formatError(400, 'City parameter is required');
    }

    const result = await getWeather.execute(city);
    return formatResponse(200, result);
  } catch (error) {
    if (error instanceof AppError) {
      return formatError(error.statusCode, error.message);
    }
    return formatError(500, error instanceof Error ? error.message : 'Internal server error');
  }
};

export const news = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const city = event.pathParameters?.city;

    if (!city) {
      return formatError(400, 'City parameter is required');
    }

    const result = await getNews.execute(city);
    return formatResponse(200, result);
  } catch (error) {
    if (error instanceof AppError) {
      return formatError(error.statusCode, error.message);
    }
    return formatError(500, error instanceof Error ? error.message : 'Internal server error');
  }
};

export const cities = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!searchCities) {
      return formatError(503, 'City search is not available — DATABASE_URL is not configured');
    }

    const query = event.queryStringParameters?.q;

    if (!query) {
      return formatError(400, 'Query parameter "q" is required');
    }

    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit, 10)
      : undefined;

    const result = await searchCities.execute(query, limit);
    return formatResponse(200, result);
  } catch (error) {
    if (error instanceof AppError) {
      return formatError(error.statusCode, error.message);
    }
    return formatError(500, error instanceof Error ? error.message : 'Internal server error');
  }
};
