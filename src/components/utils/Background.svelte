<script lang="ts">
  import { bgPicture } from '@stores/background.ts';
  import { onMount } from 'svelte';

  let width: number;
  let scroll: number;
  let bg: HTMLDivElement;

  onMount(() => {
    if (width > 768) $bgPicture = "url('/conexusBG.avif')";
    else $bgPicture = "url('/mobileBG.webp')";
  })

  $: if ($bgPicture && bg) bg.style.backgroundImage = $bgPicture;
</script>

<svelte:window bind:innerWidth={width} bind:scrollY={scroll} />

<div
  id="background"
  style:top={-scroll / 5 + "px"}
  bind:this={bg}
></div>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  #background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 300vh;
    background-image: url('/mobileBG.webp');
    background-attachment: scroll;
    background-repeat: repeat;
    background-position: top;
    z-index: -100;
    transition:
      opacity 0.6s linear,
      filter 0.9s ease-in-out;

    @include respond-up(small-desktop) {
      background-image: url('/conexusBG.avif');
      background-attachment: fixed;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    @starting-style {
      opacity: 0;
      filter: brightness(200%) contrast(200%);
    }
  }
</style>
