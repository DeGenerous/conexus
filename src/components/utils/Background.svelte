<script lang="ts">
  import conexusBG from '@stores/background.svelte';
  import { story, game } from '@stores/conexus.svelte';
  import { pcBG, mobileBG } from '@constants/media';

  let width = $state<number>(0);
  let scroll = $state<number>(0);

  let bg: HTMLDivElement;
  let lastBG: string | null = null;

  const cssURL = (imageLink: string): string => `url('${imageLink}')`;
  const renderBG = (image: string) => (bg.style.backgroundImage = image);

  const setBG = (imageLink: Nullable<string>) => {
    const formatted = imageLink
      ? cssURL(imageLink)
      : width < 768
        ? cssURL(mobileBG)
        : cssURL(pcBG);

    // Stop the $effect loop if same as last
    if (lastBG === formatted) return;

    lastBG = formatted;
    renderBG(formatted);
  };

  // Check stored BG value, set default if null
  $effect(() => setBG(game.background_image));
</script>

<svelte:window bind:innerWidth={width} bind:scrollY={scroll} />

<div
  id="background-image"
  style:top={`max(-${scroll / 100}vh, -100vh)`}
  style:opacity={$story ? String(conexusBG.opacity / 100) : '1'}
  bind:this={bg}
></div>

{#if $story}
  <div id="background-color" style:background-color={conexusBG.color}></div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  #background-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 200vh;
    background-image: url('/mobileBG.webp');
    background-attachment: scroll;
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    z-index: -100;
    transition:
      opacity 0.6s linear,
      filter 0.9s ease-in-out;

    // Fallback if no support
    opacity: 1;
    filter: none;

    @include respond-up(small-desktop) {
      background-attachment: fixed;
      background-position: center;
      background-image: url('/conexusBG.avif');
    }

    @starting-style {
      opacity: 0;
      filter: brightness(125%) contrast(150%);
    }
  }

  #background-color {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -200;
    transition: background-color 0.15s linear;
  }
</style>
