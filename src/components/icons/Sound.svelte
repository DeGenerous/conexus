<script lang="ts">
  import sound from '@stores/volumes.svelte';

  let {
    onclick = () => {},
    active = false,
  }: {
    onclick: () => void;
    active: boolean;
  } = $props();
</script>

<button
  id="sound"
  class="void-btn flex"
  class:active
  {onclick}
  aria-label="Back"
>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    {#if sound.voice.muted && sound.music.muted}
      <path
        d="M16,14.5l5-5m-5,0,5,5M7,9H4a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H7l4,4V5Z"
      />
    {:else if sound.voice.muted || sound.music.muted}
      <path
        d="M15.54,16.54a1,1,0,0,1-.71-.3,1,1,0,0,1,0-1.41,4,4,0,0,0,0-5.66,1,1,0,0,1,1.41-1.41,6,6,0,0,1,0,8.48A1,1,0,0,1,15.54,16.54Z"
        stroke="none"
      />
    {:else}
      <path
        d="M18.36,19.36a1,1,0,0,1-.7-.29,1,1,0,0,1,0-1.41,8,8,0,0,0,0-11.32,1,1,0,0,1,1.41-1.41,10,10,0,0,1,0,14.14A1,1,0,0,1,18.36,19.36Z"
        stroke="none"
      />
      <path
        d="M15.54,16.54a1,1,0,0,1-.71-.3,1,1,0,0,1,0-1.41,4,4,0,0,0,0-5.66,1,1,0,0,1,1.41-1.41,6,6,0,0,1,0,8.48A1,1,0,0,1,15.54,16.54Z"
        stroke="none"
      />
    {/if}
    <path
      d="M11.38,4.08a1,1,0,0,0-1.09.21L6.59,8H4a2,2,0,0,0-2,2v4a2,2,0,0,0,2,2H6.59l3.7,3.71A1,1,0,0,0,11,20a.84.84,0,0,0,.38-.08A1,1,0,0,0,12,19V5A1,1,0,0,0,11.38,4.08Z"
    />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    width: 2rem;
    fill: $light-blue;
    stroke: $light-blue;

    &.active {
      fill: $cyan !important;
      stroke: $cyan !important;
    }

    &:hover,
    &:focus-visible,
    &:active {
      fill: $cyan;
      stroke: $cyan;
      @include scale;
    }
  }
</style>
