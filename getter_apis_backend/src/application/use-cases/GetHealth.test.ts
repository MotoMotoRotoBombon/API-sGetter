import { GetHealth } from '@application/use-cases/GetHealth';

describe('GetHealth', () => {
  it('returns correct health response', () => {
    const useCase = new GetHealth();
    const result = useCase.execute();

    expect(result.message).toBe('CityPulse is alive!');
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeTruthy();
  });

  it('returns a valid ISO timestamp', () => {
    const useCase = new GetHealth();
    const result = useCase.execute();

    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
