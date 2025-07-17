<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';

  import MediaManager from '@lib/media';
  import AgentGame from '@lib/agent';
  import { agentStory, game } from '@stores/conexus.svelte';
  import {
    SetCache,
    GetCache,
    TEMP_USER_KEY,
    TTL_MONTH,
  } from '@constants/cache';
  import detectIOS from '@utils/ios-device';
  import { getCurrentUser } from '@utils/route-guard';

  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';
  import Share from '@components/utils/Share.svelte';

  let { story_id }: { story_id: string } = $props();

  let user: Nullable<User> = $state(null);
  let tempUserId: string | null = $state(null);

  const agentGame: AgentGame = new AgentGame();
  const media: MediaManager = new MediaManager();

  const handleSetMedia = async (topic_id: any) => {
    await media.setBackgroundImage(topic_id);
    await media.playBackgroundMusic(topic_id);
  };

  onMount(async () => {
    tempUserId = GetCache<string>(TEMP_USER_KEY);
    user = await getCurrentUser();

    console.log('Temp user id', tempUserId);

    if (user && user.id) {
      tempUserId = user.id;
      SetCache(TEMP_USER_KEY, tempUserId, TTL_MONTH);
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if $agentStory === null}
  <div class="story-wrapper flex" style:cursor={game.loading ? 'progress' : ''}>
    <section class="story container">
      <img
        class="round-8 transparent-glowing"
        src="/blank.avif"
        alt="PAC MEME"
        draggable="false"
        width="1024"
      />
      <div class="flex">
        <span class="buttons flex-row flex-wrap">
          {#if game.loading}
            <span class="flex-row gap-8">
              <LoadingSVG />
              <button disabled>LOADING</button>
            </span>
          {:else}
            <button
              class:button-glowing={tempUserId}
              onclick={() => {
                if (tempUserId) {
                  agentGame.startGame(story_id, tempUserId, handleSetMedia);
                }
              }}
              disabled={!tempUserId}
            >
              {#if tempUserId}
                PLAY NOW
              {:else}
                Please accept cookies to play
              {/if}
            </button>
            <Share />
          {/if}
        </span>
      </div>
    </section>
  </div>

  <p class="description transparent-container white-txt text-shad">
    Agent Story default description
  </p>
{:else}
  {#if !detectIOS()}
    <BackgroundMusic />
  {/if}
  <Tts />

  <h1>Game Started</h1>
  <!-- <Step {story_name} {restartGame} /> -->
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .story-wrapper {
    margin-top: 1rem;

    .story {
      width: 90%;
      max-width: 50rem;
      min-width: 250px;

      img,
      .fake-img {
        width: 100%;
        height: 25rem;
        @include box-shadow;
        @include cyan(0.1);
      }

      video {
        max-width: 100%;
        max-height: 25rem;
        @include box-shadow;

        @include respond-up(tablet) {
          min-height: 20rem;
        }
      }

      div {
        width: 100%;

        span {
          width: 100%;
        }

        .genres {
          @include cyan(0.1);
          @include font(small);

          p {
            padding: 0;
            font-size: inherit;
            line-height: inherit;
          }

          &.default-genres {
            min-width: 20rem;
            min-height: 2.2rem;
          }
        }
      }

      @include respond-up(tablet) {
        div {
          flex-direction: row;
          justify-content: space-between;
          gap: 1rem;
          flex: none;

          span {
            max-width: 100%;
            width: auto;
          }

          .buttons {
            justify-content: flex-end;
            flex-direction: row-reverse;
            flex: none;
          }
        }
      }

      @include respond-up(small-desktop) {
        max-width: 68rem;
        width: auto;
      }
    }

    .unfinished-stories {
      overflow-x: hidden !important;

      h5 {
        width: 100%;
        text-transform: uppercase;
        @include font(small);
      }

      div {
        width: 100%;
        justify-content: space-between;
        border-radius: 1rem;
        @include cyan(0.2);

        &:hover,
        &:active {
          @include cyan(1, text);
          @include light-blue(0.5);
        }

        span {
          gap: 0;

          .story-id {
            opacity: 0.5;
            @include font(caption);
          }
        }
      }

      @include respond-up(tablet) {
        flex-flow: row wrap;
        width: 90%;
        max-width: 50rem;

        div {
          width: auto;
        }
      }

      @include respond-up(small-desktop) {
        max-width: 68rem;
      }
    }

    @include respond-up(large-desktop) {
      flex-direction: row;

      .story {
        margin-inline: unset;
      }

      .unfinished-stories {
        margin-inline: unset;
        align-items: flex-start;
        width: 18rem;
        max-height: 30.5rem;
        overflow: auto;

        @include respond-up(full-hd) {
          width: 36rem;
        }

        @include respond-up(quad-hd) {
          width: 52rem;
        }
      }
    }
  }

  .gating {
    margin-top: 1rem;
    width: 100%;
    max-width: 50rem;
    stroke: $dark-red;
    @include orange(0.85);

    div {
      h5 {
        text-align: left;
        @include dark-red(1, text);
      }
    }

    span {
      width: 100%;
      flex-wrap: wrap;
      @include dark-red(0.5);
      @include white-txt(soft);
      @include box-shadow(soft, inset);

      a {
        text-decoration: underline dashed $transparent-white;
        @include white-txt;

        &:hover:not(&.inactive-link),
        &:active:not(&.inactive-link),
        &:focus:not(&.inactive-link) {
          text-decoration: underline $orange;
          color: $bright-orange;
        }

        &.inactive-link {
          cursor: help;

          &:hover,
          &:active,
          &:focus {
            text-decoration: underline $deep-orange;
            color: $deep-orange;
          }
        }
      }
    }
  }

  .description {
    margin-top: 1rem;
    width: clamp(250px, 95%, 90rem);
  }
</style>
