/**
 * A class to handle HTTP requests.
 * @example
 * ```ts
 * const baseUrl = 'https://api.example.com';
 * const authApi = new AuthAPI(baseUrl);
 * const gameApi = new GameAPI(baseUrl);
 *
 * // Sign in
 * authApi.signin({ username: 'user1', password: 'password123' }).then((response) => {
 *  if (response.data) {
 *   console.log('Signin successful');
 * } else {
 *  console.error('Signin failed:', response.error);
 * }
 * });
 *
 * // Get TTS
 * gameApi.getTTS({ text: 'Hello world' }).then((response) => {
 * if (response.data) {
 * console.log('TTS fetched successfully');
 * // Handle Blob data here
 * } else {
 * console.error('TTS fetch failed:', response.error);
 * }
 * });
 * ```
 *
 */
export default class Fetcher {
  protected baseUrl: string;
  protected apiKey: string;

  /**
   * Creates an instance of Fetcher.
   * @param baseUrl - The base URL for the API.
   */
  constructor(baseUrl: string = import.meta.env.PUBLIC_BACKEND as string) {
    this.baseUrl = baseUrl;
    this.apiKey = import.meta.env.PUBLIC_BACKEND_API_KEY || '';
  }

  private async doFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    responseType: 'json' | 'blob' | 'text' = 'json',
  ): Promise<APIResponse<T>> {
    const headers: HeadersInit = {
      ...options.headers,
      'Cache-Control': 'no-cache',
      ...(this.apiKey ? { 'X-API-KEY': this.apiKey } : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      return {
        status: 'error',
        message: 'Unauthorized access',
        error: { details: 'Unauthorized access' },
      };
    }

    const contentType = response.headers.get('Content-Type') || '';
    const isJson = contentType.includes('application/json');

    if (responseType === 'json' && isJson) {
      return await response.json();
    }
    if (responseType === 'blob') {
      return {
        status: 'success',
        message: 'Blob fetched successfully',
        data: (await response.blob()) as T,
      };
    }
    if (responseType === 'text') {
      return {
        status: 'success',
        message: 'Text fetched successfully',
        data: (await response.text()) as unknown as T,
      };
    }

    return {
      status: 'error',
      message: 'Unexpected error occurred',
      error: { details: `Unexpected error occurred: ${responseType}` },
    };
  }

  /**
   * Sends an HTTP request to the specified endpoint.
   * @template T - The expected response type.
   * @param endpoint - The API endpoint to send the request to.
   * @param options - The options for the request, such as method, headers, etc.
   * @param responseType - The type of response expected ('json' or 'blob'). Defaults to 'json'.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    responseType: 'json' | 'blob' | 'text' = 'json',
  ): Promise<APIResponse<T>> {
    try {
      return await this.doFetch<T>(endpoint, options, responseType);
    } catch (error) {
      return {
        status: 'error',
        message: (error as Error).message,
        error: { details: String(error) },
      };
    }
  }

  protected async requestRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    responseType: 'json' | 'blob' | 'text' = 'json',
    retries = 3, // Number of retries before failing
    delay = 500, // Initial delay in ms (doubles each retry)
  ): Promise<APIResponse<T>> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.doFetch<T>(endpoint, options, responseType);
      } catch (error) {
        if (attempt < retries) {
          console.warn(
            `Retrying ${endpoint} (attempt ${attempt + 1}/${retries})`,
          );
          await new Promise((res) =>
            setTimeout(res, delay * Math.pow(2, attempt)),
          );
          continue;
        }
        return {
          status: 'error',
          message: (error as Error).message,
          error: { details: String(error) },
        };
      }
    }

    return {
      status: 'error',
      message: 'Max retries exceeded',
      error: { details: 'Max retries exceeded' },
    };
  }
}
