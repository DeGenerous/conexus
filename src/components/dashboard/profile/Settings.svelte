<script lang="ts">
  import Account from '@lib/account';
  import {
    promptSettings,
    resetSettings,
    isPromptSettingsDefault,
    defaultPromptSettings,
    arePromptSettingsEqual,
  } from '@stores/dream.svelte';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';

  import TopicSettings from '@components/dashboard/common/TopicSettings.svelte';
  import { onMount } from 'svelte';

  const account: Account = new Account();

  onMount(async () => {
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

<h3>Personal Story Settings</h3>

<p>
  Make stories fit you. Set tone, pace, difficulty, content filters, and
  continuity.
</p>

<TopicSettings>
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
        Save Changes
      </button>
    </span>
  {/snippet}
</TopicSettings>
