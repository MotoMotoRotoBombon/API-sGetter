import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { CacheRepository } from '@domain/services/CacheRepository';

export class DynamoDBCacheRepository implements CacheRepository {
  private readonly client: DynamoDBDocumentClient;

  constructor(
    private readonly tableName: string,
    dynamodbClient?: DynamoDBClient
  ) {
    this.client = DynamoDBDocumentClient.from(dynamodbClient ?? new DynamoDBClient({}));
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { pk: key },
      })
    );

    if (!result.Item) return null;

    const now = Math.floor(Date.now() / 1000);
    if (result.Item.ttl && result.Item.ttl < now) return null;

    return result.Item.data as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const item: Record<string, unknown> = {
      pk: key,
      data: value,
    };

    if (ttlSeconds) {
      item.ttl = Math.floor(Date.now() / 1000) + ttlSeconds;
    }

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }
}
