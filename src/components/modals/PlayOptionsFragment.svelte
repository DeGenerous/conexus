<script lang="ts">
  import { modal } from '@lib/modal-manager.svelte';
  import { getPersonalSetup, setPersonalSetup } from '@stores/account.svelte';
  import { isGuest } from '@stores/account.svelte';

  let {
    onPlay,
    onCancel,
  }: {
    onPlay: (dontShowAgain: boolean) => void;
    onCancel?: () => void;
  } = $props();

  const setup = getPersonalSetup();
  let preferredSettings = $state<SettingMode>(setup?.settings || 'default');
  let playMode = $state<PlayMode>(setup?.play_mode || 'play_unlimited');
  let dontShowAgain = $state(false);

  function handlePlay() {
    setPersonalSetup({
      settings: preferredSettings,
      play_mode: playMode,
    });
    onPlay(dontShowAgain);
  }
</script>

<div
  class="modal-content"
  onclick={(e) => e.stopPropagation()}
  role="presentation"
>
  <div class="flex flex-col gap-md items-center">
    <div class="text-center flex flex-col gap-md">
      <h2 id="modal-title" class="text-h3">Play options</h2>
      <p>
        These choices are also
        <a class="link" href="/">in your profile.</a>
        Changes apply immediately.
      </p>
    </div>

    <div
      class="surface-sunk p-md flex flex-col gap-md large-desktop:w-full large-desktop:grid large-desktop:grid-cols-2 transparent-container"
    >
      <div class="flex flex-col items-center gap-md">
        <label class="setting-label">
          SETTINGS: {preferredSettings === 'personal'
            ? 'Use your profile settings'
            : "Use the author's settings"}
          <select bind:value={preferredSettings}>
            <option value="personal">Personal</option>
            <option value="default">Author's Default</option>
          </select>
        </label>
      </div>

      <hr class="large-desktop:hidden" />

      <div class="flex flex-col items-center gap-md">
        <label class="setting-label">
          PLAY MODE: {playMode === 'play_limited'
            ? 'No images or audio'
            : 'Images and audio on each step'}
          <select bind:value={playMode}>
            <option value="play_limited">Text-only</option>
            {#if !$isGuest}
              <option value="play_unlimited">With Media</option>
            {/if}
          </select>
        </label>
      </div>
    </div>

    <label class="flex flex-row items-center gap-xs gap-8">
      <input type="checkbox" bind:checked={dontShowAgain} />
      Don't show this again
    </label>
  </div>

  <div class="flex flex-row justify-center gap-md">
    <button class="btn-alert red-btn" onclick={() => modal.close()}>
      Cancel
    </button>
    <button class="btn-cta cta" onclick={handlePlay}>
      {playMode === 'play_limited' ? 'Play: 1 credit' : 'Play: 3 credits'}
    </button>
  </div>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .surface-sunk {
    @include respond-up(large-desktop) {
      flex-direction: row;

      hr {
        display: none;
      }

      div {
        width: 100%;
      }
    }
  }

  .setting-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    @include font(caption);
  }

  .btn-alert,
  .btn-cta {
    cursor: pointer;
  }
</style>
