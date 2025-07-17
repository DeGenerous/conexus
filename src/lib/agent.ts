import { api_error } from '@errors/index';
import { AgentAPI } from '@service/routes';
import { agentStory, game } from '@stores/conexus.svelte';
import openModal from '@stores/modal.svelte';
import { toastStore } from '@stores/toast.svelte';

class AgentGame extends AgentAPI {
  // Properties
  private static instance: AgentGame;

  step_data: GameData; // The data for the current step of the story.
  maxStep: number = 0; // The maximum step number of the story.

  // Constructor
  constructor(data?: GameData) {
    super(import.meta.env.PUBLIC_BACKEND);

    this.step_data = {} as GameData;
    if (data) {
      this.#setStepData(data); // ✅ Works now
    }
  }

  static getInstance(): AgentGame {
    if (!AgentGame.instance) {
      AgentGame.instance = new AgentGame();
    }
    return AgentGame.instance;
  }

  // Start New Game
  async startGame(
    story_id: number,
    temp_user_id: string,
    setMedia: (topic_id: number) => Promise<void>,
  ): Promise<void> {
    //TODO: change all story_name to topic_id
    game.loading = true;

    const { data, error } = await this.start(story_id, temp_user_id);

    if (!data) {
      if (error) {
        // if (error.message.match(ERROR_REQUIRED_TOKEN)) {
        //   const errorMessage: string[] = error.message.split('. ');
        //   const errorTitle = errorMessage[0];
        //   const nftLinks = errorMessage[1];
        //   openModal(`
        //     <h4>${errorTitle}</h4>
        //     <p>${nftLinks}</p>
        //   `);
        // } else if (error.message.match(ERROR_OUT_OF_CREDITS)) {
        //   const errorMessage: string[] = error.message.split(', ');
        //   const errorTitle = errorMessage[0];
        //   const outOfCredits = errorMessage[1];
        //   openModal(`
        //     <h4>${errorTitle}</h4>
        //     <p>${outOfCredits.charAt(0).toUpperCase() + outOfCredits.slice(1)}</p>
        //   `);
        // } else api_error(error);
      } else {
        toastStore.show('Error starting game', 'error');
      }
      game.loading = false;
      return;
    }

    game.loading = false;

    await setMedia(story_id);

    await this.#setStepData(data); // ✅ Use this instead of new instance
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

  async #setStepData(data: GameData): Promise<void> {
    this.step_data = data;
    this.maxStep = Math.max(this.maxStep, data.step);

    console.log('set step data');
    console.log('incoming step ID: ', this.step_data.id);
    console.log('returned step ID: ', data.id);
    console.log(this);

    agentStory.set(this);
    game.loading = false;

    // await Promise.all([this.#generateImage(), this.#textToSpeech()]);
  }
}

export default AgentGame;
