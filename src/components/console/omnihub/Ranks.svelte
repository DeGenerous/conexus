<script lang="ts">
  import { ranks } from '@constants/curation';

  let { userRank }: { userRank: Nullable<string> } = $props();

  let showTable = $state<boolean>(false);
</script>

{#if userRank}
  {#if showTable}
    <table class="ranks container fade-in">
      <thead>
        <tr>
          <th>
            <button
              class="orange-btn mar-auto"
              onclick={() => (showTable = false)}
            >
              Hide Ranks
            </button>
          </th>
          <th>Potentials</th>
        </tr>
      </thead>
      <tbody>
        {#each ranks as { name, value }}
          <tr class="rank transition" class:active-rank={name === userRank}>
            <td>{name}</td>
            <td class="number">{value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="container flex-row fade-in">
      <h4>Your rank:</h4>
      <button
        class="orange-btn"
        onclick={() => {
          showTable = true;
          setTimeout(() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth',
            }),
          );
        }}
      >
        {userRank}
      </button>
    </div>
  {/if}
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    @include auto-width;
  }

  table {
    display: block;
    margin-inline: 0;
    padding: 0;
    border-collapse: collapse;
    background-image: url('/omnihub/ranks-bg.avif');
    background-size: cover;
    background-position: bottom;
    text-transform: uppercase;
    @include white-txt;
    @include text-shadow;

    th,
    td {
      padding-block: 0.5rem;
      border-width: 2px !important;
      cursor: default;
      @include dark-border;

      @include respond-up(tablet) {
        padding: 0.5rem 1.5rem;
      }
    }

    th {
      border-top: none;
      border-width: 2px;
      @include white-txt(soft);
      @include orange(1, text);
      @include font(h4);

      &:first-of-type {
        border-left: none;
      }

      &:last-of-type {
        border-right: none;
      }
    }

    td {
      padding: 0.5rem 1.5rem;
      border-left: none;
      border-bottom: none;
      @include font(h5);

      &.number {
        width: 100%;
        border-right: none !important;
        @include font(h4);
      }

      @include respond-up(tablet) {
        width: 100%;

        &.number {
          width: auto;
        }
      }
    }

    .rank {
      &:hover {
        @include cyan(0.1);
        @include bright;
      }

      &.active-rank {
        @include orange(0.2);
        @include orange(1, text, bright);
      }

      &:last-of-type {
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;

        td:first-of-type {
          border-bottom-left-radius: 1rem;
        }

        td:last-of-type {
          border-bottom-right-radius: 1rem;
        }
      }
    }
  }
</style>
