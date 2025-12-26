<script lang="ts">
  import { tracks } from '@constants/tracks';
  import { game } from '@stores/conexus.svelte';
  import sound from '@stores/volumes.svelte';

  let audio: HTMLAudioElement;

  const queueKey = 'queue';

  // Simple shuffle function
  const shuffle = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  $effect(() => {
    audio.volume = sound.music.muted ? 0 : sound.music.volume;
  });

  $effect(() => {
    // Set the initial audio source
    audio.src =
      game.background_music ??
      tracks[Math.floor(Math.random() * tracks.length)];

    // Handle errors
    audio.onerror = () => {
      console.error(`Failed to load background music: ${audio.src}`);

      // Retrieve or create a shuffled queue
      let queue = JSON.parse(localStorage.getItem(queueKey) ?? '[]');
      if (queue.length === 0) {
        queue = shuffle([...tracks]);
      }

      // Play the next track from the queue, or a random one if the queue is empty
      audio.src =
        queue.pop() ?? tracks[Math.floor(Math.random() * tracks.length)];

      // Update localStorage
      localStorage.setItem(queueKey, JSON.stringify(queue));
    };

    audio.loop = true;
    audio.play();
  });
</script>

<audio bind:this={audio}></audio>
