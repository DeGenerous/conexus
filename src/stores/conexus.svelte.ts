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

// Global reactive background settings used by Step.svelte to style the play view
export const conexusBG = $state<ConexusBG>({
  opacity: 50,
  color: '#000000',
});

export const ttsProvider = $state<'elevenlabs' | 'degenai'>('degenai');
export const imageProvider = $state<'luma' | 'dalle' | 'fal'>('fal');
