import { api_error } from '@errors/index';
import AgentAPI from '@service/agent';
import { story, game } from '@stores/conexus.svelte';

/**
 * Manages an Agent story session using the agent service endpoints.
 */
export default class AgentGame {
  protected api: AgentAPI;
  step_data: GameData;
  maxStep: number = 0;
  #imageRetryDelay = 3000;

  constructor(data?: GameData, task_id?: string) {
    this.api = new AgentAPI(import.meta.env.PUBLIC_BACKEND);
    this.step_data = {} as GameData;

    if (data) {
      this.#setStepData(data, task_id);
    }
  }

  /**
   * Start a new agent story.
   */
  async start(
    topic_id: string,
    settings: StorySettingSelector = 'topic',
  ): Promise<void> {
    game.loading = true;

    const { status, message, data } = await this.api.start(topic_id, settings);

    if (status === 'error') {
      api_error(message);
      game.loading = false;
      return;
    }

    if (!data) {
      game.loading = false;
      return;
    }

    await this.#setStory(this.#normalizeStoryResponse(data));
  }

  /**
   * Submit a choice and advance the story.
   */
  async nextStep(choice: number): Promise<void> {
    game.loading = true;

    const { status, message, data } = await this.api.respond(
      this.step_data.id,
      choice,
    );

    if (status === 'error') {
      api_error(message);
      game.loading = false;
      return;
    }

    if (!data) {
      game.loading = false;
      return;
    }

    await this.#setStory(this.#normalizeStoryResponse(data));
  }

  /**
   * Load a specific step by step_id.
   */
  async loadStep(step_id: string): Promise<void> {
    game.loading = true;

    const { status, message, data } = await this.api.step(
      this.step_data.id,
      step_id,
    );

    if (status === 'error') {
      api_error(message);
      game.loading = false;
      return;
    }

    if (!data) {
      game.loading = false;
      return;
    }

    await this.#setStory(this.#normalizeStoryResponse(data));
  }

  /**
   * Delete the current story.
   */
  async delete(story_id: string): Promise<void> {
    const { status, message } = await this.api.delete(story_id);

    if (status === 'error') {
      api_error(message);
    }
  }

  /**
   * Generate a cover/description image. Mirrors Story.svelte behavior.
   */
  async getDescriptionImage(story_id: string): Promise<string | null> {
    const { status, message, data } = await this.api.generateImage(story_id);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    if (!data) return null;

    if (typeof data === 'string') {
      return this.#normalizeImage(data);
    }

    if ((data as { task_id?: string }).task_id) {
      return await this.#pollCoverStatus(
        story_id,
        (data as { task_id: string }).task_id,
      );
    }

    return null;
  }

  /**
   * Normalize API responses that may return either GameData or { story, task_id }.
   */
  #normalizeStoryResponse(
    data: GameData | { story: GameData; task_id?: string },
  ): { story: GameData; task_id: string } {
    if ((data as { story?: GameData }).story) {
      const casted = data as { story: GameData; task_id?: string };
      return { story: casted.story, task_id: casted.task_id || '' };
    }

    const casted = data as GameData & { task_id?: string };
    return { story: casted, task_id: casted.task_id || '' };
  }

  /**
   * Set the story data and kick off media preparation.
   */
  async #setStory(payload: {
    story: GameData;
    task_id: string;
  }): Promise<void> {
    await this.#setStepData(payload.story, payload.task_id);
  }

  /**
   * Update local state for the current step.
   */
  async #setStepData(data: GameData, task_id?: string): Promise<void> {
    this.step_data = data;
    this.step_data.task_id = task_id || '';
    this.maxStep = Math.max(this.maxStep, data.step);

    story.set(this as unknown as any);
    game.loading = false;

    if (task_id !== '') {
      await this.#textToSpeech();
    }

    await this.#fetchStepImage(this.step_data.id, this.step_data.step_id);
  }

  /**
   * Retrieve step image for the current step.
   */
  async #fetchStepImage(story_id: string, step_id: string): Promise<void> {
    const { status, message, data } = await this.api.stepImage(
      story_id,
      step_id,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    if (!data) return;

    this.step_data = {
      ...this.step_data,
      image: data.image,
      image_type: data.type,
    };

    story.set(this as unknown as any);
  }

  /**
   * Fetch TTS for the current step.
   */
  async #textToSpeech(): Promise<void> {
    const { status, message, data } = await this.api.tts(this.step_data.id);

    if (status === 'error') {
      api_error(message);
      game.loading = false;
      return;
    }

    if (!data) {
      game.loading = false;
      return;
    }

    this.step_data.tts = data;
    story.set(this as unknown as any);
  }

  #normalizeImage(img: string): string {
    if (img.startsWith('data:') || img.startsWith('http')) return img;
    return `data:image/jpeg;base64,${img}`;
  }

  async #pollCoverStatus(
    story_id: string,
    task_id: string,
  ): Promise<string | null> {
    const { status, message, data } = await this.api.imageStatus(
      story_id,
      task_id,
    );

    if (status === 'error') {
      api_error(message);
      return null;
    }

    if (!data) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.#imageRetryDelay),
      );
      return await this.#pollCoverStatus(story_id, task_id);
    }

    return this.#normalizeImage(data);
  }
}
