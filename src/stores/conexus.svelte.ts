import { writable } from 'svelte/store';
import CoNexusGame from '@lib/story';

// Root gameplay stores shared by the reader experience (current game instance + UI state)
export const story = writable<Nullable<CoNexusGame>>(null);

export const game = $state<{
  loading: boolean;
  background_music: Nullable<string>;
  background_image: Nullable<string>;
  fullscreen: boolean;
}>({
  loading: false,
  background_music: null,
  background_image: null,
  fullscreen: false,
});
