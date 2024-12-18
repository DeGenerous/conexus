<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { VolumeControl } from '@stores/types';

  export let src: string;
  export let volume: Writable<VolumeControl>;

  export let restartable: boolean = false;

  $: v = !$volume.muted ? $volume.volume : 0;

  const mute = () => {
    volume.update((v) => ({ ...v, muted: !v.muted }));
  };

  const update = (e: Event) => {
    const target = e.target as HTMLInputElement;

    volume.set({ muted: false, volume: +target.value, restart: false });
  };

  const restart = () => {
    volume.update((v) => ({ ...v, restart: true }));
  };
</script>

<div>
  <button on:click={mute}>
    <img {src} alt="Adjust volume" />
  </button>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={v}
    on:change={update}
  />
  {#if restartable}
    <button on:click={restart}>
      <img src="/icons/replay.png" alt="Adjust volume" />
    </button>
  {/if}
</div>

<style>
  div {
    height: 3.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5vw 1vw;
    gap: 1vw;
    background-color: rgba(1, 0, 32, 0.5);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1em;
  }

  button {
    height: 1.5vw;
    width: 1.5vw;
    padding: 0;
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }

  input {
    cursor: pointer;
    height: 0.5vw;
    width: 7.5vw;
  }

  @media screen and (max-width: 600px) {
    div {
      height: 2em;
      padding: 0.25em 0.5em;
      border-radius: 0.5em;
      gap: 0.5em;
    }

    button {
      height: 1em;
      width: 1em;
    }

    input {
      height: 1vw;
      width: 26vw;
    }
  }

  @media screen and (min-width: 1920px) {
    div {
      height: 3.5rem;
      padding: 0.5rem 1rem;
    }

    button {
      height: 1.5rem;
      width: 1.5rem;
    }

    input {
      width: 10rem;
    }
  }
</style>
