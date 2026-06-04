import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { CityPulseEvent } from '@domain/entities/CityPulseEvent';
import { EventPublisher } from '@domain/services/EventPublisher';

export class SNSPublisher implements EventPublisher {
  private readonly client: SNSClient;

  constructor(
    private readonly topicArn: string,
    snsClient?: SNSClient
  ) {
    this.client = snsClient ?? new SNSClient({});
  }

  async publish(event: CityPulseEvent): Promise<void> {
    await this.client.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(event),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: event.type,
          },
        },
      })
    );
  }
}
