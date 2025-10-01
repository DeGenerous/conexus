<script lang="ts">
  import { onMount } from 'svelte';
  import tippy, { type Instance } from 'tippy.js';

  // import CoNexusApp from '@lib/view';
  import { GetCache, SetCache, ONBOARDING_KEY } from '@constants/cache';
  import { trailerURL } from '@constants/media';
  import { NAV_ROUTES } from '@constants/routes';
  import { story, game } from '@stores/conexus.svelte';
  import {
    highlightCommunityPicks,
    navContext,
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
  import { act } from 'react';

  let {
    header = '',
    subheading = '',
    activeTab = 'Home',
    arrow,
    hidden = false,
  }: {
    header: string;
    subheading: string;
    activeTab: string;
    arrow: string;
    hidden?: boolean;
  } = $props();

  // let app: CoNexusApp = new CoNexusApp();

  let hiddenHeader = $state<boolean>(false);
  let showIntro = $state<boolean>(false);
  let onboarding = $state<boolean>(false);
  let sections: string[] = ['Community Picks', 'Collabs', 'Dischordian Saga'];

  const navigateTo = (item: Nullable<NavItem>) => {
    if (!item) return;
    if (item.link) {
      window.location.href = item.link; // or `location.href = item.link`
    } else if (item.action) {
      item.action();
    }
  };

  // onMount(async () => {
  //   sections = await app
  //     .getSections()
  //     .then((data) => data.map(({ id, name }) => name));
  // });

  $effect(() => {
    if (sections.includes(activeTab)) {
      navContext.setContext({
        items: sections.map((name) => ({ name, link: `/s/${name}` })),
        index: sections.indexOf(activeTab),
      });
    }
  });

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

  // ONBOARDING && PC-Hide
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

  let tippyInstance: Instance;
  const startOnboarding = () =>
    setTimeout(() => {
      const isOnboarded = GetCache(ONBOARDING_KEY);
      if (isOnboarded) return;

      onboarding = true;

      // Show the tooltip
      const intro = document.getElementById('intro') as HTMLSpanElement;

      tippyInstance = tippy(intro, {
        content: 'Meet CoNexus in 30 seconds',
        trigger: 'manual',
        placement: 'bottom',
        hideOnClick: false,
      });

      tippyInstance.show();

      // Disable scroll
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setTimeout(() => document.documentElement.classList.add('no-scroll'));
    });

  const finishOnboarding = () => {
    SetCache(ONBOARDING_KEY, true);
    onboarding = false;

    // Update the store to apply highlighted styling
    $highlightCommunityPicks = true;

    // Destroy the tooltip
    tippyInstance.destroy();

    // Enable scroll
    document.documentElement.classList.remove('no-scroll');
  };

  onMount(startOnboarding);
</script>

<svelte:window {onkeydown} {onscroll} />

{#if $story === null && hidden === false}
  {#if header === 'CoNexus'}
    <header class="flex-row">
      <h1 class="sr-only">CoNexus</h1>
      <ConexusLogo />
    </header>
  {:else if header}
    <h1>{header}</h1>
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
              if (onboarding) finishOnboarding();
            }}
            text="Watch 30-sec Intro"
            voidBtn={false}
            glowing={true}
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
    <!-- PREVIOUS SECTION -->
    <!-- <button
      class="void-btn fade-in"
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
    </button> -->

    <BackArrowPCNav {arrow} />
    <!-- {#if arrow} -->
    <BackArrow href={arrow} hideForPCs={true} />
    <!-- {:else}
      <LogoDGRSSVG />
    {/if} -->

    <!-- HOME -->
    <HomeSVG {activeTab} />

    <Profile {activeTab} />

    <!-- NEXT SECTION -->
    <!-- <button
      class="void-btn fade-in"
      class:inactive={!$nextItem}
      onclick={() => navigateTo($nextItem)}
      disabled={!$nextItem}
      draggable="false"
    >
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
      <p>{$nextItem?.name}</p>
    </button> -->
  </nav>
{/if}

<Background />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  header {
    position: sticky;
    top: 0;
    width: 100vw;
    margin-top: -1.5rem;
    height: 4rem;
    z-index: 100;
    border-bottom: 1px solid $transparent-gray;
    @include dark-blue;

    @include respond-up(small-desktop) {
      display: none;
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
    margin-block: 1rem;
    padding: 0;

    @include respond-up(small-desktop) {
      margin-block: 1rem 2rem;
    }

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
