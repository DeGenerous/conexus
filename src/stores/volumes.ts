import type { Writable } from 'svelte/store';
import { storable } from '@lib/storable';

export const background_volume: Writable<VolumeControl> = storable(
  'background_volume',
  { muted: false, volume: 0.5, restart: false },
);
export const tts_volume: Writable<VolumeControl> = storable('tts_volume', {
  muted: false,
  volume: 0.5,
  restart: false,
});
