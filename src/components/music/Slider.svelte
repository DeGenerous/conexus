<script lang="ts">
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { tts_speed, speed_values } from '@stores/volumes';
  import VoiceSVG from '@components/icons/Voice.svelte';
  import MusicSVG from '@components/icons/Music.svelte';
  import RestartSVG from '@components/icons/Restart.svelte';

  export let type: 'voice' | 'music';
  export let volume: Writable<VolumeControl>;
  export let restartable: boolean = false;

  $: inputValue = !$volume.muted ? $volume.volume : 0;

  onMount(() => {
    if (localStorage.getItem(`${type}-volume`)) {
      const volumeValue = JSON.parse(
        localStorage.getItem(`${type}-volume`) as string,
      );
      $volume = volumeValue;
      if (type === 'voice') {
        voiceMuted = $volume.muted;
        const storedTtsSpeed = localStorage.getItem('tts-speed');
        if (storedTtsSpeed) $tts_speed = Number(storedTtsSpeed);
      } else if (type === 'music') {
        volumeMuted = $volume.muted;
      }
    }
  });

  const mute = () => {
    volume.update((v) => {
      if (type === 'voice') {
        voiceMuted = !v.muted;
      } else if (type === 'music') {
        volumeMuted = !v.muted;
      }
      return { ...v, muted: !v.muted };
    });
    localStorage.setItem(`${type}-volume`, JSON.stringify($volume));
  };

  const update = () => {
    volume.set({
      muted: false,
      volume: inputValue,
      restart: false,
    });
    localStorage.setItem(`${type}-volume`, JSON.stringify($volume));
  };

  const restart = () => {
    volume.update((v) => ({ ...v, restart: true }));
  };

  const adjustTtsSpeed = () => {
    const speedIndex = speed_values.indexOf($tts_speed);
    $tts_speed = speed_values[(speedIndex + 1) % speed_values.length];
  };

  // SVG Icons
  let voiceMuted: boolean = false;
  let volumeMuted: boolean = false;

  $: disabledInput =
    type === 'voice'
      ? voiceMuted
        ? true
        : false
      : type === 'music'
        ? volumeMuted
          ? true
          : false
        : true;
</script>

<div class="transparent-container">
  {#if type === 'voice'}
    <VoiceSVG {voiceMuted} onClick={mute} />
  {:else if type === 'music'}
    <MusicSVG {volumeMuted} onClick={mute} />
  {/if}

  <span class="flex-row pad-8 round-8 gap-8 dark-glowing shad-inset">
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={inputValue}
      on:change={update}
      disabled={disabledInput}
    />
    <p>{inputValue * 100}%</p>
  </span>

  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  {#if restartable}
    <RestartSVG {voiceMuted} onClick={restart} />

    <span class="voice-speed flex-row gap-8">
      <button
        id="voice-speed"
        class="void-btn min-size-btn flex-row pad-8 round-8 dark-glowing shad-inset"
        on:click={adjustTtsSpeed}
      >
        <p>SPEED</p>
        x{$tts_speed.toFixed(2)}
      </button>
    </span>
  {/if}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    flex-flow: row wrap;
    width: unset !important;
    margin-inline: unset !important;

    .voice-speed {
      button {
        width: auto !important;
        @include white-txt;
        @include font(h4);

        &:hover,
        &:active,
        &:focus {
          @include cyan(1, text);
        }

        @include respond-up(tablet) {
          @include white-txt;
          @include font(h5);
        }
      }
    }

    @include respond-up(tablet) {
      padding: 0.5rem 1.5rem !important;
      gap: 0.5rem 1.5rem;
    }
  }
</style>
