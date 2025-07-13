<script lang="ts">
  import {
    episodes,
    totalEpisodes,
    loadingStatus,
  } from '@stores/omnihub.svelte';
  import { getVotingHistory } from '@utils/ds-episodes';

  import LoadingSVG from '@components/icons/Loading.svelte';
</script>

<section class="transparent-container">
  {#if $episodes.length > 0}
    <div class="governance-hub">
      <img src="/omnihub/governance-hub.avif" alt="Galactic Governance Hub" />

      <p class="flex soft-white-txt">
        Chronicle the past. Shape what comes next. This is the seat of
        story-shaping power — where legends aren’t read, they’re written.
      </p>

      <span class="flex">
        <h5 class="text-glowing">
          Dischordian Saga votes:
          <strong>
            {$episodes.flat().length} / {$totalEpisodes}
          </strong>
        </h5>
        <a
          class="button-anchor button-glowing blur"
          href="https://governance.degenerousdao.com/"
          target="_blank"
        >
          Enter the Governance Hub
        </a>
      </span>
    </div>

    <hr />

    {#if $episodes.flat().length}
      {#each $episodes as season, index}
        {#if season.length}
          <h3 class="text-glowing">⟡ Season {index + 1} ⟡</h3>
          <ul class="flex">
            {#each season as episode}
              <hr class="mobile-only" />
              <li class="flex">
                <span class="flex">
                  <h5>Memory {episode.memory}</h5>
                  <h5>"{episode.title}"</h5>
                  <p>Season {episode.season} - Episode {episode.episode}</p>
                </span>
                <ol class="container default-ol">
                  {#each episode.votes_options as { option }, i}
                    <li class:text-glowing={episode.vote == i + 1}>
                      {option}
                    </li>
                  {/each}
                </ol>
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    {:else}
      <h5>A silent node in the fabric of fate. No votes recorded.</h5>
      <h5>This Potential awaits its moment to influence the path.</h5>
    {/if}
  {:else if $loadingStatus}
    <span class="flex-row">
      <LoadingSVG />
      <h5 class="text-glowing">{$loadingStatus}</h5>
    </span>
  {:else}
    <span class="flex-row flex-wrap">
      <h5 class="text-glowing">See How You Shaped the Saga:</h5>
      <button class="button-glowing blur" onclick={getVotingHistory}>
        Check Voting History
      </button>
    </span>
  {/if}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    @include auto-width;

    .governance-hub {
      position: relative;

      img {
        width: 100%;
        max-width: 40rem;
      }

      & > p {
        position: absolute;
        width: 85%;
        left: 7.5%;
        top: 3rem;
        z-index: 10;
      }

      span {
        h5 {
          strong {
            @include bright;
          }
        }
      }

      @include respond-up(tablet) {
        & > p {
          top: 15%;
        }

        span {
          position: absolute;
          width: 85%;
          left: 7.5%;
          bottom: 12.5%;
          z-index: 10;
        }
      }
    }

    ul {
      li {
        width: 100%;

        h5 {
          @include white-txt;
        }

        p {
          @include white-txt(0.5);
        }

        ol {
          width: inherit;
          @include box-shadow(deep, inset);

          li {
            @include white-txt(0.5);
          }
        }

        @include respond-up(small-desktop) {
          flex-direction: row;

          span {
            min-width: 20rem;
            align-items: flex-end;

            * {
              text-align: right;
            }
          }

          ol {
            min-height: 9rem;
          }
        }
      }
    }
  }
</style>
