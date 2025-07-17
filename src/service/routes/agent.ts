import Fetcher from '@service/fetcher';

/**
 * An API class for handling agent requests.
 */
export default class AgentAPI extends Fetcher {
  /**
   * Sends a request to start a new game.
   * @param story_id - The ID of the story to start.
   * @param temp_user_id - The temporary user ID for the agent.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async start(story_id: string, temp_user_id: string) {
    return this.request<GameData>('/agent/start-new-story', {
      method: 'POST',
      body: JSON.stringify({ story_id, temp_user_id }),
    });
  }

  /**
   * Sends a request to respond to the current game step.
   * @param game_id - The ID of the game to respond to.
   * @param choice - The player's choice.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async respond(game_id: string, choice: number) {
    return this.request<GameData>('/agent/story-response', {
      method: 'POST',
      body: JSON.stringify({ game_id, choice }),
    });
  }
}
