import { writable } from 'svelte/store';

export const background_volume = writable<VolumeControl>({
  muted: false,
  volume: 0.1,
  restart: false,
});
export const tts_volume = writable<VolumeControl>({
  muted: false,
  volume: 1,
  restart: false,
});

export const tts_speed = writable<number>(1);
export const speed_values = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];