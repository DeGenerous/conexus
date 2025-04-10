<script lang="ts">
  import { onMount } from 'svelte';

  import { Account } from '@lib/account';
  import StoryTile from '@components/utils/StoryTile.svelte';

  type Story = {
    title: string;
  };

  onMount(fetchData);

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
</script>

<div class="collection-header">
  <p>Stories Played Last Week</p>
</div>
<div class="tiles-collection blur"></div>

<div class="collection-header">
  <p>Top Performing Stories</p>
</div>
<div class="tiles-collection blur"></div>
