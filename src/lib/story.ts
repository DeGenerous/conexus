import { ERROR_REQUIRED_TOKEN, ERROR_OUT_OF_CREDITS } from '@constants/error';
import { api_error } from '@errors/index';
import StoryAPI from '@service/story';
import { story, game } from '@stores/conexus.svelte';
import { toastStore } from '@stores/toast.svelte';
import openModal from '@stores/modal.svelte';
import { getCurrentUser } from '@utils/route-guard';
import { formatGameTextForSpeech } from '@utils/tts';

/**
 * Orchestrates interactive story sessions and syncs game state with the backend.
 */
export default class CoNexus {
  protected api: StoryAPI;
  private static instance: CoNexus;

  step_data: GameData; // The data for the current step of the story.
  maxStep: number = 0; // The maximum step number of the story.

  /**
   * Create a new story session manager.
   * @param data - Optional initial game data to bootstrap with.
   * @param task_id - Optional task identifier for pending assets.
   */
  constructor(data?: GameData, task_id?: string, generate?: boolean) {
    this.api = new StoryAPI(import.meta.env.PUBLIC_BACKEND);

    this.step_data = {} as GameData;
    if (data) {
      this.#setStepData(data, task_id, generate); // ✅ Works now
    }
  }

  /**
   * Get or create the global CoNexus instance.
   * @returns The shared CoNexus instance.
   */
  static getInstance(): CoNexus {
    if (!CoNexus.instance) {
      CoNexus.instance = new CoNexus();
    }
    return CoNexus.instance;
  }

  /**
   * Start a new game
   * @param topic_id  The ID of the topic to start the game for
   * @param storySettings The settings for the story
   * @param mode The play mode for the story, either 'play_limited' or 'play_unlimited'
   * @param setMedia A function to set the media for the story
   * @returns {Promise<void>} A promise that resolves when the game is started
   */
  async start(
    topic_id: string,
    storySettings: StorySettingSelector = 'topic',
    mode: PlayMode = 'play_limited',
    setMedia: (topic_id: string) => Promise<void>,
  ): Promise<void> {
    game.loading = true;

    const { status, message, data } = await this.api.start(
      topic_id,
      storySettings,
      mode,
    );

    if (status === 'error' || !data) {
      game.loading = false;
      if (message.match(ERROR_REQUIRED_TOKEN)) {
        const errorMessage: string[] = message.split('. ');

        const errorTitle = errorMessage[0];
        const nftLinks = errorMessage[1];

        openModal(`
          <h4>${errorTitle}</h4>
          <p>${nftLinks}</p>
        `);
      } else if (message.match(ERROR_OUT_OF_CREDITS)) {
        const errorMessage: string[] = message.split(', ');

        const errorTitle = errorMessage[0];
        const outOfCredits = errorMessage[1];

        openModal(`
          <h4>${errorTitle}</h4>
          <p>${outOfCredits.charAt(0).toUpperCase() + outOfCredits.slice(1)}</p>
        `);
      }
      api_error(message);
      return;
    }

    setTimeout(() => getCurrentUser(true), 100);

    await setMedia(topic_id);

    game.loading = false;

    await this.#setStory(data);
  }

  /**
   * Demo a new game
   * @param topic_id  The ID of the topic to start the game for
   * @param setMedia A function to set the media for the story
   * @returns {Promise<void>} A promise that resolves when the game is started
   */
  async demo(
    topic_id: string,
    setMedia: (topic_id: string) => Promise<void>,
  ): Promise<void> {
    game.loading = true;

    const { status, message, data } = await this.api.demo(topic_id);

    if (!data) {
      if (status === 'error') {
        if (message.match(ERROR_REQUIRED_TOKEN)) {
          const errorMessage: string[] = message.split('. ');

          const errorTitle = errorMessage[0];
          const nftLinks = errorMessage[1];

          openModal(`
            <h4>${errorTitle}</h4>
            <p>${nftLinks}</p>
          `);
        } else if (message.match(ERROR_OUT_OF_CREDITS)) {
          const errorMessage: string[] = message.split(', ');

          const errorTitle = errorMessage[0];
          const outOfCredits = errorMessage[1];

          openModal(`
            <h4>${errorTitle}</h4>
            <p>${outOfCredits.charAt(0).toUpperCase() + outOfCredits.slice(1)}</p>
          `);
        }
        api_error(message);
      }

      game.loading = false;
      return;
    }

    await getCurrentUser(true);

    await setMedia(topic_id);

    game.loading = false;

    await this.#setStory(data);
  }

  /**
   * Continue a pre-existing story
   * @param continuable The story to continue
   * @param setMedia A function to set the media for the story
   * @returns A promise that resolves when the story is continued
   */
  async continue(
    continuable: ContinuableStory,
    setMedia: (topic_id: string) => Promise<void>,
  ): Promise<void> {
    game.loading = true;

    const { status, message, data } = await this.api.continue(
      continuable.story_id,
    );

    if (status === 'error') {
      this.#rollbackCredits();
      this.delete(continuable.story_id);
      api_error(message);
      game.loading = false;
      return;
    }

    if (!data) {
      game.loading = false;
      return;
    }

    await getCurrentUser(true);

    // Set background image and music
    await setMedia(continuable.topic_id);

    game.loading = false;
    await this.#setStory(data);
  }

  /**
   * Submit a choice for the current game step and advance the story.
   * @param choice - The option index selected by the player.
   */
  async nextStep(choice: number): Promise<void> {
    game.loading = true;

    // Start new game
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

    game.loading = false;
    await this.#setStory(data);
  }

  /**
   * Load a specific step of the story
   * @param step_id The ID of the step to load
   * @returns A promise that resolves when the step is loaded
   */
  async loadStep(step: number): Promise<void> {
    game.loading = true;
    const { status, message, data } = await this.api.step(
      this.step_data.id,
      step,
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

    game.loading = false;
    await this.#setStory(data); // TODO: Change to this after save to backend, await this.#setStepData(data.story);
  }

  async #storeStepImage(image_url: string): Promise<void> {
    const { status, message } = await this.api.storeStepImage(
      this.step_data.id,
      this.step_data.step,
      image_url,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    // toastStore.show(message || 'Step image stored', 'info');
  }

  /**
   * Delete a story
   * @param story_id The ID of the story to delete
   */
  async delete(story_id: string): Promise<void> {
    const { status, message } = await this.api.delete(story_id);

    if (status === 'error') {
      api_error(message);
    }

    toastStore.show(message || 'Story deleted', 'info');
  }

  /**
   * Generate image status
   * @param task_id The ID of the image generation task
   * @returns A promise that resolves when the image status is generated
   */
  async #generateImageStatus(task_id: string): Promise<void> {
    const { status, message, data } = await this.api.imageStatus(
      this.step_data.id,
      task_id,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    if (!data) {
      return;
    }

    // check data.status
    if (data.status === 'pending') {
      // Wait 5 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await this.#generateImageStatus(task_id);
      return;
    }

    if (data.status === 'ready') {
      const url = `${import.meta.env.PUBLIC_BACKEND}${data.url}`;

      this.#commitStepData({ image: url, image_type: 'url' });
      return;
    }
  }

  async #imageGenInternal(): Promise<void> {
    let prompt = this.step_data.image_prompt || this.step_data.story;

    const input: ImageGenerationInput = {
      text: prompt,
      option: 'fallback',
      providerNameOrCtx: 'auto',
    };

    const res = await fetch(`/ai/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      game.loading = false;
      let errorDetail = '';
      try {
        const errorBody = await res.json();
        errorDetail = errorBody?.message || JSON.stringify(errorBody);
      } catch (e) {
        try {
          errorDetail = await res.text();
        } catch {
          errorDetail = '';
        }
      }
      return Promise.reject(
        `Image generation failed (status: ${res.status})${errorDetail ? `: ${errorDetail}` : ''}`,
      );
    }

    const response = (await res.json()) as ImageResult;

    this.#commitStepData({
      image: response.data,
      image_type: response.imageType,
    });

    // Store image data in step_data
    await this.#storeStepImage(response.data);
  }

  async #fetchTTSFromClientAI(
    delivery: string = 'default',
    voiceId: string = '9BWtsMINqrJLrRacOk9x',
  ): Promise<Blob> {
    let text = formatGameTextForSpeech(this.step_data);

    const input: DialogueInput = {
      text,
      option: 'fallback',
      providerNameOrOpts: {
        voice: voiceId,
      },
    };

    const res = await fetch(`/ai/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      game.loading = false;
      let errorDetail = '';
      try {
        const errorBody = await res.json();
        errorDetail = errorBody?.message || JSON.stringify(errorBody);
      } catch (e) {
        try {
          errorDetail = await res.text();
        } catch {
          errorDetail = '';
        }
      }
      throw new Error(
        `TTS failed (status: ${res.status})${errorDetail ? `: ${errorDetail}` : ''}`,
      );
    }

    return await res.blob();
  }

  async #fetchTTSFromServerAI(): Promise<Blob> {
    const { status, message, data } = await this.api.tts(this.step_data.id);

    if (status === 'error') {
      api_error(message);
      game.loading = false;
      throw new Error('TTS fetch failed');
    }

    if (!data) {
      game.loading = false;
      throw new Error('No TTS data received');
    }

    return data;
  }

  /**
   * Convert text to speech
   * @returns A promise that resolves when the TTS is ready
   */
  async #ttsInternal(which: 'client' | 'server' = 'client'): Promise<void> {
    switch (which) {
      case 'client':
        const clientResult = await this.#fetchTTSFromClientAI();
        this.#commitStepData({ tts: clientResult });
        return;
      default:
        const serverResult = await this.#fetchTTSFromServerAI();
        this.#commitStepData({ tts: serverResult });
        return;
    }
  }

  /* Helper */

  #commitStepData(patch: Partial<GameData>) {
    this.step_data = {
      ...this.step_data,
      ...patch,
    };
    story.set(this);
  }

  /**
   * Set the story data and the task id
   * @param data The story data and task id to set
   */
  async #setStory(data: {
    story: GameData;
    task_id: string;
    generate: boolean;
  }): Promise<void> {
    await this.#setStepData(data.story, data.task_id, data.generate);

    if (data.generate) {
      // await Promise.allSettled([this.#imageGenInternal(), this.#ttsInternal()]);
      const results = await Promise.allSettled([
        this.#imageGenInternal(),
        this.#ttsInternal(),
      ]);
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          console.error(
            `Error in ${idx === 0 ? 'image generation' : 'TTS'}:`,
            result.reason,
          );
          toastStore.show(
            `Failed to generate ${idx === 0 ? 'image' : 'audio'} for this step.`,
            'error',
          );
        }
      });
    }

    if (!data.generate && data.task_id && data.task_id !== '') {
      await this.#generateImageStatus(data.task_id);
    }
  }

  /**
   * Update local state for the currently active step and trigger media preparation.
   * @param data - The step data returned from the API.
   * @param task_id - Optional task identifier for pending assets.
   */
  async #setStepData(
    data: GameData,
    task_id?: string,
    generate?: boolean,
  ): Promise<void> {
    this.step_data = data;
    this.step_data.task_id = generate ? crypto.randomUUID() : task_id || '';
    this.maxStep = Math.max(this.maxStep, data.step);

    console.log('set step data');
    console.log('incoming step ID: ', this.step_data.id);
    console.log('returned step ID: ', data.id);

    story.set(this);
    game.loading = false;
  }

  /**
   * Restore credits when a story continuation fails.
   */
  async #rollbackCredits(): Promise<void> {
    const { status, message } = await this.api.restoreCredit();

    if (status === 'error') {
      api_error(message);
      return;
    }

    // return to topic page
    // window.location.href = `/topic/${topic_id}`; // TODO: Change to topic page
    window.location.reload();

    toastStore.show(message || 'Credits rolled back', 'info');
  }
}
