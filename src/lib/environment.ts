import { api_error } from '@errors/index';
import EnvironmentAPI from '@service/environment';
import { redirectTo } from '@utils/route-guard';

/**
 * Provides read-only helpers for fetching view data and caching responses.
 */
export default class Environment {
  protected api: EnvironmentAPI;

  private static instance: Environment;

  /**
   * Initialize the view service with the configured backend endpoint.
   */
  constructor() {
    this.api = new EnvironmentAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Get or create the singleton AppView instance.
   * @returns The shared Environment instance.
   */
  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  /**
   * Log in a tester with the given email.
   * @param email The email of the tester to log in.
   * @returns A promise that resolves to the login response.
   */
  async login(email: string) {
    const { status, message } = await this.api.login(email);

    if (status === 'error') {
      api_error(message);
      return;
    }

    redirectTo('/');
    return;
  }

  /**
   * Check if tester is approved.
   * @param tester_id The tester ID of the user to check.
   * @returns A promise that resolves to participation ID or null.
   */
  async isTester(): Promise<boolean> {
    const { status } = await this.api.isTester();

    if (status === 'error') {
      // api_error(message); // do not throw error
      return false;
    }

    return true;
  }

  /**
   * Log in a tester with the given email.
   * @param email The email of the tester to log in.
   * @returns A promise that resolves to the login response.
   */
  async startSession(session_id: string, tester_id: string) {
    const { status, message, data } = await this.api.start(
      session_id,
      tester_id,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    return data || null;
  }

  /**
   * End a tester session with the given participation ID.
   * @param participation_id The participation ID of the tester to end session.
   * @returns A promise that resolves to the end session response.
   */
  async endSession(participation_id: string) {
    const { status, message } = await this.api.end(participation_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    return null;
  }
}
