<script lang="ts">
  import { onMount } from 'svelte';
  import tippy, { type Instance } from 'tippy.js';

  import { GetCache, SetCache, ONBOARDING_KEY } from '@constants/cache';
  import { trailerURL } from '@constants/media';
  import { story, game } from '@stores/conexus.svelte';
  import {
    highlightCommunityPicks,
    prevItem,
    nextItem,
  } from '@stores/navigation.svelte';

  import Profile from '@components/Profile.svelte';
  import Background from '@components/utils/Background.svelte';
  import Onboarding from '@components/utils/Onboarding.svelte';

  import HomeSVG from '@components/icons/Home.svelte';
  import BackArrow from '@components/icons/BackArrow.svelte';
  import PlaySVG from '@components/icons/Play.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import ConexusLogo from '@components/icons/ConexusLogo.svelte';
  import BackArrowPCNav from './utils/BackArrowPCNav.svelte';

  let {
    header = '',
    subheading = '',
    activeTab = 'Home',
    arrow,
  }: {
    header: string;
    subheading: string;
    activeTab: string;
    arrow: string;
  } = $props();

  let hiddenHeader = $state<boolean>(false);
  let showIntro = $state<boolean>(false);
  let onboarding = $state<boolean>(false);

  const navigateTo = (item: Nullable<NavItem>) => {
    if (!item) return;
    if (item.link) {
      window.location.href = item.link; // or `location.href = item.link`
    } else if (item.action) {
      item.action();
    }
  };

  // FULLSCREEN

  $effect(() => {
    document.onfullscreenchange = () => {
      if (game.fullscreen !== !!document.fullscreenElement)
        game.fullscreen = !!document.fullscreenElement;
    };
  });

  $effect(() => {
    if (game.fullscreen) document.documentElement.requestFullscreen();
    else if (document.fullscreenElement) document.exitFullscreen();
  });

  const onkeydown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    if (document.activeElement?.tagName !== 'BODY') return;
    if (event.key === 'f') game.fullscreen = !game.fullscreen;
  };

  // PC-Hide
  const clamp = 64; // px after which hiding can kick in

  let lastY = 0;
  let ticking = false;
  const onscroll = (event: Event) => {
    if (onboarding) event.preventDefault();

    if (activeTab === 'Dashboard') return;

    const y = window.scrollY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (y > lastY && y > clamp) hiddenHeader = true;
      else if (y < lastY) hiddenHeader = false;
      lastY = y;
      ticking = false;
    });
  };

  // ONBOARDING

  // let tippyInstance: Instance;
  // const startOnboarding = () =>
  //   setTimeout(() => {
  //     const isOnboarded = GetCache(ONBOARDING_KEY);
  //     if (isOnboarded) return;

  //     onboarding = true;

  //     // Show the tooltip
  //     const intro = document.getElementById('intro') as HTMLSpanElement;

  //     tippyInstance = tippy(intro, {
  //       content: 'Meet CoNexus in 30 seconds',
  //       trigger: 'manual',
  //       placement: 'bottom',
  //       hideOnClick: false,
  //     });

  //     tippyInstance.show();

  //     // Disable scroll
  //     window.scrollTo({
  //       top: 0,
  //       behavior: 'smooth',
  //     });
  //     setTimeout(() => document.documentElement.classList.add('no-scroll'));
  //   });

  // const finishOnboarding = () => {
  //   SetCache(ONBOARDING_KEY, true);
  //   onboarding = false;

  //   // Update the store to apply highlighted styling
  //   $highlightCommunityPicks = true;

  //   // Destroy the tooltip
  //   tippyInstance.destroy();

  //   // Enable scroll
  //   document.documentElement.classList.remove('no-scroll');
  // };

  // onMount(startOnboarding);
</script>

<svelte:window {onkeydown} {onscroll} />

{#if $story === null || ($story !== null && activeTab === 'Demo')}
  {#if header}
    <header class="flex-row" class:mobile-home-header={header === 'CoNexus'}>
      {#if header === 'CoNexus'}
        <h1 class="sr-only">CoNexus</h1>
        <ConexusLogo />
      {:else if header}
        {#if $prevItem}
          <button
            class="flex-row fade-in blur"
            class:inactive={!$prevItem}
            onclick={() => navigateTo($prevItem)}
            disabled={!$prevItem}
            draggable="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              fill="white"
            >
              <polygon
                points="-75 0 -10 -65 -10 65"
                stroke-width="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <rect x="-30" y="-25" width="100" height="50" rx="5" />
            </svg>
            <p>{$prevItem?.name}</p>
          </button>
        {/if}
        <h1>{header}</h1>
        {#if $nextItem}
          <button
            class="flex-row fade-in blur"
            class:inactive={!$nextItem}
            onclick={() => navigateTo($nextItem)}
            disabled={!$nextItem}
            draggable="false"
          >
            <p>{$nextItem?.name}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              fill="white"
              style:transform="rotate(180deg)"
            >
              <polygon
                points="-75 0 -10 -65 -10 65"
                stroke-width="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <rect x="-30" y="-25" width="100" height="50" rx="5" />
            </svg>
          </button>
        {/if}
      {/if}
    </header>
  {/if}

  {#if showIntro}
    <div class="video-wrapper container fade-in">
      <video class="round" controls autoplay loop muted>
        <source src={`${trailerURL}/CoNexusTrailer.webm`} type="video/webm" />
        <source src={`${trailerURL}/CoNexusTrailer.mp4`} type="video/mp4" />
        <track kind="captions" />
      </video>
      <CloseSVG onclick={() => (showIntro = false)} hider={true} />
    </div>
  {:else if subheading}
    <p
      class="mobile-text-wrapper subheading pad-inline text-shad"
      class:onboarding
    >
      {@html subheading}
      {#if header === 'CoNexus'}
        <span class="intro-wrapper flex" id="intro">
          <PlaySVG
            onclick={() => {
              showIntro = true;
              // if (onboarding) finishOnboarding();
            }}
            text="Watch 30-sec Intro"
            voidBtn={false}
            cta={true}
            color="white"
          />
        </span>
      {/if}
    </p>
  {/if}

  {#if onboarding && header === 'CoNexus'}
    <Onboarding />
  {/if}

  <nav class="flex-row" class:hide={hiddenHeader}>
    <BackArrowPCNav {arrow} />

    <BackArrow href={arrow} hideForPCs={true} />

    <HomeSVG {activeTab} />

    <Profile {activeTab} />
  </nav>
{/if}

<Background />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  header {
    width: 100vw;

    &:not(.mobile-home-header) {
      padding-inline: 1.5rem;
      justify-content: space-between;

      h1 {
        width: 100%;
      }

      button {
        fill: currentColor;
        justify-content: space-between;

        p {
          display: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      @include respond-up(tablet) {
        align-items: flex-start;

        button {
          width: 12.5rem;

          p {
            display: block;
          }
        }
      }
    }

    &.mobile-home-header {
      position: sticky;
      top: 0;
      margin-top: -1.5rem;
      height: 4rem;
      z-index: 100;
      border-bottom: 1px solid $transparent-gray;
      @include dark-blue;

      @include respond-up(small-desktop) {
        display: none;
      }
    }
  }

  .subheading {
    position: relative;
    @include text-shadow;

    .intro-wrapper {
      width: 100%;
      padding-top: 1rem;
    }

    &.onboarding {
      z-index: 1000;
    }

    @include respond-up(small-desktop) {
      width: clamp(20rem, 95%, 80rem);
    }
  }

  .video-wrapper {
    position: relative;
    width: clamp(250px, 95%, 70rem);
    padding: 0;

    video {
      width: 100%;
    }
  }

  nav {
    position: fixed;
    bottom: 0;
    width: 100vw;
    justify-content: space-between;
    gap: 0;
    z-index: 100;
    border-top: 1px solid $transparent-gray;
    @include dark-blue;

    /* PC Styling */

    @include respond-up(small-desktop) {
      width: 100vw;
      top: 0;
      bottom: unset;
      justify-content: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: none;
      transition: transform 0.3s ease;
      @include box-shadow;

      &.hide {
        transform: translateY(-100%);
      }
    }
  }
</style>
