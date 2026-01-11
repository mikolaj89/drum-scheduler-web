

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




export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  async request<T>(
    endpoint: string,
    method: string,
    body?: unknown,
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T | null>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: { ...this.headers, ...customHeaders },
        body: body ? JSON.stringify(body) : undefined,
      });

      let responseData: ApiResponse<T> | null  = null;

      try {
        responseData = await response.json();
      } catch (error) {
        console.warn("Unable to parse JSON response:", error);
        if (!response.ok) {
          return {
            error: {
              message: "Request failed, but response is not JSON. Check server logs or network tab.",
              errorCode: "PARSE_ERROR",
            },
          };
        }
        // If the response is empty but the request was successful, return null data
        // This is a common case for DELETE requests or endpoints that return no content.
        return {
          data: null,
        };
      }

      return responseData!;
    
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : "Network error",
          errorCode: "NETWORK_ERROR",
        },
      };
    }
  }

  get<T>(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T | null>> {
    return this.request<T>(endpoint, "GET", undefined, headers);
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T | null>> {
    return this.request<T>(endpoint, "POST", body, headers);
  }

  put<T>(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T | null>> {
    return this.request<T>(endpoint, "PUT", body, headers);
  }

  patch<T>(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T | null>> {
    return this.request<T>(endpoint, "PATCH", body, headers);
  }

  delete<T>(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T | null>> {
    return this.request<T>(endpoint, "DELETE", undefined, headers);
  }
}
