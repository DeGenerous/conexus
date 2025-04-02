<script lang="ts">
  import { onMount } from 'svelte';

  import { checkUserState } from '@utils/route-guard';
  import GeneralInfo from './dashboard/GeneralInfo.svelte';
  import StoryMetrics from './dashboard/StoryMetrics.svelte';

  let loading = true;

  onMount(async () => {
    await checkUserState('/dashboard', true);
    loading = false;
  });
</script>

{#if loading}
  <img class="loading-icon" src="/icons/loading.png" alt="Loading" />
{:else}
  <section class="container-wrapper">
    <GeneralInfo />

    <StoryMetrics />
  </section>
{/if}
