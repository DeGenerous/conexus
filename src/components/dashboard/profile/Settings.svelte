<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import {
    promptSettings,
    resetSettings,
    isPromptSettingsDefault,
    defaultPromptSettings,
    arePromptSettingsEqual,
  } from '@stores/dream.svelte';
  import { GetCache, SetCache, PERSONAL_SETUP_KEY } from '@constants/cache';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';

  import Dropdown from '@components/utils/Dropdown.svelte';
  import TopicSettings from '@components/dashboard/common/TopicSettings.svelte';
  import ThemeSettings from '@components/utils/ThemeSettings.svelte';
  import StylingController from '@components/utils/StylingController.svelte';

  const account: Account = new Account();

  let preferredSettings = $state<'personal' | 'default'>('personal');
  let preferredTheme = $state<'personal' | 'default'>('personal');

  const setPersonalSetup = () =>
    SetCache(PERSONAL_SETUP_KEY, {
      settings: preferredSettings,
      theme: preferredTheme,
    });

  onMount(async () => {
    const cachedSetup = GetCache<PreferredSetup>(PERSONAL_SETUP_KEY);
    if (cachedSetup) {
      preferredSettings = cachedSetup.settings;
      preferredTheme = cachedSetup.theme;
    }

    const settings = await account.getPromptSettings();
    if (settings) {
      promptSettings.set(settings);
    }
  });

  const compareSettings = $derived(() => {
    const originalSettings = defaultPromptSettings(); // TEMP: change to personal settings when available
    if (!originalSettings) return true;

    return arePromptSettingsEqual($promptSettings, originalSettings);
  });

  const saveChanges = async () => {
    await account.createOrUpdatePromptSettings($promptSettings);
  };

  const resetPromptSettings = () => {
    openModal(ensureMessage('reset your personal settings'), 'Reset', () => {
      resetSettings();
      saveChanges();
    });
  };
</script>

<h3>Personal Settings & Theme</h3>

<p>
  Make stories fit you. Set styling, tone, pace, difficulty, content filters,
  and continuity.
</p>

<section class="preferred-setup dream-container">
  <div class="flex-row">
    <h4>Preferred Settings</h4>
    <div class="container">
      <span class="flex-row">
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredTheme === 'personal'}
          onclick={() => {
            preferredTheme = 'personal';
            setPersonalSetup();
          }}
        >
          Personal
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredTheme === 'default'}
          onclick={() => {
            preferredTheme = 'default';
            setPersonalSetup();
          }}
        >
          Default
        </button>
      </span>
      <p>
        {#if preferredTheme === 'personal'}
          Use your profile’s settings, overriding the story’s defaults.
        {:else}
          Play with author defaults, personal preferences will not be applied.
        {/if}
      </p>
    </div>
  </div>

  <div class="flex-row">
    <h4>Preferred Theme</h4>
    <div class="container">
      <span class="flex-row">
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredSettings === 'personal'}
          onclick={() => (preferredSettings = 'personal')}
        >
          Personal
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredSettings === 'default'}
          onclick={() => (preferredSettings = 'default')}
        >
          Default
        </button>
      </span>
      <p>
        {#if preferredSettings === 'personal'}
          Apply your saved theme (colors, fonts, spacing) to all stories you
          play until you switch back.
        {:else}
          Apply the author’s default theme to all stories you play until you
          switch back.
        {/if}
      </p>
    </div>
  </div>
</section>

<Dropdown name="Personal Settings" table={true}>
  <TopicSettings nostyling={true}>
    {#snippet children()}
      <span class="flex-row flex-wrap">
        <button
          class="red-btn"
          onclick={resetPromptSettings}
          disabled={isPromptSettingsDefault($promptSettings)}
        >
          Reset to Default
        </button>
        <button
          class="green-btn"
          onclick={saveChanges}
          disabled={compareSettings()}
        >
          Save Settings
        </button>
      </span>
    {/snippet}
  </TopicSettings>
</Dropdown>

<StylingController />

<ThemeSettings />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .preferred-setup {
    animation: none;
    @include navy;
  }

  .container {
    flex-direction: column;

    span {
      width: 100%;
      justify-content: space-around;
    }

    p {
      @include white-txt(0.5);
      @include font(caption);
    }
  }
</style>
