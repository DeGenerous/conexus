<script lang="ts">
  import { blankImage, serveUrl } from '@constants/media';

  import LockSVG from '@components/icons/Lock.svelte';

  let {
    name,
    intended,
    topic = $bindable(),
    loading = $bindable(),
  }: {
    name: string;
    intended: 's' | 'c';
    topic: Nullable<CategoryTopic>;
    loading: boolean;
  } = $props();

  const topicName: string = topic ? topic.name.trim() : '';

  const listTopicGates = (topic: CategoryTopic) => {
    return (
      topic.topic_gates
        ?.map((gate) => {
          const type = gate.gate_kind;

          switch (type) {
            case 'erc20_token':
              return `${gate.min_amount ?? 0} ${gate.collection_name?.toUpperCase() || gate.collection_name}`;

            case 'erc721_token':
              if (gate.specific_token_ids?.length) {
                const ids = gate.specific_token_ids
                  .map((id) => `#${id}`)
                  .join(', ');
                return `NFTs: ${ids} (${gate.collection_name})`;
              }
              return gate.collection_name ?? 'Unknown NFT';

            case 'erc1155_token':
              return `${gate.min_amount ?? 1} × ${gate.collection_name}`;

            case 'erc721_class':
              return `${gate.collection_name} (Class)`;

            case 'erc1155_class':
              return `${gate.collection_name} (Class)`;

            default:
              return gate.collection_name || gate.name || 'Unknown Gate';
          }
        })
        .join(', ') ?? ''
    );
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
    class:gated-story={topic.topic_gates && topic.topic_gates.length > 0}
    href="/{intended}/{name}/{topic.id}?title={topic.name}"
  >
    <img
      loading="lazy"
      src={serveUrl(topic.tile_file_url) ?? blankImage}
      alt={topicName}
      draggable="false"
      height="1024"
      width="1024"
    />
    <h5>{topicName}</h5>
    {#if topic.topic_gates && topic.topic_gates.length > 0}
      <div class="gatings">
        <LockSVG />
        <p>{listTopicGates(topic)}</p>
      </div>
    {/if}
  </a>
{/if}
