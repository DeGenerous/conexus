<script lang="ts">
  import type { DynTopic } from '@lib/conexus';

  export let topics: DynTopic[] | undefined;
</script>

<div class="topics-container">
  {#if topics}
    {#each topics as topic}
      <a href="/story/{topic.name}" class="topic">
        <p class="topic-title">{topic.name}</p>
      </a>
    {/each}
  {:else}
    <p>Loading...</p>
  {/if}
</div>

<style>
  .topics-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 1vw;
  }

  .topic {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1vw 2.5vw;
    padding: 2vw;
    background-color: rgba(1, 0, 32, 0.75);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2.5vw;
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.25));
    text-decoration: none;
  }

  .topic:hover {
    background-color: rgba(51, 226, 230, 0.3);
    color: #010020;
    filter: drop-shadow(0 0 0.5vw #33e2e6);
  }

  .topic-title {
    text-align: center;
    font-size: 2vw;
    line-height: 2.5vw;
    color: rgba(255, 255, 255, 0.75);
  }
</style>
