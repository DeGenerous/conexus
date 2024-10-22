<script lang="ts">
  import type { DynSectionCategory } from '@lib/conexus';
  import StoryTile from '@components/StoryTile.svelte';

  export let categories: DynSectionCategory[] | undefined;

  const tempTitleImage1: string = '/titlePicture/DischordianSaga/Escape1.avif';
  const tempTitleImage2: string = '/titlePicture/DischordianSaga/Escape2.avif';
</script>

<div class="topics-container">
  {#if categories}
    {#each categories as cat}
      <h1>{cat.name}</h1>
      {#each cat.topics as topic}
        <StoryTile
          topicName={topic.name}
          primaryThumbnail={tempTitleImage1}
          secondaryThumbnail={tempTitleImage2}
        />
      {/each}
    {/each}
  {:else}
    <p class="loading">Loading...</p>
  {/if}
</div>

<style>
  .topics-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    margin: 1vw;
  }

  .loading {
    text-align: center;
    font-size: 2vw;
    line-height: 2vw;
    color: rgba(51, 226, 230, 0.5);
    padding-block: 2vw;
  }

  @media only screen and (max-width: 600px) {
    .loading {
      font-size: 1em;
      line-height: 1em;
    }
  }
</style>
