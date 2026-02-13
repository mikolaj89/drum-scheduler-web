export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "PARSE_ERROR";

// Success response (for 2xx status codes)
export interface ApiSuccessResponse<T> {
  data: T;
}

// Error response (for 4xx, 5xx status codes)
export interface ApiErrorResponse {
  error: {
    message: string;
    errorCode: string;
    fieldErrors?: Record<string, string>;
  };
}

// These would never appear together in one response
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const getFormattedErrorBody = (
  message: string,
  errorCode: ErrorCode
): ApiErrorResponse => {
  return {
    error: {
      message,
      errorCode,
    },
  };
};
