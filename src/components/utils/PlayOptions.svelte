<script lang="ts">
  import { onMount } from 'svelte';

  import { getPersonalSetup, setPersonalSetup } from '@stores/account.svelte';
  import { modal, playOptions } from '@stores/modal.svelte';

  let preferredSettings = $state<SettingMode>('default');
  // let preferredTheme = $state<SettingMode>('default');
  let playMode = $state<PlayMode>('play_unlimited');

  let dontShowAgain = $state<boolean>(false);

  const updatePersonalSetup = () =>
    setPersonalSetup({
      settings: preferredSettings,
      // theme: preferredTheme,
      play_mode: playMode,
    });

  $effect(() => {
    modal.button =
      playMode === 'play_limited' ? 'Play: 1 credit' : 'Play: 3 credits';
  });

  $effect(() => {
    if (dontShowAgain) {
      $playOptions = 'dont_show_again';
    } else {
      $playOptions = true;
    }
  });

  onMount(async () => {
    const cachedSetup = getPersonalSetup();
    if (cachedSetup) {
      preferredSettings = cachedSetup.settings || 'default';
      // preferredTheme = cachedSetup.theme || 'default';
      playMode = cachedSetup.play_mode || 'play_unlimited';
    } else updatePersonalSetup();
  });
</script>

<section class="flex">
  <h4>Play options</h4>
  <p>
    These choices are also
    <a href="/dashboard#/profile/settings" target="_self"> in your profile. </a>
    Changes apply immediately.
  </p>

  <div class="transparent-container">
    <div class="flex-row flex-wrap">
      <h5>Settings</h5>
      <select bind:value={preferredSettings}>
        <option value="personal">Personal</option>
        <option value="default">Default</option>
      </select>
      <p>
        {#if preferredSettings === 'personal'}
          Use your profile settings.
        {:else}
          Use the author’s settings.
        {/if}
      </p>
    </div>

    <hr />

    <div class="flex-row flex-wrap">
      <h5>Play Mode</h5>
      <select bind:value={playMode}>
        <option value="play_limited">Text-only</option>
        <option value="play_unlimited">With Media</option>
      </select>
      <p>
        {#if playMode === 'play_limited'}
          No images or audio.
        {:else}
          Images and audio on each step.
        {/if}
      </p>
    </div>
  </div>

  <span class="flex-row gap-8">
    <input type="checkbox" bind:checked={dontShowAgain} id="dont-show-again" />
    <label for="dont-show-again">Don't show this again</label>
  </span>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    .transparent-container {
      width: 100%;
      align-items: flex-start;

      div {
        gap: 1rem;

        h5 {
          &::after {
            content: ':';
          }
        }
      }
    }
  }
</style>
