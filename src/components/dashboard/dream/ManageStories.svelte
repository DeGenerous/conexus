<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { onMount } from 'svelte';

  import Collections from '@components/dashboard/dream/manage/Collections.svelte';
  import Categories from '@components/dashboard/dream/manage/Categories.svelte';
  import NFTGates from '@components/dashboard/dream/manage/NFTGates.svelte';
  import { ensureCreator } from '@utils/route-guard';

  let nav: 'collection' | 'categories' | 'nft-gates' = $state('collection');

  const selectInput = (event: Event) => {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    input.select();
  };

  let isAdmin = $state(false);
  let isCreator = $state(false);

  onMount(async () => {
    const resp = await ensureCreator();

    isAdmin = resp.isAdmin;
    isCreator = resp.isCreator;
  });
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

  {#if isAdmin}
    <button
      class="void-btn blur"
      class:selected={nav === 'nft-gates'}
      onclick={() => (nav = 'nft-gates')}
    >
      NFT Gates
    </button>
  {/if}
</nav>

{#if nav === 'collection'}
  <Collections />
  <!-- <Collections {selectInput} /> -->
{:else if nav === 'nft-gates'}
  <NFTGates {selectInput} />
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
