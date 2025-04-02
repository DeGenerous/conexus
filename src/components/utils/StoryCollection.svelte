<script lang="ts">
  import StoryTile from './StoryTile.svelte';

  export let category: CategoryInSection | null = null;
  export let section: string = '';
</script>

<section>
  {#if !category || !section}
    <p class="collection-header">Loading stories...</p>
    <div class="tiles-collection blur">
      {#each Array(7) as _}
        <div class="tile loading-tile" style="cursor: progress;">
          <div
            class="tile-picture loading-tile-picture loading-animation"
            style="cursor: inherit;"
          ></div>
          <p
            class="tile-title loading-tile-title loading-animation"
            style="cursor: inherit;"
          ></p>
        </div>
      {/each}
    </div>
  {:else}
    <p class="collection-header">{category.name}</p>
    <div class="tiles-collection blur">
      {#each category.topics as topic}
        <StoryTile {section} topicID={topic.id} topicName={topic.name} />
      {/each}
    </div>
  {/if}
</section>

<style>
  section {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: 1vw;
  }

  @media only screen and (max-width: 600px) {
    section {
      gap: 0.5em;
    }
  }
</style>
