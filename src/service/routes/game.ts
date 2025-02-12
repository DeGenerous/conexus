import Fetcher from '@service/fetcher';

/**
 * An API class for handling game requests.
 */
export default class GameAPI extends Fetcher {
  /**
   * Sends a request to start a new game.
   * @param category - The category of the game.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async startGame(category: string) {
    return this.request<GameData>('/game/start', {
      method: 'POST',
      body: JSON.stringify({ category }),
    });
  }

  /**
   * Continuables by topic.
   * @param topic - The topic of the game.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async continuablesByTopic(topic: string) {
    return this.request<ContinuableStory[]>(
      `/game/continuable-stories/${topic}`,
    );
  }

  /**
   * Sends a request to continue an existing game.
   * @param story_id - The ID of the story to continue.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async continue(story_id: string) {
    return this.request<GameData>('/game/continue', {
      method: 'POST',
      body: JSON.stringify({ story_id }),
    });
  }

  /**
   * Sends a request to respond to the current game step.
   * @param story_id - The ID of the story to respond to.
   * @param choice - The player's choice.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async respond(story_id: string, choice: string) {
    return this.request<GameData>('/game/respond', {
      method: 'POST',
      body: JSON.stringify({ story_id, choice }),
    });
  }

  /**
   * Sends a request to get the TTS audio for the specified text.
   * @param story_id - The ID of the story to get the TTS audio for.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async getTTS(story_id: string) {
    return this.request<Blob>(
      `/game/tts`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id }),
      },
      'blob',
    );
  }

  /**
   * Sends a request to load the specified step of the game.
   * @param story_id - The ID of the story to load the step for.
   * @param step - The step number to load.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async loadStep(story_id: string, step: number) {
    return this.request<GameData>(`/game/load-step/${step}`, {
      method: 'POST',
      body: JSON.stringify({ story_id }),
    });
  }

  /**
   * Sends a request to load the image for the specified step of the game.
   * @param story_id - The ID of the story to load the image for.
   * @param step - The step number to load.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async loadStepImage(story_id: string, step: number) {
    return this.request<Blob>(
      `/game/load-step-image/${step}`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id }),
      },
      'blob',
    );
  }

  /**
   * Delete a story.
   * @param storyId - The ID of the story to delete.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async deleteStory(storyId: string) {
    return this.request<{ success: boolean, message: string }>(`/game/delete-story/${storyId}`, {
      method: 'DELETE',
    });
  }
}
