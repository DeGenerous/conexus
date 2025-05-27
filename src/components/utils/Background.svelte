<script lang="ts">
  import { bgPicture } from '@stores/background.ts';
  import { onMount } from 'svelte';

  let width: number;
  let scroll: number;

  onMount(() => {
    if (width > 768) $bgPicture = "url('/conexusBG.avif')";
  })
</script>

<svelte:window bind:innerWidth={width} bind:scrollY={scroll} />

<div
  id="background"
  style:top={-scroll / 5 + "px"}
  style:background-image={$bgPicture}
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

    @include respond-up(small-desktop) {
      background-image: url('/conexusBG.avif');
      background-attachment: fixed;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
</style>
