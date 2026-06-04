import { CityPulseEvent } from '@domain/entities/CityPulseEvent';

export interface EventPublisher {
  publish(event: CityPulseEvent): Promise<void>;
}
