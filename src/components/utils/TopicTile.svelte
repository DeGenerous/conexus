<script lang="ts">
  import { blankImage, serveUrl } from '@constants/media';
  import { resolveRenderableImage } from '@utils/file-validation';

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

  let tileImage = $state<string>(blankImage);

  // Resolve the topic tile image to a safe, renderable source
  $effect(() => {
    const currentTopic = topic;
    if (!currentTopic) {
      tileImage = blankImage;
      return;
    }

    const candidate = serveUrl(currentTopic.tile_file_url);
    let cancelled = false;

    tileImage = candidate;

    (async () => {
      const safe = await resolveRenderableImage(candidate);
      if (!cancelled) tileImage = safe;
    })();

    return () => {
      cancelled = true;
    };
  });

  const listTopicGates = (topic: CategoryTopic) => {
    return topic.topic_gates
      ?.map((gate) => {
        const type = gate.gate_kind;

        switch (type) {
          case 'erc20_token':
            return `${gate.min_amount!} $${gate.collection_name.toUpperCase()}`;

          case 'erc721_token':
            return gate.collection_name;

          case 'erc721_class':
            return gate.collection_name;

          default:
            return gate.collection_name || gate.name || 'Unknown Gate';
        }
      })
      .join(', ');
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
      src={tileImage}
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
