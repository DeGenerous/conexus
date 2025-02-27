<script lang="ts">
  import { onMount } from 'svelte';

  import { authenticated } from '@stores/account';

  type Story = {
    title: string;
  };

  let user = $authenticated.user;
  let storiesPlayedLastWeek = [] as Story[];
  let topPerformingStories = [] as Story[];
  let isLoading = true;

  async function fetchData() {
    isLoading = true;
    [storiesPlayedLastWeek, topPerformingStories] = await Promise.all([
      fetch('/api/stories/played/last-week').then((res) => res.json()),
      fetch('/api/stories/top-performing').then((res) => res.json()),
    ]);
    isLoading = false;
  }

  onMount(fetchData);
</script>

<div class="info-container">
  <h2>Welcome, {user?.first_name}!</h2>
  {#if isLoading}
    <p>Loading metrics...</p>
  {:else}
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Stories Played Last Week</h3>
        <ul>
          {#each storiesPlayedLastWeek as story}<li>{story.title}</li>{/each}
        </ul>
      </div>
      <div class="metric-card">
        <h3>Top Performing Stories</h3>
        <ul>
          {#each topPerformingStories as story}<li>{story.title}</li>{/each}
        </ul>
      </div>
    </div>
  {/if}
</div>

<style>
  .info-container {
    padding: 1.5rem;
  }
  .metrics-grid {
    display: flex;
    gap: 1rem;
  }
  .metric-card {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
  }
</style>
