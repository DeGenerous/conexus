import { api_error } from '@errors/index';
import GovernAPI from '@service/v2/govern';

/**
 * Handles governance and curation related operations.
 */
class Curation {
  protected api: GovernAPI;

  /**
   * Initialize the curation service with the configured backend endpoint.
   */
  constructor() {
    this.api = new GovernAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Retrieve Omnihub data for the provided contract.
   * @param contract_id - The identifier of the contract to query.
   * @param refresh - Whether to bypass cached data.
   * @returns The Omnihub data or null on failure.
   */
  async omnihub(
    contract_id: string,
    refresh: boolean = false,
  ): Promise<OmnihubData | null> {
    const { status, message, data } = await this.api.omnihub(
      contract_id,
      refresh,
    );

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  /**
   * Fetch active voting sessions with pagination support.
   * @param page - The page number to request.
   * @param pageSize - The number of sessions per page.
   * @returns A list of active sessions or an empty array on failure.
   */
  async activeSessions(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ActiveSession[]> {
    const { status, message, data } = await this.api.activeSessions(
      page,
      pageSize,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Submit a Ne-Yon vote for the supplied topic.
   * @param request - The vote payload to send.
   * @returns True when the vote succeeds, otherwise false.
   */
  async neYonVotes(request: TopicVoteRequest): Promise<boolean> {
    const { status, message } = await this.api.neYonVotes(request);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    return true;
  }

  /**
   * Submit a regular vote for the supplied topic.
   * @param request - The vote payload to send.
   * @returns True when the vote succeeds, otherwise false.
   */
  async regularVotes(request: TopicVoteRequest): Promise<boolean> {
    const { status, message } = await this.api.regularVotes(request);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    return true;
  }
}

export default Curation;
