<script lang="ts">
  import { onMount } from 'svelte';

  import CoNexusApp from '@lib/view';
  import { trailerURL } from '@constants/media';
  import { story, game } from '@stores/conexus.svelte';
  import { prevItem, nextItem } from '@stores/navigation.svelte';
  import {
    getCurrentUser,
    checkUserRoles,
    checkIfTesterApproved,
  } from '@utils/route-guard';
  import { user, developerMode, approvedTester } from '@stores/account.svelte';

  import Profile from '@components/Profile.svelte';
  import Background from '@components/utils/Background.svelte';
  import Onboarding from '@components/utils/Onboarding.svelte';

  import HomeSVG from '@components/icons/Home.svelte';
  import BackArrow from '@components/icons/BackArrow.svelte';
  import PlaySVG from '@components/icons/Play.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import ConexusLogo from '@components/icons/ConexusLogo.svelte';

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

  let isDevelopmentEnv = $derived<boolean>(
    import.meta.env.PUBLIC_ENV === 'local' ||
      import.meta.env.PUBLIC_ENV === 'development',
  );

  let isTestingEnv = $derived<boolean>(
    import.meta.env.PUBLIC_ENV === 'testing',
  );

  const initializeUser = async (): Promise<void> => {
    $user = await getCurrentUser();
    if ($user !== null) await checkUserRoles();

    if (isDevelopmentEnv) $developerMode = true;

    if (isTestingEnv) checkIfTesterApproved();
  };

  // Get user and roles on every page load
  onMount(initializeUser);

  let hiddenHeader = $state<boolean>(false);
  let showIntro = $state<boolean>(false);
  let onboarding = $state<boolean>(false);

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

  const onkeypress = (event: KeyboardEvent) => {
    if (event.repeat) return;
    if (event.key === 'f') {
      if (document.activeElement?.tagName === 'BODY')
        game.fullscreen = !game.fullscreen;
    }
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
</script>

<svelte:window {onkeypress} {onscroll} />

{#if $story === null}
  {#if header}
    <header class="flex-row">
    <header class="flex-row">
      {#if header === 'CoNexus'}
        <h1 class="sr-only">CoNexus</h1>
        <ConexusLogo />
      {:else}
        {#if arrow}
          <BackArrow href={arrow} />
        {/if}
        <h1>{header}</h1>
        {#if arrow}
          <BackArrow href={arrow} hidden={true} />
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
            onclick={() => (showIntro = true)}
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

  <nav
    class="flex-row"
    class:hide={hiddenHeader}
    class:disabled={!$approvedTester}
  >
    <HomeSVG {activeTab} />

    <Profile {activeTab} />
  </nav>
{/if}

<Background />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  header {
    width: 100vw;
    padding-inline: 1.5rem;
    padding-inline: 1.5rem;

    h1 {
      width: 100%;
    }

    @include mobile-only {
      height: 4rem;
      position: sticky;
      top: 0;
      justify-content: center;
      justify-content: center;
      margin-top: -1.5rem;
      z-index: 100;
      border-bottom: 1px solid $transparent-gray;
      @include dark-blue;
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

    &.disabled {
      cursor: not-allowed;
    }
  }
</style>
