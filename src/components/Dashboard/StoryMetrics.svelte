<script lang="ts">
  import StoryTile from '@components/utils/StoryTile.svelte';

  const storySections: string[] = ['Top Stories', 'Most Played', 'Most Liked'];
  let currentSection = 0;

  function changeStorySection() {
    currentSection = (currentSection + 1) % storySections.length;
  }
</script>

<div class="buttons-wrapper">
  <p class="collection-header">Story Metrics:</p>
  <select
    class="selector blur"
    value={currentSection}
    on:change={changeStorySection}
  >
    {#each storySections as section, i}
      <option value={i}>{section}</option>
    {/each}
  </select>
</div>

<div class="tiles-collection blur">
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
