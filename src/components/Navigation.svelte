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
  import BackArrowPCNav from './utils/BackArrowPCNav.svelte';

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

  // ONBOARDING

  const onscroll = (event: Event) => {
    if (onboarding) event.preventDefault();
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
  <!-- <header
    class="flex-row pad-inline blur transition semi-transparent-dark-bg shad-behind dark-glowing-opaque"
  >
    {#if arrow}
      <BackArrow href={arrow} />
    {:else}
      <LogoSVG />
    {/if}

    <h1 class:sr-only={header === 'CoNexus'}>{header}</h1>

    <Profile />
  </header> -->

  <!-- {#if showIntro}
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
  {:else}
    <div class="empty-subheading"></div>
  {/if} -->

  <!-- {#if onboarding && header === 'CoNexus'}
    <Onboarding />
  {/if} -->

  <nav class="flex-row">
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

  /* MOBILE Styling */

  // header {
  //   margin-top: 4rem;
  //   min-height: 4rem;
  //   position: fixed;
  //   top: 0;
  //   width: 100vw;
  //   justify-content: space-between;
  //   gap: 1.5rem;
  //   z-index: 100;

  //   @include respond-up(small-desktop) {
  //     position: static;
  //     width: auto;
  //     justify-content: center;
  //     min-height: unset;
  //     background-color: transparent !important;
  //     backdrop-filter: none !important;
  //     -webkit-backdrop-filter: none;
  //     box-shadow: none;
  //   }

  //   h1 {
  //     text-transform: capitalize;
  //     @include text-shadow;
  //   }
  // }

  // .subheading {
  //   position: relative;
  //   margin: 1rem auto;
  //   @include text-shadow;

  //   .intro-wrapper {
  //     width: 100%;
  //     padding-top: 1rem;
  //   }

  //   &.onboarding {
  //     z-index: 1000;
  //   }

  //   @include respond-up(small-desktop) {
  //     width: clamp(20rem, 95%, 80rem);
  //     margin-block: 1rem 2rem;
  //   }
  // }

  // .empty-subheading {
  //   height: 1rem;
  // }

  // .video-wrapper {
  //   position: relative;
  //   width: clamp(250px, 95%, 70rem);
  //   margin-block: 1rem;
  //   padding: 0;

  //   @include respond-up(small-desktop) {
  //     margin-block: 1rem 2rem;
  //   }

  //   video {
  //     width: 100%;
  //   }
  // }

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
      @include box-shadow;
    }
  }
</style>
