<script lang="ts">
  let scroll: number;
</script>

<svelte:window bind:scrollY={scroll} />

<div id="background" style:top={-scroll / 5 + "px"}></div>

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
