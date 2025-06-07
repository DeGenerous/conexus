<script lang="ts">
  import { onMount } from 'svelte';

  import { bgPicture, bgPictureOpacity, bgColor } from '@stores/background.ts';
  import { story, game } from '@stores/conexus.svelte';
  import { pcBG, mobileBG, defaultBG } from '@constants/media';

  export let storyName: Nullable<string> = null;

  let width: number;
  let scroll: number;
  let bg: HTMLDivElement;

  const cssURL = (imageLink: string): Nullable<string> =>
    imageLink ? `url('${imageLink}')` : null;

  onMount(() => {
    if (width > 768) $bgPicture = cssURL(pcBG);
  });

  // Back to default picture if null
  $: if ($bgPicture === null)
    $bgPicture = width < 768 ? cssURL(mobileBG) : cssURL(pcBG);

  // Default story picture when entered story page
  $: if (storyName && bg) $bgPicture = cssURL(defaultBG);

  // Set to uploaded story background if it is
  $: if (game.background_image)
    $bgPicture = cssURL(game.background_image);

  // Reactive update of background-image on $bgPicture change
  $: if ($bgPicture && bg) bg.style.backgroundImage = $bgPicture;
</script>

<svelte:window bind:innerWidth={width} bind:scrollY={scroll} />

<div
  id="background-image"
  style:top={`max(-${scroll / 100}vh, -100vh)`}
  style:opacity={storyName ? String($bgPictureOpacity / 100) : '1'}
  bind:this={bg}
></div>

{#if $story}
  <div id="background-color" style:background-color={$bgColor}></div>
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
      background-size: cover;
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
