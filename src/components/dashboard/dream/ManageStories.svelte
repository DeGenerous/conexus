<script lang="ts">
  import { AdminApp } from '@lib/admin';
  import { CoNexusApp } from '@lib/view';
  import { SetCache, ALL_TOPICS_KEY, ALL_TOPICS_TTL } from '@constants/cache';

  import Collections from '@components/dashboard/dream/manage/Collections.svelte';
  import Categories from '@components/dashboard/dream/manage/Categories.svelte';
  import NFTGates from '@components/dashboard/dream/manage/NFTGates.svelte';

  let admin = new AdminApp();
  let view = new CoNexusApp();

  let nav: 'collection' | 'categories' | 'nft-gates' = $state('collection');

  let sections = $state<Section[]>([]);
  let collections = $state<Collection[]>([]);
  let classGates = $state<ClassGate[]>([]);

  const fetchCollections = async () => {
    collections = await admin.fetchCollections();
    storeAllTopics(collections);
  };

  const fetchClasses = async () => {
    classGates = await view.fetchClassGates();
  };

  $effect(() => {
    view.getSections().then((data) => (sections = data));
    fetchCollections();
    fetchClasses();
  });

  const selectInput = (event: Event) => {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    input.select();
  };

  const storeAllTopics = (collections: Collection[]) => {
    const allTopics = collections.map((collection) => collection.topics).flat();
    const topicNames = allTopics.map(({ topic_name }) => topic_name);
    SetCache(ALL_TOPICS_KEY, topicNames.join(']['), ALL_TOPICS_TTL);
  };
</script>

<nav class="flex-row">
  <button
    class="void-btn blur"
    class:selected={nav === 'collection'}
    onclick={() => (nav = 'collection')}
  >
    Collections
  </button>
  <button
    class="void-btn blur"
    class:selected={nav === 'categories'}
    onclick={() => (nav = 'categories')}
  >
    Categories
  </button>
  <button
    class="void-btn blur"
    class:selected={nav === 'nft-gates'}
    onclick={() => (nav = 'nft-gates')}
  >
    NFT Gates
  </button>
</nav>

{#if nav === 'collection'}
  {#if !collections.length}
    <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
  {:else}
    <Collections {sections} {collections} {fetchCollections} {selectInput} />
  {/if}
{:else if nav === 'nft-gates'}
  <NFTGates {classGates} {fetchClasses} {selectInput} />
{:else if nav === 'categories'}
  <Categories />
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  nav {
    position: sticky;
    top: 4rem;
    z-index: 125;
    width: 100vw;
    justify-content: space-around;
    gap: 0;
    @include blue(0.75);
    @include box-shadow;

    button {
      width: 100%;
      padding: 0.5rem;
      @include white-txt(soft);
      @include font(h5);

      &:hover,
      &:active {
        @include bright;
        @include light-blue(0.5);
      }

      &.selected {
        @include cyan(1, text);
        @include light-blue(0.5);
      }
    }

    @include respond-up(small-desktop) {
      top: 0;
      width: clamp(20rem, calc(100% - 12rem), 85rem);
      border-radius: 1rem;

      button {
        &:first-of-type {
          border-top-left-radius: 1rem;
          border-bottom-left-radius: 1rem;
        }

        &:last-of-type {
          border-top-right-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
      }
    }
  }
</style>
