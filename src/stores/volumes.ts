import { writable } from 'svelte/store';

export const background_volume = writable<VolumeControl>({
  muted: false,
  volume: 0.1,
  restart: false
});
export const tts_volume = writable<VolumeControl>({
  muted: false,
  volume: 1,
  restart: false,
});
