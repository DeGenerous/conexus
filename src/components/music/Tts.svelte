<script lang="ts">
  import { story, game } from '@stores/conexus.svelte';
  import sound from '@stores/volumes.svelte';

  let audio: HTMLAudioElement;

  let last_tts: Blob | null = null;
  let tts: Blob | null = null;

  const stepTTS = $derived.by<Blob>(() => $story?.step_data?.tts!);

  $effect(() => {
    if (stepTTS && last_tts !== stepTTS) {
      audio.src = window.URL.createObjectURL(stepTTS);
      audio.play();
      tts = stepTTS;
      last_tts = stepTTS;
    }
  });

  $effect(() => {
    if (sound.voice.volume) setVolume();
  });

  $effect(() => {
    if (sound.tts_speed) adjustTtsSpeed();
  });

  $effect(() => {
    if (sound.voice.restart) {
      if (tts) {
        audio.src = window.URL.createObjectURL(tts);
        audio.play();
        adjustTtsSpeed();
      }
      sound.voice.restart = false;
    }
  });

  const setVolume = () =>
    (audio.volume = sound.voice.muted ? 0 : sound.voice.volume);

  const adjustTtsSpeed = () => {
    audio.playbackRate = sound.tts_speed;
  };
</script>

<audio bind:this={audio}></audio>
