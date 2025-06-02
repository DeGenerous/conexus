<script lang="ts">
  import { bgPicture, bgPictureOpacity, bgColor } from '@stores/background.ts';
  import { story } from '@stores/conexus';
  import { onMount } from 'svelte';

  export let storyName: Nullable<string> = null;

  let width: number;
  let scroll: number;
  let bg: HTMLDivElement;

  onMount(() => {
    if (width > 768) $bgPicture = "url('/conexusBG.avif')";
  });

  // Back to default picture if null
  $: if ($bgPicture === null)
    $bgPicture =
      width < 768 ? "url('/mobileBG.webp')" : "url('/conexusBG.avif')";

  // Default story picture if entered story page
  $: if (storyName && bg) $bgPicture = "url('/defaultBG.avif')";

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
  <div
    id="background-color"
    style:background-color={$bgColor}
  ></div>
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
