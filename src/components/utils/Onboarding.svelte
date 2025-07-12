<script lang="ts">
  import { onMount } from 'svelte';

  let skip = $state<boolean>(false);

  onMount(() => {
    setTimeout(() => {
      skip = true;
    }, 1500);
  });
</script>

<div class="fade-in"></div>

<p class="fade-in" class:skip>Activate CoNexus: Press play</p>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 999;
    transform: none !important;
  }

  p {
    display: none;
    width: 100vw;
    position: fixed;
    bottom: 3rem;
    text-transform: uppercase;
    z-index: 1000;
    @include cyan(1, text);
    @include font(small);

    &.skip {
      display: block;
    }
  }
</style>
