export interface HealthResponse {
  message: string;
  status: string;
  timestamp: string;
}

export class GetHealth {
  execute(): HealthResponse {
    return {
      message: 'CityPulse is alive!',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
