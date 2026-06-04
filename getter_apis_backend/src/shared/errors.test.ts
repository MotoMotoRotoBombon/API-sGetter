import { AppError, ExternalApiError } from '@shared/errors';

describe('AppError', () => {
  it('sets default statusCode to 500', () => {
    const error = new AppError('something broke');
    expect(error.message).toBe('something broke');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('AppError');
  });

  it('accepts a custom statusCode', () => {
    const error = new AppError('not found', 404);
    expect(error.statusCode).toBe(404);
  });
});

describe('ExternalApiError', () => {
  it('formats message with service name and sets 502', () => {
    const error = new ExternalApiError('OpenWeatherMap', 'timeout');
    expect(error.message).toBe('OpenWeatherMap: timeout');
    expect(error.statusCode).toBe(502);
    expect(error.name).toBe('ExternalApiError');
  });
});
