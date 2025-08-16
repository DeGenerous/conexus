<script lang="ts">
  import { blankImage, serveUrl } from '@constants/media';

  import LockSVG from '@components/icons/Lock.svelte';

  let {
    section_name,
    topic = $bindable(),
    loading = $bindable(),
  }: {
    section_name: string;
    topic: Nullable<CategoryTopics>;
    loading: boolean;
  } = $props();

  const storyName: string = topic ? topic.name.trim() : '';

  const listTopicGates = (topic: CategoryTopics) => {
    const gates = topic.topic_gates
      ?.map((gate) => {
        // Narrowing based on gate_type
        if ('gate_type' in gate) {
          if (gate.min_amount && gate.min_amount > 0) {
            return `$${gate.contract_name} (${gate.min_amount})`;
          }
          return gate.contract_name;
        } else {
          if (gate.class_name) {
            return `${gate.class_name} (${gate.class_name})`;
          }
          return gate.class_name;
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
    class:gated-story={topic.topic_gates && topic.topic_gates.length > 0}
    href="/sections/{section_name}/{topic.id}?title={topic.name}"
  >
    <!-- href="/sections/{section_name}/{topic.name}?id={topic.id}" -->
    <img
      loading="lazy"
      src={serveUrl(topic.tile_file_url) ?? blankImage}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
    <h5>{storyName}</h5>
    {#if topic.topic_gates && topic.topic_gates.length > 0}
      <div class="gatings">
        <LockSVG />
        <p>{listTopicGates(topic)}</p>
      </div>
    {/if}
  </a>
{/if}
