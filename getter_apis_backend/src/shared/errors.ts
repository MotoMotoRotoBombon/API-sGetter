export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ExternalApiError extends AppError {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`, 502);
    this.name = 'ExternalApiError';
  }
}
