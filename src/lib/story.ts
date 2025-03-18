import {
  GetCache,
  SetCache,
  TOPICS_CACHE_KEY,
  TOPICS_CACHE_TTL,
} from '@constants/cache';
import { api_error } from '@errors/index';
import { GameAPI } from '@service/routes';
import { loading, story } from '@stores/conexus';
import { toastStore } from '@stores/toast';

export let storyTitle: string;

export class CoNexusGame extends GameAPI {
  // Properties
  private static instance: CoNexusGame;

  step_data: GameData; // The data for the current step of the story.
  maxStep: number = 0; // The maximum step number of the story.

  hasFetched = false; // Whether the story has been fetched.
  jobID: string; // The ID of the job (Image) that is currently running.

  interval: NodeJS.Timer | null = null; // The interval for checking the status of the job.

  // Constructor
  constructor(data?: GameData) {
    super(import.meta.env.PUBLIC_BACKEND);

    // this.#id = id;
    this.step_data = {} as GameData;
    if (data) {
      this.#setStepData(data); // ✅ Works now
    }
  }

  static getInstance(): CoNexusGame {
    if (!CoNexusGame.instance) {
      CoNexusGame.instance = new CoNexusGame();
    }
    return CoNexusGame.instance;
  }

  async getTopic(topic: string): Promise<ThumbnailTopic> {
    const KEY = `${TOPICS_CACHE_KEY}_${topic}`
    // TODO: change to topic_id later

    const cachedData = GetCache<ThumbnailTopic>(KEY);
    if (cachedData) {
      return cachedData;
    }

    const { data, error } = await this.topicByName(topic);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching topic', 'error');
      }
      throw new Error('Error fetching topic');
    }

    SetCache(KEY, data, TOPICS_CACHE_TTL);

    return data;
  }

  async storyContinuables(topic: string): Promise<ContinuableStory[]> {
    const { data, error } = await this.continuablesByTopic(topic);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async delete(story_id: string): Promise<void> {
    const { data, error } = await this.deleteStory(story_id);

    if (error) {
      api_error(error);
    }

    toastStore.show(data?.message || 'Story deleted', 'info');
  }

  /* GAME */

  // Start New Game
  async startGame(
    story_name: string,
    topic_id: number,
    setMedia: (topic_id: number) => Promise<void>,
  ): Promise<void> {
    //TODO: change all story_name to topic_id
    loading.set(true);

    const { data, error } = await this.start(story_name);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error starting game', 'error');
      }
      return;
    }

    storyTitle = story_name;

    await setMedia(topic_id);

    await this.#setStepData(data); // ✅ Use this instead of new instance
  }

  // Continue pre-existing game
  async continueGame(
    continuable: ContinuableStory,
    setMedia: (topic_id: number) => Promise<void>,
  ): Promise<void> {
    loading.set(true);

    // Start new game
    const { data, error } = await this.continue(continuable.story_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error continuing game', 'error');
      }
      return;
    }

    storyTitle = continuable.category;

    // Set background image and music
    await setMedia(continuable.topic_id);

    // Set step data
    await this.#setStepData(data);
  }

  // Respond to the current game step
  async nextStep(choice: number): Promise<void> {
    // set store loading to true
    loading.set(true);

    // Start new game
    const { data, error } = await this.respond(this.step_data.id, choice);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error playing game', 'error');
      }
      return;
    }

    // Set step data
    await this.#setStepData(data);
  }

  // Load the specified step of the game
  async loadGameStep(step: number): Promise<void> {
    const { data, error } = await this.loadStep(this.step_data.id, step);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error loading game step', 'error');
      }
      return;
    }

    this.step_data = data;
    story.set(this);

    await this.#loadGameStepImage(step);
  }

  /* Media */

  // Load the specified step image
  async #loadGameStepImage(step: number): Promise<void> {
    const { data, error } = await this.loadStepImage(this.step_data.id, step);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error loading game step image', 'error');
      }
      return;
    }

    this.step_data.image = data.image;
    this.step_data.image_type = data.type;

    story.set(this);
  }

  // Generate image for current step v1
  async #image(): Promise<void> {
    const { data, error } = await this.image(this.step_data.id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error getting image', 'error');
      }
      return;
    }

    this.step_data.image = data.image;
    this.step_data.image_type = data.type;

    story.set(this);
  }

  // Generate image for current step v2
  async #generateImage(): Promise<void> {
    const { data, error } = await this.imageV2(this.step_data.id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error getting image', 'error');
      }
      return;
    }

    if ('job_id' in data) {
      this.jobID = data.job_id;
      this.hasFetched = true;
      this.#start_interval();
    }

    if ('image' in data) {
      this.step_data.image = data.image;
      this.step_data.image_type = data.type;

      story.set(this);
    }
  }

  // Generate image status v2
  async #generateImageStatus(): Promise<void> {
    try {
      const { data } = await this.imageStatusV2(this.step_data.id, this.jobID);

      if (!data) {
        this.#image();
        this.#clear_interval();
        return;
      }

      if (data.status === 'ready') {
        this.step_data.image = data.image;
        this.step_data.image_type = data.type;

        story.set(this);
        this.#clear_interval();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.hasFetched = false;
      }, 5000); // Adjust the delay as needed
    }
  }

  // Text to speech
  async #textToSpeech(): Promise<void> {
    const { data, error } = await this.getTTS(this.step_data.id);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return;
    }

    this.step_data.tts = data;
    story.set(this);
  }

  /* Helper */

  #start_interval() {
    this.interval = setInterval(async () => {
      await this.#generateImageStatus();
    }, 10000);
  }

  #clear_interval() {
    if (this.interval) {
      clearInterval(this.interval as NodeJS.Timeout);
      this.interval = null;
    }
  }

  async #setStepData(data: GameData): Promise<void> {
    this.step_data = data;
    this.maxStep = Math.max(this.maxStep, data.step);

    story.set(this);
    loading.set(false);

    await Promise.all([this.#generateImage(), this.#textToSpeech()]);
  }
}
