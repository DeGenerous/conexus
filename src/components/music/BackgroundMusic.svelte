<script lang="ts">
  import { onMount } from 'svelte';

  import { background_music } from '@stores/conexus';
  import { background_volume } from '@stores/volumes';

  let audio: HTMLAudioElement;

  $: if (audio && $background_volume) setVolume();

  onMount(() => {
    audio.src = $background_music!;
    audio.loop = true;
    audio.play();
  });

  const setVolume = () =>
    (audio.volume = $background_volume.muted ? 0 : $background_volume.volume);
</script>

<audio bind:this={audio}></audio>
