<script lang="ts">
  import { background_music } from '@stores/conexus';
  import { background_volume, tts_volume } from '@stores/volumes';
  import { onMount } from 'svelte';

  let audio: HTMLAudioElement;

  onMount(() => {
    background_music.subscribe((src) => {
      if (src == null) {
        return;
      }

      audio.src = src;
      audio.loop = true;
      audio.play();
    });

    background_volume.subscribe(({ muted, volume }) => {
      audio.volume = !muted ? volume : 0;
    });
  });
</script>

<audio bind:this={audio}></audio>
