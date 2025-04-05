<script lang="ts">
  import StoryTile from '@components/utils/StoryTile.svelte';

  const storySections: string[] = ['Top Stories', 'Most Played', 'Most Liked'];
  let currentSection = 0;

  function changeStorySection() {
    currentSection = (currentSection + 1) % storySections.length;
  }
</script>

<section class="container blur">
  <div class="buttons-wrapper">
    <div class="collection-header">
      <p>Story Metrics:</p>
    </div>
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

  <div class="tiles-collection">
  </div>
</section>

<style>
  .container {
    width: 100vw;
    padding-inline: 0;
    border-radius: 0;
  }

  .tiles-collection {
    background-image: none;
    background-color: rgba(22, 30, 95, 0.75);
  }
</style>
