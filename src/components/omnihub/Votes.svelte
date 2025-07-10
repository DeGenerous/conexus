<script lang="ts">
  import { episodes, loadingStatus } from '@stores/omnihub.svelte';
  import { getVotingHistory } from '@utils/ds-episodes';

  import LoadingSVG from '@components/icons/Loading.svelte';
</script>

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
  <div class="container flex-row">
    <LoadingSVG />
    <h5 class="text-glowing">{$loadingStatus}</h5>
  </div>
{:else}
  <button class="button-glowing blur" onclick={getVotingHistory}>
    Check Voting History
  </button>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .episodes {
    @include auto-width;
  }
</style>
