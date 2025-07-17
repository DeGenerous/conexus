import { writable } from 'svelte/store';

import type AgentGame from '@lib/agent';
import CoNexusGame from '@lib/story';

export const story = writable<Nullable<CoNexusGame>>(null);
export const agentStory = writable<Nullable<AgentGame>>(null);

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
