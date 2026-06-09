import { CityPulseEvent } from '@domain/entities/CityPulseEvent';
import { EventPublisher } from '@domain/services/EventPublisher';

export class ConsoleEventPublisher implements EventPublisher {
  async publish(event: CityPulseEvent): Promise<void> {
    console.warn(`[LOCAL EVENT] ${JSON.stringify(event)}`);
  }
}
