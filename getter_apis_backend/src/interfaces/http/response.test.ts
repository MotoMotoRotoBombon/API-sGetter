import { formatResponse, formatError } from '@interfaces/http/response';

describe('formatResponse', () => {
  it('formats a success response', () => {
    const result = formatResponse(200, { message: 'hello' });

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ message: 'hello' });
  });
});

describe('formatError', () => {
  it('formats an error response', () => {
    const result = formatError(502, 'bad gateway');

    expect(result.statusCode).toBe(502);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('bad gateway');
  });
});
