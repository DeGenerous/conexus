<script lang="ts">
  import { story } from '@stores/conexus';
  import { tts_volume, tts_speed } from '@stores/volumes';

  let audio: HTMLAudioElement;

  let last_tts: Blob | null = null;
  let tts: Blob | null = null;

  $: step = $story?.step_data as StepData;

  $: if (step && step.tts && last_tts !== step.tts) {
    audio.src = window.URL.createObjectURL(step.tts);
    audio.play();
    tts = step.tts;
    last_tts = step.tts;
  }

  $: if (audio && $tts_volume) setVolume();
  $: if (audio && $tts_speed) adjustTtsSpeed();

  $: if ($tts_volume.restart) {
    if (tts) {
      audio.src = window.URL.createObjectURL(tts);
      audio.play();
      adjustTtsSpeed();
    }
    $tts_volume.restart = false;
  }

  const setVolume = () =>
    (audio.volume = $tts_volume.muted ? 0 : $tts_volume.volume);
  
  const adjustTtsSpeed = () => {
    audio.playbackRate = $tts_speed;
    localStorage.setItem('tts-speed', $tts_speed.toString());
  }
</script>

<audio bind:this={audio}></audio>
