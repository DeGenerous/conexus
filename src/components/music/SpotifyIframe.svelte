<script>
  import { onMount } from "svelte";

  let spotify;

  onMount(() => {
    setTimeout(() => (spotify.play()), 2000)
  })
</script>

<iframe
  bind:this={spotify}
  title="Dischordian Logic"
  class="blur"
  src="https://open.spotify.com/embed/album/33LvDG83EjPJR9wof12nWV?utm_source=generator"
  allowfullscreen=""
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  loading="lazy">
</iframe>

<style>
  iframe {
    width: 95vw;
    height: 25vw;
    border-radius: 1.5vw;
    background-color: rgba(51, 226, 230, 0.1);
    box-shadow: 0 0.25vw 0.25vw #010020;
  }

  @media only screen and (max-width: 600px) {
    iframe {
      width: 95%;
      height: auto;
      min-height: 9.5em;
      border-radius: 0;
      background-color: transparent;
      box-shadow: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }
</style>
