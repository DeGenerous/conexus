import { writable } from 'svelte/store';
import { GetCache, VOLUME_KEY, TTS_SPEED_KEY } from '@constants/cache';

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

export const muted = writable<{ voice: boolean; music: boolean }>({
  voice: false,
  music: true,
});

// Initialize from cache if available (for early access before Slider mounts)
// Wrap in browser check to avoid SSR errors
const isBrowser = typeof window !== 'undefined';
const cachedVoice = isBrowser
  ? GetCache<VolumeControl>(VOLUME_KEY('voice'))
  : null;
const cachedMusic = isBrowser
  ? GetCache<VolumeControl>(VOLUME_KEY('music'))
  : null;
const cachedTtsSpeed = isBrowser ? GetCache<number>(TTS_SPEED_KEY) : null;

const sound = $state<{
  music: VolumeControl;
  voice: VolumeControl;
  tts_speed: number;
}>({
  music: cachedMusic ?? {
    muted: false,
    volume: 0.1,
    restart: false,
  },
  voice: cachedVoice ?? {
    muted: false,
    volume: 1,
    restart: false,
  },
  tts_speed: cachedTtsSpeed ?? 1,
});

export default sound;
