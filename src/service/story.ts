import Fetcher from './fetcher';

/**
 * StoryAPI provides methods for interacting with story-related endpoints.
 *
 * This class extends Fetcher and encapsulates API calls for:
 * - Starting a new story
 * - Deleting a story
 * - Restoring story credit
 * - Continuing a story
 * - Responding to a story
 * - Text-to-Speech for a story
 * - Loading a specific step of the story
 * - Checking the status of an image generation task
 *
 * Each method returns a Promise resolving to type APIResponse containing the relevant data or error.
 */
export default class StoryAPI extends Fetcher {
  protected group: string = '/story';

  /**
   * Start a new topic story
   * @param topic_id The ID of the topic
   * @param settings The settings for the story
   * @param mode The play mode for the story, either 'play_limited' or 'play_unlimited'
   * @returns The story data and image generation task ID
   */
  async start(
    topic_id: string,
    settings: StorySettingSelector = 'topic',
    mode: PlayMode = 'play_limited',
  ) {
    return this.request<{ story: GameData; task_id: string }>(
      `${this.group}/start`,
      {
        method: 'POST',
        body: JSON.stringify({ topic_id, settings, mode }),
      },
    );
  }

  /**
   * Demo a new topic story
   * @param topic_id The ID of the topic
   * @returns The story data and image generation task ID
   */
  async demo(topic_id: string) {
    return this.request<{ story: GameData; task_id: string }>(
      `${this.group}/demo/${topic_id}`,
    );
  }

  /**
   * Delete a story
   * @param story_id The ID of the story to delete
   * @returns The deleted story
   */
  async delete(story_id: string) {
    return this.request(`${this.group}/${story_id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Restore story credit
   * @returns The response from the server
   */
  async restoreCredit() {
    return this.request(`${this.group}/credit-restore`);
  }

  /**
   * Continue a story
   * @param story_id The ID of the story to continue
   * @returns The story data and image generation task ID
   */
  async continue(story_id: string) {
    return this.request<{ story: GameData; task_id: string }>(
      `${this.group}/continue`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id }),
      },
    );
  }

  /**
   * Respond to a story
   * @param story_id The ID of the story to respond to
   * @param choice The choice made by the user
   * @returns The story data and image generation task ID
   */
  async respond(story_id: string, choice: number) {
    return this.request<{ story: GameData; task_id: string }>(
      `${this.group}/respond`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id, choice }),
      },
    );
  }

  /**
   * Text-to-Speech for a story
   * @param story_id The ID of the story
   * @returns A Blob containing the audio data
   */
  async tts(story_id: string) {
    return this.request<Blob>(
      `${this.group}/tts`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id }),
      },
      'blob',
    );
  }

  /**
   * Load a specific step of the story
   * @param story_id The ID of the story
   * @param step_id The ID of the step to load
   * @returns The step story data and image generation task ID
   */
  async step(story_id: string, step: number) {
    return this.request<{ story: GameData; task_id: string }>(
      `${this.group}/step`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id, step }),
      },
    );
  }

  /**
   * Checks the status of an image generation task
   * @param story_id The ID of the story
   * @param task_id The ID of the image generation task
   * @returns The status of the image generation task or the generated image
   */
  async imageStatus(story_id: string, task_id: string) {
    return this.request<{ status: 'pending' | 'ready'; url?: string }>(
      `${this.group}/image-status`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id, task_id }),
      },
    );
  }
}
