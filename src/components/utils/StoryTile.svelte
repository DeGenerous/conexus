<script lang="ts">
  import { blankImage, serveUrl } from '@constants/media';

  export let section: string;
  export let topic: Nullable<TopicInCategory>;
  export let loading: boolean;

  const storyName: string = topic ? (
    topic.name.charAt(0).toUpperCase() + topic.name.slice(1)
  ).trim() : '';

  const listTopicGates = (topic: TopicInCategory) => {
    const gates = topic.nft_gate?.map((gate) => {
      const name = gate.contract_name;
      const className = gate.class_name;
      return className ? `${name} (${className})` : name;
    }).join(', ');
    return gates;
  }
</script>

<!-- if loading show loader -->
{#if loading}
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
{:else if topic}
  <a
    class="tile"
    class:gated-story={topic.nft_gate && topic.nft_gate.length > 0}
    href="/{section}/{topic.name}?id={topic.id}"
  >
    <img
      class="tile-picture"
      loading="lazy"
      src={serveUrl(topic.tile_file_id) ?? blankImage}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
    <p class="tile-title">{storyName}</p>
    {#if topic.nft_gate && topic.nft_gate.length > 0}
      <div class="gatings">
        <img class="gating-icon" src="/icons/lock.svg" alt="Restricted" />
        <h3>{listTopicGates(topic)}</h3>
      </div>
    {/if}
  </a>
{/if}

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
