import Fetcher from './fetcher';

export default class GovernAPI extends Fetcher {
  protected group: string = '/govern';

  /**
   * Get Omnihub Data
   * @param contract_id - The ID of the contract to retrieve data for.
   * @param refresh - Optional flag to indicate if the request should refresh the data.
   * @returns A promise that resolves to the Omnihub data or an error.
   */
  async omnihub(contract_id: string, refresh: boolean = false) {
    return this.request<OmnihubData>(
      `${this.group}/omnihub/${contract_id}?refresh=${refresh}`,
    );
  }

  /**
   * Get active sessions
   * @param page - The page number to retrieve.
   * @param pageSize - The number of items per page.
   * @returns A promise that resolves to the active sessions or an error.
   */
  async activeSessions(page: number = 1, pageSize: number = 10) {
    return this.request<ActiveSession[]>(
      `${this.group}/active-sessions?page=${page}&pageSize=${pageSize}`,
    );
  }

  /**
   * Cast a new yen vote
   * @param request - The vote request data.
   * @returns A promise that resolves to the vote result or an error.
   */
  async neYonVotes(request: TopicVoteRequest) {
    return this.request(`${this.group}/ne-yon-votes`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Cast a regular vote
   * @param request - The vote request data.
   * @returns A promise that resolves to the vote result or an error.
   */
  async regularVotes(request: TopicVoteRequest) {
    return this.request(`${this.group}/regular-votes`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}
