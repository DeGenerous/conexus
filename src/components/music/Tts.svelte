<script lang="ts">
  import { story, ttsProvider } from '@stores/conexus.svelte';
  import sound from '@stores/volumes.svelte';
  import { ttsService } from '@utils/ai/tts/service';

  let audio: HTMLAudioElement;

  let last_tts: Blob | null = null;
  let tts: Blob | null = null;

  const storyGame = $derived.by(() => $story);
  const stepTTS = $derived.by<Blob>(() => $story?.step_data?.tts!);

  $effect(() => {
    if (!storyGame || !storyGame.step_data) return;

    if (ttsProvider === 'elevenlabs') {
      ttsService.generateTTS(storyGame.step_data).then((blob) => {
        if (blob && last_tts !== blob) {
          audio.src = window.URL.createObjectURL(blob);
          audio.play();
          tts = blob;
          last_tts = blob;
        }
      });
    } else {
      if (stepTTS && last_tts !== stepTTS) {
        audio.src = window.URL.createObjectURL(stepTTS);
        audio.play();
        tts = stepTTS;
        last_tts = stepTTS;
      }
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
