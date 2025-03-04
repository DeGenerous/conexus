<script lang="ts">
  import StoryTile from '@components/utils/StoryTile.svelte';

  const storySections: string[] = ['Top Stories', 'Most Played', 'Most Liked'];
  let currentSection = 0;

  function changeStorySection() {
    currentSection = (currentSection + 1) % storySections.length;
  }
</script>

<h2>Story Metrics</h2>

<div class="container">
  <div class="input-container">
    <label class="selector-label">
      Sort by:
      <select
        class="selector"
        value={currentSection}
        on:change={changeStorySection}
      >
        {#each storySections as section, i}
          <option value={i}>{section}</option>
        {/each}
      </select>
    </label>
  </div>
  <!-- examples -->
  <ul>
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
  </ul>
</div>

<style>
  .container {
    width: 95vw;
    padding-bottom: 0;
    gap: 0;
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
