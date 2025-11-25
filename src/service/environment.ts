import Fetcher from './fetcher';

export default class EnvironmentAPI extends Fetcher {
  protected group: string = '/environment';
  protected testingGroup: string = `${this.group}/testing`;

  /**
   * Logs in a user with the given email.
   * @param email The email of the user to log in.
   * @returns A promise that resolves to the login response.
   */
  async login(email: string) {
    return this.request<null>(
      `${this.testingGroup}/login?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
      },
    );
  }

  /**
   * Check if tester is approved.
   * @param tester_id The tester ID of the user to check.
   * @returns A promise that resolves to a participation ID.
   */
  async isTester() {
    return this.request<string>(`${this.testingGroup}/tester`);
  }

  /**
   * Logs in a user with the given email.
   * @param session_id The session ID of the user to start session.
   * @param tester_id The tester ID of the user to start session.
   * @returns A promise that resolves to participation ID
   */
  async start(session_id: string, tester_id: string) {
    return this.request<string>(
      `${this.testingGroup}/start/${encodeURIComponent(session_id)}/${encodeURIComponent(tester_id)}`,
    );
  }

  /**
   * Logs in a user with the given email.
   * @param tester_id The tester ID of the user to end session.
   * @returns A promise that resolves to the login response.
   */
  async end(participation_id: string) {
    return this.request<null>(
      `${this.testingGroup}/end/${encodeURIComponent(participation_id)}`,
    );
  }
}
