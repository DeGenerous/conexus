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
  /**
   * The base URL for the API.
   */
  protected baseUrl: string;

  /**
   * Creates an instance of Fetcher.
   * @param baseUrl - The base URL for the API.
   */
  constructor(baseUrl: string = import.meta.env.PUBLIC_BACKEND as string) {
    this.baseUrl = baseUrl;
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
    responseType: 'json' | 'blob' = 'json',
    retries = 3, // Number of retries before failing
    delay = 500, // Initial delay in ms (doubles each retry)
  ): Promise<APIResponse<T>> {
    const headers: HeadersInit = {
      ...options.headers,
      'Cache-Control': 'no-cache',
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const contentType = response.headers.get('Content-Type');
      const isJson = contentType && contentType.includes('application/json');

      let responseData: APIResponse<T>;

      if (responseType === 'json' && isJson) {
        responseData = await response.json();
      } else if (responseType === 'blob') {
        responseData = { data: (await response.blob()) as T };
      } else {
        responseData = { data: (await response.text()) as unknown as T };
      }

      return responseData;
    } catch (error) {
      return { error: { message: (error as Error).message, details: error } };
    }
  }

  protected async requestRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    responseType: 'json' | 'blob' = 'json',
    retries = 3, // Number of retries before failing
    delay = 500, // Initial delay in ms (doubles each retry)
  ): Promise<APIResponse<T>> {
    const headers: HeadersInit = {
      ...options.headers,
      'Cache-Control': 'no-cache',
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      console.warn(`Fetching ${endpoint} (Attempt ${attempt + 1}/${retries})`);

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
        });

        const contentType = response.headers.get('Content-Type');
        const isJson = contentType && contentType.includes('application/json');

        let responseData: APIResponse<T>;

        if (responseType === 'json' && isJson) {
          responseData = await response.json();
        } else if (responseType === 'blob') {
          responseData = { data: (await response.blob()) as T };
        } else {
          responseData = { data: (await response.text()) as unknown as T };
        }

        return responseData;
      } catch (error) {
        console.error(`Request failed to ${endpoint}:`, error);

        if (attempt < retries) {
          await new Promise((res) =>
            setTimeout(res, delay * Math.pow(2, attempt)),
          );
          continue;
        }

        if (
          (error as Error).message.includes('Failed to parse URL from /api/') &&
          retries > 0
        ) {
          return this.request(
            endpoint,
            options,
            responseType,
            retries - 1,
            delay,
          );
        }

        return { error: error as Error };
      }
    }

    return { error: new Error('Max retries exceeded') };
  }
}
