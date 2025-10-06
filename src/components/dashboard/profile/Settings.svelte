<script lang="ts">
  import { resetSettings } from '@stores/dream.svelte';
  import { toastStore } from '@stores/toast.svelte';

  import TopicSettings from '@components/dashboard/common/TopicSettings.svelte';

  const saveChanges = async () => {
    await new Promise((r) => setTimeout(r, 500));
    toastStore.show('Settings saved successfully! (test)');
  };
</script>

<h2>Personal Story Settings</h2>

<TopicSettings>
  {#snippet children()}
    <div class="flex-row flex-wrap">
      <button class="red-btn" onclick={resetSettings}>
        Reset to Default
      </button>
      <button class="green-btn" onclick={saveChanges}> Save Changes </button>
    </div>
  {/snippet}
</TopicSettings>

<style>
  .flex-row {
    justify-content: center;
  }
</style>
