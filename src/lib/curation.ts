import { api_error } from '@errors/index';
import GovernAPI from '@service/v2/govern';

class Curation {
  protected api: GovernAPI;

  constructor() {
    this.api = new GovernAPI(import.meta.env.PUBLIC_BACKEND);
  }

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

  async neYonVotes(request: TopicVoteRequest): Promise<boolean> {
    const { status, message } = await this.api.neYonVotes(request);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    return true;
  }

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
