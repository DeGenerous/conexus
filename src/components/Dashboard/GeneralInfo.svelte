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

{#await Account.getUser()}
  <h2>Loading...</h2>
{:then user: Nullable<User>}
  <h2>Welcome, {user?.first_name}!</h2>
  
  <div class="container">
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

  <div class="container">
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
  .container {
    width: 95vw;
    padding-bottom: 0;
    gap: 0;
  }

  .container h3 {
    color: rgba(51, 226, 230, 0.9);
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

  @media only screen and (max-width: 600px) {
    .container {
      width: 100vw;
      border-radius: 0;
    }

    ul {
      gap: 1em;
      padding: 1em;
    }
  }
</style>
