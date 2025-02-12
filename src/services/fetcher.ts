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
class Fetcher {
  /**
   * The base URL for the API.
   */
  protected baseUrl: string;

  /**
   * Creates an instance of Fetcher.
   * @param baseUrl - The base URL for the API.
   */
  constructor(baseUrl: string) {
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
  ): Promise<APIResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Ensure cookies are sent with requests
    });

    const contentType = response.headers.get('Content-Type');
    const isJson = contentType && contentType.includes('application/json');
    let responseData: any;

    if (responseType === 'json' && isJson) {
      responseData = await response.json();
    } else if (responseType === 'blob') {
      responseData = await response.blob();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      return {
        error: {
          message:
            responseData.error || response.statusText || 'An error occurred',
          details: isJson ? responseData.error : responseData,
        },
      };
    }

    return { data: responseData };
  }
}

/**
 * An API class for handling authentication requests.
 */
export class AuthAPI extends Fetcher {
  /**
   * Sends a request to sign in a user.
   * @param credentials - The user's credentials.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async signin(credentials: { username: string; password: string }) {
    return this.request<{ success: boolean }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Sends a request to sign up a user.
   * @param user - The user's details.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async signup(user: ReferralSignUp) {
    return this.request<{ user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  /**
   * Confirm the user's email address.
   * @param email - The user's email address.
   * @param token - The confirmation token.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async confirmEmail(email: string, token: string) {
    return this.request<{ success: boolean }>(
      `/auth/confirm-email?email=${email}&token=${token}`,
    );
  }

  /**
   * Oauth request to signin with google.
   * @param token - The google token.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async googleSignin() {
    return this.request<{ url: string }>('/auth/google-signin');
  }

  /**
   * Forgot password request.
   * @param email - The user's email address.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async forgotPassword(email: string) {
    return this.request<{ success: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Sends a request to trigger password reset.
   * @param email - The user's email address.
   * @param token - The reset token.
   * @param password - The new password.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async resetPassword(email: string, token: string, password: string) {
    return this.request<{ success: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, password }),
    });
  }

  /**
   * Get Nonce for web3 wallet signin.
   * @param address - The user's wallet address.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async web3Getnonce(address: string) {
    return this.request<{ nonce: number }>(
      `/auth/web3-get-nonce?address=${address}`,
    );
  }

  /**
   * Signin with web3 wallet.
   * @param signin - The wallet details to signin.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async web4WalletSignin(signin: Web3Signin) {
    return this.request<{ user: User }>('/auth/web3-wallet-signin', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }
}

/**
 * An API class for handling account requests.
 */
export class AccountAPI extends Fetcher {
  /**
   * Sends a request to get the current user's details.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async me() {
    return this.request<{ user: User }>('/account/me');
  }

  /**
   * Link a new wallet to the user's account.
   * @param signin - The wallet details to link.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async web3WalletLink(signin: Web3Signin) {
    return this.request<{ user: User }>('/account/web3-wallet-link', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }

  /**
   * Unlink the specified wallet from the user's account.
   * @param signin - The wallet details to unlink.
   * @returns A promise that resolves to an APIResponse containing the response data or
   * an error.
   * */
  async web3WalletUnlink(signin: Web3Signin) {
    // TODO: Define in backend
    return this.request<{ success: boolean }>('/account/web3-wallet-unlink', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }

  /**
   * Select a wallet to use for the user's account.
   * @param wallet - The wallet address to select.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async web3SelectWallet(wallet: string) {
    return this.request<{ user: User }>('/account/web3-select-wallet', {
      method: 'POST',
      body: JSON.stringify(wallet),
    });
  }

  /**
   * Update the user's profile details.
   * @param profile - The profile details to update.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async changePassword(passwords: { old: string; new: string }) {
    return this.request<{ success: boolean }>('/account/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  /**
   * Logout the current user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async logout() {
    return this.request<{ success: boolean }>('/account/logout');
  }

  /**
   * Use a referral code provided by another user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async useReferralCode(code: string) {
    return this.request<{ success: boolean }>(
      `/account/use-referral-code/${code}`,
    );
  }

  /**
   * Generate referral codes for the user to share with others.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async createReferralCodes() {
    return this.request<{ codes: ReferralCode[] }>(
      '/account/create-referral-codes',
    );
  }

  /**
   * Get the user's referral codes.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async getReferralCodes() {
    return this.request<{ codes: ReferralCode[] }>('/account/referral-codes');
  }

  /**
   * Validate a referral code provided by another user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async validateReferralCode(code: string) {
    return this.request<{ valid: boolean }>(
      `/account/validate-referral-code/${code}`,
    );
  }
}

/**
 * An API class for handling game requests.
 */
export class GameAPI extends Fetcher {
  /**
   * Sends a request to start a new game.
   * @param category - The category of the game.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async startGame(category: string) {
    return this.request<{ game: GameData }>('/game/start', {
      method: 'POST',
      body: JSON.stringify({ category }),
    });
  }

  /**
   * Sends a request to continue an existing game.
   * @param story_id - The ID of the story to continue.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async continue(story_id: string) {
    return this.request<{ game: GameData }>('/game/continue', {
      method: 'POST',
      body: JSON.stringify({ story_id }),
    });
  }

  /**
   * Sends a request to respond to the current game step.
   * @param choice - The player's choice.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async respond(choice: string) {
    return this.request<{ game: GameData }>('/game/respond', {
      method: 'POST',
      body: JSON.stringify({ choice }),
    });
  }

  /**
   * Sends a request to get the TTS audio for the specified text.
   * @param text - The text to convert to speech.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async getTTS(story_id: string ) {
    return this.request<Blob>(
      `/game/tts`,
      { 
        method: 'POST',
        body: JSON.stringify({ story_id }),
      },
      'blob',
    );
  }

  async loadStep(step: number) {
    return this.request<{ game: GameData }>(`/game/load-step/${step}`);
  }

  async loadStepImage(step: number) {
    return this.request<Blob>(`/game/load-step-image/${step}`, {}, 'blob');
  }

  async deleteStory(storyId: string) {
    return this.request<{ success: boolean }>(`/game/delete-story/${storyId}`, {
      method: 'DELETE',
    });
  }
}

export class ViewAPI extends Fetcher {
  async sections() {
    return this.request<{ sections: Section[] }>('/view/sections');
  }

  async sectionCategories(section: string) {
    return this.request<{ categories: SectionCategory[] }>(
      `/view/section-categories/${section}`,
    );
  }

  async topicByName(name: string) {
    return this.request<{ topic: SectionTopic }>(`/view/topic/${name}`);
  }

  async searchSectionByTopic(section: string, topic: string) {
    return this.request<{ category: SectionCategory }>(
      `/view/topics/section/${section}/${topic}`,
    );
  }

  async genres() {
    return this.request<{ genres: Genre[] }>('/view/genres');
  }

  async genreTopics(genre: string) {
    return this.request<{ topics: SectionCategory[] }>(
      `/view/genre-topics/${genre}`,
    );
  }
}
