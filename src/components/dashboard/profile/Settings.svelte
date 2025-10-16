<script lang="ts">
  import {
    promptSettings,
    resetSettings,
    isPromptSettingsDefault,
    defaultPromptSettings,
    arePromptSettingsEqual,
  } from '@stores/dream.svelte';
  import { toastStore } from '@stores/toast.svelte';

  import TopicSettings from '@components/dashboard/common/TopicSettings.svelte';

  const compareSettings = $derived(() => {
    const originalSettings = defaultPromptSettings(); // TEMP: change to personal settings when available

    if (!originalSettings) return true;

    return arePromptSettingsEqual($promptSettings, originalSettings);
  });

  const saveChanges = async () => {
    await new Promise((r) => setTimeout(r, 500));
    toastStore.show('Settings saved successfully! (test)');
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
        onclick={resetSettings}
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
