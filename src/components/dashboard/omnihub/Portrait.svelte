<script lang="ts">
  import { onMount } from 'svelte';

  import {
    GetCache,
    SetCache,
    POTENTIALS_KEY,
    SELECTED_POTENTIAL_KEY,
  } from '@constants/cache';
  import { navContext } from '@stores/navigation.svelte';
  import { type NFT } from '@stores/omnihub.svelte';
  import { attributes } from '@constants/attributes';
  import { NAV_ROUTES } from '@constants/routes';

  import Votes from '@components/dashboard/omnihub/Votes.svelte';

  let potential = $state<Nullable<NFT>>(null);
  let loading = $state<boolean>(true);

  const getAttribute = (name: string) => {
    const nftAttributes = potential?.attributes as OnchainAttribute[];
    return nftAttributes.filter((item) => item.label.toLowerCase() == name)[0]
      .value;
  };

  onMount(() => {
    potential = GetCache<NFT>(SELECTED_POTENTIAL_KEY);
    const allPotentials = GetCache<NFT[]>(POTENTIALS_KEY) || [];

    const index = allPotentials.findIndex((p) => p.token_id === potential?.token_id);

    navContext.setContext({
      items: allPotentials.map((p) => ({
        name: `#${p.token_id}`,
        action() {
          SetCache(SELECTED_POTENTIAL_KEY, p);
          window.location.reload();
        },
      })),
      index,
    });

    // console.log(potential);
    loading = false;
  });
</script>

{#if loading}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else if potential}
  <section class="flex">
    <header class="flex-row pad-8 pad-inline blur shad">
      <h4>{potential.name} ({getAttribute('class')})</h4>

      <div class="level flex-row gap-8">
        <h4>
          <strong class="pc-only">Power</strong> Level:
        </h4>
        <span class="flex pad-8 shad-inset">{potential.level}</span>
      </div>
    </header>

    <div class="potential container fade-in">
      <div class="flex">
        <img
          class="potential-picture"
          src={potential.image}
          alt={potential.name}
        />

        <ul class="flex">
          {#each attributes as { name, value }}
            <li class="flex-row gap-8">
              <img
                class="attribute-icon"
                src="/omnihub/attributes/{name}.png"
                alt={name}
              />
              {name}:
              <span class="flex pad-8">?</span>
            </li>
          {/each}
        </ul>
      </div>

      <span class="transparent-container">
        <h5>View on Marketplace:</h5>
        <a class="button-anchor" href={NAV_ROUTES.MAGIC_EDEN} target="_blank">
          <img src="/icons/magiceden.png" alt="Magic Eden marketplace" />
          Magic Eden
        </a>
        <a
          class="button-anchor"
          href="https://opensea.io/item/ethereum/0xfa511d5c4cce10321e6e86793cc083213c36278e/{potential.token_id}"
          target="_blank"
        >
          <img src="/icons/opensea.png" alt="OpenSea marketplace" />
          OpenSea
        </a>
      </span>
    </div>

    <footer class="flex-row pad-8 pad-inline blur shad">
      <span class="flex-row gap-8">
        <a
          class="button-anchor purple-btn"
          href="{NAV_ROUTES.SINGULAR}/{potential.token_id}"
          target="_blank"
        >
          Customize
        </a>
        <img src="/icons/rmrk.png" alt="RMRK Singular marketplace" />
      </span>
      <button disabled>Stake</button>
    </footer>
  </section>

  <Votes />
{:else}
  <div class="container fade-in">
    <h5>No Potential found. Head back to choose one.</h5>
    <a class="button-anchor" href="/omnihub"> Go Back </a>
    <h5>Re-sync with a Potential to unlock the Portrait Core.</h5>
  </div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    gap: 0;
    @include auto-width;

    header,
    footer {
      width: 100%;
      z-index: 10;
      justify-content: space-between;
      background-color: $royal-purple;
    }

    header {
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;

      h4 {
        @include orange(1, text);

        @include respond-up(tablet) {
          strong {
            display: inline;
          }
        }
      }

      .level {
        span {
          height: 2.5rem;
          min-width: 2.5rem;
          border-radius: 1rem;
          @include orange(1, text);
          @include dark-red(0.75);
          @include font(h4);
        }
      }
    }

    footer {
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;

      img {
        width: 5rem;
        opacity: 0.5;
      }
    }

    .potential {
      width: 100%;
      border-radius: 0;

      div {
        width: inherit;

        @include respond-up(tablet) {
          flex-direction: row;
        }

        img {
          aspect-ratio: 1/1;

          &.potential-picture {
            aspect-ratio: 1/1;
            border-bottom-right-radius: 9rem 3.5rem;
            border-bottom-left-radius: 9rem 3.5rem;
            border-top-right-radius: 9rem 3.5rem;
            border-top-left-radius: 9rem 3.5rem;
            @include orange-border;
            @include box-shadow(0 0 0.25rem $orange);

            @include respond-up(tablet) {
              width: 25rem;
            }
          }

          &:not(.potential-picture) {
            width: 1.5rem;
          }
        }

        ul {
          align-items: flex-end;

          li {
            text-transform: capitalize;
            cursor: default;
            @include white-txt;

            span {
              height: 2.5rem;
              min-width: 2.5rem;
              border-radius: 1rem;
              @include white-txt;
              @include deep-red(0.5);
              @include orange-border;
              @include box-shadow(0 0 0.25rem $orange);
            }
          }
        }
      }

      & > span {
        width: 100%;
        animation: none;
        @include dark-red(0.25);

        @include respond-up(tablet) {
          flex-direction: row;
        }
      }
    }
  }
</style>
