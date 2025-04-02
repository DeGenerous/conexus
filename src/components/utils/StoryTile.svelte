<script lang="ts">
  import MediaManager from '@lib/media';
  import { CoNexusApp } from '@lib/view';
  import { onMount } from 'svelte';

  export let section: string;
  export let topicID: number;
  export let topicName: string;

  const media: MediaManager = new MediaManager();
  const view: CoNexusApp = new CoNexusApp();

  const storyName: string = (
    topicName.charAt(0).toUpperCase() + topicName.slice(1)
  ).trim();

  let topicGatings: TopicNFTGate[] = [];
  onMount(async () => {
    topicGatings = await view.fetchTopicGates(topicID);
  });

  const blankPicture = '/blank.avif';
</script>

<a
  class="tile"
  class:gated-story={topicGatings.length > 0}
  href="/{section}/{topicName}?id={topicID}"
>
  {#await media.fetchStoryImage(topicID, 'tile')}
    <img
      class="tile-picture"
      loading="lazy"
      src={blankPicture}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
  {:then storyImage}
    <img
      class="tile-picture"
      loading="lazy"
      src={storyImage}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
  {/await}
  <p class="tile-title">{storyName}</p>
  {#if topicGatings.length > 0}
    <div class="gatings">
      <img class="gating-icon" src="/icons/lock.svg" alt="Restricted" />
      <h3>{topicGatings.map((gate) => gate.contract_name).join(', ')}</h3>
    </div>
  {/if}
</a>

<style>
  .gatings {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;
    width: 95%;
    border-radius: 1vw;
    background-color: rgba(32, 0, 1, 0.5);
    margin-bottom: 0.5vw;
    padding: 1vw;
  }

  .gating-icon {
    width: 2vw;
    height: 2vw;
  }

  h3 {
    width: 100%;
    color: rgb(255, 165, 40);
  }

  @media only screen and (max-width: 600px) {
    .gatings {
      gap: 1em;
      border-radius: 0.75em;
      margin-bottom: 0.25em;
      padding: 0.5em;
    }

    .gating-icon {
      width: 0.85em;
      height: 0.85em;
    }

    h3 {
      font-size: 0.85em;
    }
  }
</style>
