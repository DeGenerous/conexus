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

<!-- {#await Account.getUser()}
  <h2>Loading...</h2>
{:then user: Nullable<User>} -->
<p class="collection-header">Stories Played Last Week</p>
<div class="tiles-collection blur">
  <!-- {#each storiesPlayedLastWeek as story}<li>{story.title}</li>{/each} -->
  <!-- examples -->
  <StoryTile
    section="Community Picks"
    topicName="Sherlock Holmes: The Infinite Case"
  />
  <StoryTile section="Community Picks" topicName="Peter Pan" />
  <StoryTile section="Community Picks" topicName="Ragnarok" />
  <StoryTile section="Community Picks" topicName="The Unveiling" />
  <StoryTile
    section="Community Picks"
    topicName="From Stadiums to Battlefields"
  />
  <StoryTile section="Community Picks" topicName="Hard Exit" />
</div>

<p class="collection-header">Top Performing Stories</p>
<div class="tiles-collection blur">
  <!-- {#each topPerformingStories as story}<li>{story.title}</li>{/each} -->
  <!-- examples -->
  <StoryTile section="Community Picks" topicName="Swipe Right, Fall Hard" />
  <StoryTile section="Dischordian Saga" topicName="Escape" />
  <StoryTile section="Community Picks" topicName="Random" />
  <StoryTile section="Community Picks" topicName="Dracula Awakening" />
  <StoryTile section="Community Picks" topicName="Treasure Planet" />
  <StoryTile
    section="Community Picks"
    topicName="The Immortal King: Quest of Gilgamesh"
  />
  <StoryTile section="Community Picks" topicName="Adam and Eve" />
  <StoryTile section="Community Picks" topicName="Bros & Beers" />
</div>
<!-- {/await} -->
