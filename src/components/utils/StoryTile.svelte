<script lang="ts">
  import { blankImage, serveUrl } from '@constants/media';
  import { contractGetter } from '@constants/contracts';
  import LockSVG from '@components/icons/Lock.svelte';

  export let section: string;
  export let topic: Nullable<TopicInCategory>;
  export let loading: boolean;

  const storyName: string = topic ? topic.name.trim() : '';

  const listTopicGates = (topic: TopicInCategory) => {
    const gates = topic.nft_gate
      ?.map((gate) => {
        const name = gate.contract_name;
        const className = gate.class_name;
        const amount = gate.amount;

        const convertedName = contractGetter(name).name;

        // return className ? `${convertedName} (${className})` : convertedName;
        if (amount && amount > 0) {
          return `$${convertedName.toUpperCase()} (${amount})`;
        } else if (className) {
          return `${convertedName} (${className})`;
        } else {
          return convertedName;
        }
      })
      .join(', ');
    return gates;
  };
</script>

<!-- if loading show loader -->
{#if loading}
  <div class="loading-tile">
    <div class="loading-animation"></div>
    <span class="loading-animation"></span>
  </div>
{:else if topic}
  <a
    class="tile"
    class:gated-story={topic.nft_gate && topic.nft_gate.length > 0}
    href="/sections/{section}/{topic.name}?id={topic.id}"
  >
    <img
      loading="lazy"
      src={serveUrl(topic.tile_file_id) ?? blankImage}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
    <h5>{storyName}</h5>
    {#if topic.nft_gate && topic.nft_gate.length > 0}
      <div class="gatings">
        <LockSVG />
        <p>{listTopicGates(topic)}</p>
      </div>
    {/if}
  </a>
{/if}
