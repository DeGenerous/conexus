import { new_error } from './errors';
import {
  background_music,
  background_image,
  story,
  loading,
} from '@stores/conexus';

const url = import.meta.env.PUBLIC_BACKEND;

const baseURL = import.meta.env.PUBLIC_BACKEND_URL;

export type Topic = {
  name: string;
  available: boolean;
};

export type Category = {
  name: string;
  topics: Topic[];
};

export type ContinuableStory = {
  story_id: string;
  category: string;
  created?: string;
};

type Available = {
  available: number;
  used: number;
  bonus: number;
  continuable: ContinuableStory[];
  categories: Category[];
};

export type StepData = {
  step: number;
  story: string;
  end: boolean;
  summary: string;
  trait: string;
  options: string[];
  image?: string;
  choice?: number;
  tts?: Blob;
};

export type DynSectionCategory = {
  name: string;
  topics: { name: string; available: boolean }[];
};

export type DynTopic = {
  name: string;
  image_prompt?: string;
  description?: string;
};

export type DynSection = {
  name: string;
  tile_image1: string;
  tile_image2: string;
};

export type GameData = {
  id: string;
} & StepData;

const tracks = [
  '/music/coNexus/track01.mp3',
  '/music/coNexus/track02.mp3',
  '/music/coNexus/track03.mp3',
];

const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export let storyTitle: string;

export class CoNexus {
  step_data: StepData;
  readonly #id: string;
  hasFetched = false;
  jobID = null;
  interval: NodeJS.Timer | null = null;
  maxStep: number = 0;

  private constructor(id: string) {
    this.#id = id;
    this.step_data = {} as StepData;
  }

  static async sections(): Promise<DynSection[]> {
    const response = await fetch(`${url}/sections`);

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    const resp = await response.json();

    return await resp.sections;
  }

  static async sectionCategories(
    section: string,
  ): Promise<DynSectionCategory[]> {
    const base = `${baseURL}/sections/${section}`;

    const response = await fetch(base);

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    const resp = await response.json();

    return resp.categories;
  }

  static async getTopic(name: string): Promise<DynTopic> {
    // const base = `${url}/topic/${name}`;
    const base = `${baseURL}/topics/${name}`;

    const response = await fetch(base);

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    const resp = await response.json();

    const topic = resp.topic;

    return await topic;
  }

  static async available(): Promise<Available> {
    const response = await fetch(`${url}/available`, {
      method: 'POST',
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    const available: Available = await response.json();

    available.continuable ??= [];

    return available;
  }

  static async start(category: string): Promise<CoNexus> {
    console.log('Starting story:', category);
    CoNexus.#play_music(category);
    CoNexus.#background_image(category);
    loading.set(true);

    const response = await fetch(`${url}/start`, {
      body: JSON.stringify({
        category: category,
      }),
      method: 'POST',
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    const game_data: GameData = await response.json();

    const story = new CoNexus(game_data.id);
    await story.#set(game_data);

    return story;
  }

  static async continue(continuable: ContinuableStory): Promise<CoNexus> {
    const story_id = continuable.story_id;
    const category = continuable.category;

    CoNexus.#play_music(category);
    CoNexus.#background_image(category);

    const response = await fetch(`${url}/continue`, {
      body: JSON.stringify({ story_id }),
      method: 'POST',
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    const game_data: GameData = await response.json();

    const story = new CoNexus(game_data.id);
    await story.#set(game_data);

    return story;
  }

  async loadStep(step: number) {
    const story_id = this.#id;

    const response = await fetch(`${url}/step/${step}`, {
      body: JSON.stringify({ story_id }),
      method: 'POST',
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    const game_data: GameData = await response.json();

    this.step_data = game_data;

    story.set(this);
    loading.set(false);

    await this.#loadStepImage(step);
  }

  async #loadStepImage(step: number) {
    const story_id = this.#id;

    const response = await fetch(`${url}/step-image/${step}`, {
      body: JSON.stringify({ story_id }),
      method: 'POST',
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    this.step_data.image = await response.text();

    story.set(this);
    loading.set(false);
  }

  static async delete(story_id: string) {
    const response = await fetch(`${url}/story/${story_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }
  }

  static #formatFileName(category: string): string {
    let fileName = category.toLowerCase();
    let formattedFileName = fileName.replace(/[\s.\-\/]+/g, '');

    storyTitle = category;

    return formattedFileName;
  }

  static async fetchRandomMusicUrl(category: string) {
    const formattedFileName = CoNexus.#formatFileName(category);

    const folderURL = `/conexus-categories/music/${formattedFileName}`;

    const response = await fetch(folderURL);

    if (!response.ok) {
      return null;
    }

    const files = await response.json();

    if (Array.isArray(files) && files.length > 0) {
      let randomFile = files[Math.floor(Math.random() * files.length)];
      let url = `${folderURL}/${randomFile.name}`;

      return url;
    }

    return null;
  }

  static async #play_music(category?: string) {
    let queue: string[] = JSON.parse(localStorage.getItem('queue') ?? '[]');
    let categoryTrackURL: string | null = null;

    if (category) {
      categoryTrackURL = await CoNexus.fetchRandomMusicUrl(category);
      if (categoryTrackURL) {
        const categoryFileExists = await fetch(categoryTrackURL).then(
          (res) => res.ok,
        );

        if (categoryFileExists) {
          background_music.set(categoryTrackURL);
          return;
        }
      }
    }

    if (queue.length === 0) {
      queue = shuffle([...tracks]);
    }

    background_music.set(queue.pop());

    localStorage.setItem('queue', JSON.stringify(queue));
  }

  static #isValidImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

  static async #background_image(category: string) {
    let formattedFileName = CoNexus.#formatFileName(category);
    let folderUrl = `/conexus-categories/images/${formattedFileName}`;

    // Fetch the list of files in the folder (assuming you have a server-side endpoint that returns this)
    let response = await fetch(folderUrl);
    let files = await response.json();

    if (Array.isArray(files) && files.length > 0) {
      // Randomly pick a file from the list
      let randomFile = files[Math.floor(Math.random() * files.length)];
      let url = `${folderUrl}/${randomFile.name}`;

      let valid = await CoNexus.#isValidImageUrl(url);
      if (valid) {
        background_image.set(url);
      }
    }
  }

  async next_step(choice: number) {
    loading.set(true);

    const response = await fetch(`${url}/respond`, {
      method: 'POST',
      body: JSON.stringify({
        story_id: this.#id,
        choice,
      }),
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    await this.#set(await response.json());
  }

  async #check_image_status() {
    try {
      const response = await fetch(`${url}/new-image-status/${this.jobID}`);

      const data = await response.json();

      if (data.status === 'error') {
        this.#clear_interval();
        return;
      }

      if (data.status === 'ready') {
        this.step_data.image = data.image;
        // this.loading.set(false);
        story.set(this);
        loading.set(false);
        this.#clear_interval();
      }
    } catch (error) {
      console.error('Failed to check image status:', error);
    } finally {
      setTimeout(() => {
        this.hasFetched = false;
      }, 5000); // Adjust the delay as needed
    }
  }

  #start_interval() {
    this.interval = setInterval(async () => {
      await this.#check_image_status();
    }, 10000);
  }

  #clear_interval() {
    if (this.interval) {
      clearInterval(this.interval as NodeJS.Timeout);
      this.interval = null;
    }
  }

  async #new_generate_image() {
    try {
      const response = await fetch(`${url}/new-image`, {
        method: 'POST',
        body: JSON.stringify({ story_id: this.#id }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      this.jobID = data.jobID;
      this.hasFetched = true;
      this.#start_interval();
    } catch (error) {
      console.error('Image generation failed:', error);
    }
  }

  async #generate_image() {
    const response = await fetch(`${url}/image`, {
      method: 'POST',
      body: JSON.stringify({ story_id: this.#id }),
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    this.step_data.image = await response.text();

    story.set(this);
    loading.set(false);
  }

  async #tts() {
    const response = await fetch(`${url}/tts`, {
      method: 'POST',
      body: JSON.stringify({ story_id: this.#id }),
    });

    if (!response.ok) {
      new_error({ code: response.status, error: await response.text() });
    }

    this.step_data.tts = await response.blob();

    story.set(this);
  }

  async #set(data: StepData) {
    this.step_data = data;
    this.maxStep = data.step;

    story.set(this);
    loading.set(false);

    await Promise.all([this.#new_generate_image(), this.#tts()]);
  }
}
