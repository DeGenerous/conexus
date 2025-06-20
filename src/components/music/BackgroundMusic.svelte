<script lang="ts">
  import { game } from '@stores/conexus.svelte';
  import sound from '@stores/volumes.svelte';

  let audio: HTMLAudioElement;

  $effect(() => {
    audio.volume = sound.music.muted ? 0 : sound.music.volume;
  });

  $effect(() => {
    audio.src = game.background_music!;
    audio.loop = true;
    audio.play();
  });
</script>

<audio bind:this={audio}></audio>
