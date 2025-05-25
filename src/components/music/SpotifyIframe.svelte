<script>
  import { onMount } from 'svelte';

  let spotify;

  onMount(() => {
    setTimeout(() => spotify.play(), 2000);
  });
</script>

<iframe
  bind:this={spotify}
  title="Dischordian Logic"
  class="blur flex round dark-border shad"
  src="https://open.spotify.com/embed/album/33LvDG83EjPJR9wof12nWV?utm_source=generator"
  allowfullscreen=""
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  loading="lazy"
>
</iframe>

<style>
  iframe {
    width: clamp(250px, 95%, 80rem);
    height: 25rem;
  }
</style>
