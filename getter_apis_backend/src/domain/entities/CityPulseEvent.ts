export interface CityPulseEvent {
  type: string;
  city: string;
  data: Record<string, unknown>;
  timestamp: string;
}
