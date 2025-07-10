<script lang="ts">
  import { userRank } from '@stores/omnihub.svelte';
  import { ranks } from '@constants/ranks';

  let showTable = $state<boolean>(false);
</script>

{#if $userRank}
  {#if showTable}
    <table class="ranks container fade-in">
      <thead>
        <tr>
          <th>
            <button
              class="orange-btn mar-auto"
              onclick={() => (showTable = false)}
            >
              Collapse Ranks
            </button>
          </th>
          <th>Potentials</th>
        </tr>
      </thead>
      <tbody>
        {#each ranks as { name, value }}
          <tr class="rank transition" class:active-rank={name === $userRank}>
            <td>{name}</td>
            <td class="number">{value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="container flex-row fade-in">
      <h4>Your rank:</h4>
      <button class="orange-btn" onclick={() => (showTable = true)}>
        {$userRank}
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
      padding: 0.5rem 1.5rem;
      border-width: 2px !important;
      cursor: default;
      @include dark-border;
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
      width: 100%;
      padding: 0.5rem 1.5rem;
      border-left: none;
      border-bottom: none;
      @include font(h5);

      &.number {
        width: auto;
        border-right: none !important;
        @include font(h4);
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
