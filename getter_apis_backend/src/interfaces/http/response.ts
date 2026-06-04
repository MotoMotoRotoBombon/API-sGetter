export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const formatResponse = <T>(statusCode: number, data: T) => ({
  statusCode,
  body: JSON.stringify({ success: true, data } as ApiResponse<T>),
});

export const formatError = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ success: false, error: message } as ApiResponse<never>),
});
