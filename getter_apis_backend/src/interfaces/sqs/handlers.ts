import { SQSEvent } from 'aws-lambda';
import { CityPulseEvent } from '@domain/entities/CityPulseEvent';

function unwrapSnsMessage(raw: string): CityPulseEvent {
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (typeof parsed.Message === 'string') {
    return JSON.parse(parsed.Message) as CityPulseEvent;
  }

  return parsed as unknown as CityPulseEvent;
}

export const processAudit = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const body = unwrapSnsMessage(record.body);
    console.warn(`[AUDIT] type=${body.type} city=${body.city} ts=${body.timestamp}`);
  }
};

export const processAlert = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const body = unwrapSnsMessage(record.body);
    console.error(
      `[ALERT/DLQ] type=${body.type} city=${body.city} ts=${body.timestamp} — message failed processing after max retries`
    );
  }
};
