<script lang="ts">
  import { onMount } from 'svelte';

  import {
    potentials,
    potentialsPower,
    userRank,
    selectedPotential,
    episodes,
    loadingStatus,
  } from '@stores/omnihub.svelte';
  import getNFTs from '@utils/potentials';
  import { getVotingHistory } from '@utils/ds-episodes';
  import { ranks } from '@constants/ranks';

  import LoadingSVG from '@components/icons/Loading.svelte';

  onMount(getNFTs);
</script>

<table class="ranks container">
  <thead>
    <tr>
      <th>Rank</th>
      <th>Potentials</th>
    </tr>
  </thead>
  <tbody>
    {#each ranks as { rank, value }}
      <tr class="rank transition" class:active-rank={rank === $userRank}>
        <td>{rank}</td>
        <td class="number">{value}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#if $episodes.length > 0}
  <h3>Dischordian Saga Votes: {$episodes.flat().length}</h3>
  {#each $episodes as season, index}
    <h4>Season {index + 1}</h4>
    <ul class="episodes transparent-container">
      {#each season as episode}
        <li class="flex-row">
          <span class="flex">
            <h5>Memory {episode.memory}</h5>
            <hr />
            <p>"{episode.title}"</p>
            <p>Season {episode.season} - Episode {episode.episode}</p>
          </span>
          <ol class="container">
            {#each episode.votes_options as { option }, i}
              <li class:selected-option={episode.vote == i + 1}>
                {option}
              </li>
            {/each}
          </ol>
        </li>
      {/each}
    </ul>
  {/each}
{:else if $loadingStatus}
  <span class="flex-row">
    <LoadingSVG />
    <h4 class="text-glowing">{$loadingStatus}</h4>
  </span>
{:else}
  <button class="button-glowing blur" onclick={getVotingHistory}>
    Fetch Votes
  </button>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  table {
    display: block;
    width: auto;
    max-width: min(95%, 80rem);
    margin-inline: 0;
    padding: 0;
    border-collapse: collapse;
    background-image: url('/omnihub/ranks-bg-25.avif');
    background-size: cover;
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
      @include light-blue(1, text);
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
        @include cyan(0.25);
        @include bright;
      }

      &.active-rank {
        @include cyan(1, text);
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

  .episodes {
    width: auto;
    max-width: min(95%, 80rem);
  }
</style>
