import { ERROR_REQUIRED_TOKEN, ERROR_OUT_OF_CREDITS } from '@constants/error';
import { api_error } from '@errors/index';
import { Account } from '@lib/account';
import { GameAPI } from '@service/routes';
import { story, game }  from '@stores/conexus.svelte';
import { toastStore } from '@stores/toast';
import { showModal, modalContent } from '@stores/modal';

export let storyTitle: string;

export class CoNexusGame extends GameAPI {
  // Properties
  private static instance: CoNexusGame;

  step_data: GameData; // The data for the current step of the story.
  maxStep: number = 0; // The maximum step number of the story.

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

  // TODO: change to topic_id later
  async getTopic(section: string, topic: string): Promise<TopicThumbnail> {
    const { data, error } = await this.topicByName(section, topic);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching topic', 'error');
      }
      throw new Error('Error fetching topic');
    }

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
    game.loading = true;

    const { data, error } = await this.start(story_name, topic_id);

    if (!data) {
      if (error) {
        if (error.message.match(ERROR_REQUIRED_TOKEN)) {
          const errorMessage: string[] = error.message.split('. ');

          const errorTitle = errorMessage[0];
          const nftLinks = errorMessage[1];

          modalContent.set(`
            <h4>${errorTitle}</h4>
            <p>${nftLinks}</p>
          `);
          showModal.set(true);
        } else if (error.message.match(ERROR_OUT_OF_CREDITS)) {
          const errorMessage: string[] = error.message.split(', ');

          const errorTitle = errorMessage[0];
          const outOfCredits = errorMessage[1];

          modalContent.set(`
            <h4>${errorTitle}</h4>
            <p>${outOfCredits.charAt(0).toUpperCase() + outOfCredits.slice(1)}</p>
          `);
          showModal.set(true);
        } else api_error(error);
      } else {
        toastStore.show('Error starting game', 'error');
      }
      game.loading = false;
      return;
    }

    // refresh user
    await Account.getUser();

    storyTitle = story_name;

    await setMedia(topic_id);

    await this.#setStepData(data); // ✅ Use this instead of new instance
  }

  // Continue pre-existing game
  async continueGame(
    continuable: ContinuableStory,
    setMedia: (topic_id: number) => Promise<void>,
  ): Promise<void> {
    game.loading = true;

    // Start new game
    const { data, error } = await this.continue(continuable.story_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error continuing game', 'error');
      }
      game.loading = false;
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
    game.loading = true;

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

    console.log('step is loaded')
    console.log(this)

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

    console.log('loaded step image (#loadGameStepImage)')
    console.log(this)

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

    console.log('image is ready (#image)')
    console.log(this)

    story.set(this);
  }

  // Generate image for current step v2
  async #generateImage(): Promise<void> {
    try {
      const { data } = await this.imageV2(this.step_data.id);

      if (!data) {
        this.#image();
        return;
      }

      if ('job_id' in data) {
        // wait 3 seconds before checking status
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await this.#generateImageStatus(data.job_id);
      }

      if ('image' in data) {
        this.step_data.image = data.image;
        this.step_data.image_type = data.type;

        console.log('image is generated (#generateImage)')
        console.log(this)

        story.set(this);
      }
    } catch (error) {
      console.error('Error in #generateImage:', error);
      this.#image();
    }
  }

  // Generate image status v2
  async #generateImageStatus(job_id: string): Promise<void> {
    try {
      const { data } = await this.imageStatusV2(this.step_data.id, job_id);

      if (!data) {
        this.#image();
        return;
      }

      if (data.status === 'pending') {
        // Wait 5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await this.#generateImageStatus(job_id);
        return;
      }

      if (data.status === 'ready') {
        this.step_data.image = data.image;
        this.step_data.image_type = data.type;

        console.log('image status is generated (#generateImageStatus)')
        console.log(this)

        story.set(this);
        return;
      }

      this.#image();
    } catch (error) {
      console.error('Error in #generateImageStatus:', error);
      this.#image();
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

    console.log('tts is ready')
    console.log(this)

    this.step_data.tts = data;
    story.set(this);
  }

  /* Helper */

  async #setStepData(data: GameData): Promise<void> {
    this.step_data = data;
    this.maxStep = Math.max(this.maxStep, data.step);

    console.log('set step data')
    console.log(this)

    story.set(this);
    game.loading = false;

    await Promise.all([this.#generateImage(), this.#textToSpeech()]);
  }
}
