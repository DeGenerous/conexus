import Fetcher from '../fetcher';

/**
 * AgentAPI provides methods for interacting with agent-related endpoints.
 *
 * This class extends the Fetcher base class to provide a set of methods for
 * managing agents, including creating, updating, and deleting agents.
 * - Create a new agent
 * - Get the agent manager data
 * - Add a category to an agent
 * - Remove a category from an agent
 * - Add a genre to an agent
 * - Remove a genre from an agent
 * - Add a gate to an agent
 * - Remove a gate from an agent
 * - Upload a file to an agent
 * - Delete a file from an agent
 *
 * Each method returns a Promise resolving to type APIResponse containing the relevant data or error.
 */
export default class AgentAPI extends Fetcher {
  protected group: string = '/agent/story';

  /**
   * Start a new agent story
   * @param topic_id The ID of the topic
   * @param settings The settings for the agent
   * @returns The story data
   */
  async start(topic_id: string, settings: StorySettingSelector = 'topic') {
    return this.request<GameData>(`${this.group}/start`, {
      method: 'POST',
      body: JSON.stringify({ topic_id, settings }),
    });
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
   * Respond to a story
   * @param story_id The ID of the story to respond to
   * @param choice The choice made by the user
   * @returns The story data
   */
  async respond(story_id: string, choice: number) {
    return this.request<GameData>(`${this.group}/respond`, {
      method: 'POST',
      body: JSON.stringify({ story_id, choice }),
    });
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
   * @returns The step story data
   */
  async step(story_id: string, step_id: string) {
    return this.request<GameData>(`${this.group}/step`, {
      method: 'POST',
      body: JSON.stringify({ story_id, step_id }),
    });
  }

  /**
   * Load a specific step image of the story
   * @param story_id The ID of the story
   * @param step_id The ID of the step to load
   * @returns The step image data
   */
  async stepImage(story_id: string, step_id: string) {
    return this.request<{ image: string; type: ImageType }>(
      `${this.group}/step/image`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id, step_id }),
      },
    );
  }

  /**
   * Generate an image for a specific story
   * @param story_id The ID of the story
   * @returns The base64 string of the generated image or a task ID
   */
  async generateImage(story_id: string) {
    return this.request<string | { task_id: ImageType }>(
      `${this.group}/generate-image`,
      {
        method: 'POST',
        body: JSON.stringify({ story_id }),
      },
    );
  }

  /**
   * Checks the status of an image generation task
   * @param story_id The ID of the story
   * @param task_id The ID of the image generation task
   * @returns The base64 string of the generated image
   */
  async imageStatus(story_id: string, task_id: string) {
    return this.request<string | undefined>(`${this.group}/image-status`, {
      method: 'POST',
      body: JSON.stringify({ story_id, task_id }),
    });
  }
}
