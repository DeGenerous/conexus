<script lang="ts">
  import {
    GetCache,
    SetCache,
    ONE_YEAR_TTL,
    VOLUME_KEY,
    TTS_SPEED_KEY,
  } from '@constants/cache';
  import sound, { speed_values } from '@stores/volumes.svelte';

  import VoiceSVG from '@components/icons/Voice.svelte';
  import MusicSVG from '@components/icons/Music.svelte';
  import RestartSVG from '@components/icons/Restart.svelte';

  let { type }: { type: 'voice' | 'music' } = $props();

  let allMuted: boolean = false; // to handle mute with 'M' key

  let inputValue = $derived<number>(
    !sound[type].muted ? sound[type].volume : 0,
  );
  let disabledInput = $derived<boolean>(sound[type].muted);

  $effect(() => {
    const storedValue = GetCache<VolumeControl>(VOLUME_KEY(type));
    if (storedValue) {
      sound[type] = storedValue;

      const storedTtsSpeed = GetCache(TTS_SPEED_KEY);
      if (storedTtsSpeed) sound.tts_speed = Number(storedTtsSpeed);
    }
  });

  const mute = () => {
    sound[type].muted = !sound[type].muted;
    SetCache(VOLUME_KEY(type), sound[type], ONE_YEAR_TTL);
  };

  // Toggle mute for both volumes with 'M' key
  const muteWithKey = (event: KeyboardEvent) => {
    if (event.repeat) return;
    if (event.key !== 'm') return;
    sound[type].muted = allMuted ? false : true;
    allMuted = !allMuted;
    SetCache(VOLUME_KEY(type), sound[type], ONE_YEAR_TTL);
  };

  const update = () => {
    sound[type] = {
      muted: false,
      volume: inputValue,
      restart: false,
    };
    SetCache(VOLUME_KEY(type), sound[type], ONE_YEAR_TTL);
  };

  const restart = () => {
    sound[type].restart = true;
  };

  const adjustTtsSpeed = () => {
    const speedIndex = speed_values.indexOf(sound.tts_speed);
    sound.tts_speed = speed_values[(speedIndex + 1) % speed_values.length];
    SetCache(TTS_SPEED_KEY, sound.tts_speed, ONE_YEAR_TTL);
  };
</script>

<svelte:window on:keydown={muteWithKey} />

<div class="transparent-container">
  {#if type === 'voice'}
    <VoiceSVG muted={disabledInput} onClick={mute} />
  {:else if type === 'music'}
    <MusicSVG muted={disabledInput} onClick={mute} />
  {/if}

  <span class="flex-row pad-8 round-8 gap-8 dark-glowing shad-inset">
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={inputValue}
      onchange={update}
      disabled={disabledInput}
    />
    <p>{(inputValue * 100).toFixed()}%</p>
  </span>

  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  {#if type === 'voice'}
    <RestartSVG disabled={disabledInput} onClick={restart} />

    <span class="voice-speed flex-row gap-8">
      <button
        id="voice-speed"
        class="void-btn min-size-btn flex-row pad-8 round-8 dark-glowing shad-inset"
        onclick={adjustTtsSpeed}
        disabled={disabledInput}
      >
        <p>SPEED</p>
        x{sound.tts_speed.toFixed(2)}
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

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          @include cyan(1, text);
        }

        &:disabled {
          opacity: 0.5;
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
