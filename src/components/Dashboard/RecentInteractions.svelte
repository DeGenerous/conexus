<script lang="ts">
  import { onMount } from 'svelte';

  let recentInteractions = [];

  async function fetchRecentInteractions() {
    // Mock API call
    recentInteractions = await fetch('/api/interactions/recent').then((res) =>
      res.json(),
    );
  }

  onMount(fetchRecentInteractions);
</script>

<div class="recent-interactions">
  <h2>Recent Interactions</h2>
  <ul>
    {#each recentInteractions as interaction}
      <li>{interaction.title} - {interaction.type}</li>
    {/each}
  </ul>
</div>

<style>
  .recent-interactions {
    padding: 1rem;
  }
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
</style>
