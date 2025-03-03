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

{#await Account.getUser() then user: Nullable<User>}
  <h2>Welcome, {user?.first_name}!</h2>
  
  <div class="metric-card container">
    <h3>Stories Played Last Week</h3>
    <ul>
      {#each storiesPlayedLastWeek as story}<li>{story.title}</li>{/each}
      <!-- examples -->
      <StoryTile section="Community Picks" topicName="Sherlock Holmes: The Infinite Case" />
      <StoryTile section="Community Picks" topicName="Peter Pan" />
      <StoryTile section="Community Picks" topicName="Ragnarok" />
      <StoryTile section="Community Picks" topicName="The Unveiling" />
      <StoryTile section="Community Picks" topicName="From Stadiums to Battlefields" />
      <StoryTile section="Community Picks" topicName="Hard Exit" />
    </ul>
  </div>

  <div class="metric-card container">
    <h3>Top Performing Stories</h3>
    <ul>
      {#each topPerformingStories as story}<li>{story.title}</li>{/each}
      <!-- examples -->
      <StoryTile section="Community Picks" topicName="Swipe Right, Fall Hard" />
      <StoryTile section="Dischordian Saga" topicName="Escape" />
      <StoryTile section="Community Picks" topicName="Random" />
      <StoryTile section="Community Picks" topicName="Dracula Awakening" />
      <StoryTile section="Community Picks" topicName="Treasure Planet" />
      <StoryTile section="Community Picks" topicName="The Immortal King: Quest of Gilgamesh" />
      <StoryTile section="Community Picks" topicName="Adam and Eve" />
      <StoryTile section="Community Picks" topicName="Bros & Beers" />
    </ul>
  </div>
{/await}

<style>
  .metric-card {
    width: 90vw;
    padding-bottom: 0;
  }

  ul {
    width: inherit;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    overflow-x: scroll;
    gap: 1vw;
    padding: 2vw;
  }
</style>
