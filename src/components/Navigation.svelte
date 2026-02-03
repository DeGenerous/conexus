<script lang="ts">
  import { onMount, type Component } from 'svelte';

  import { trailerURL } from '@constants/media';
  import { story, game } from '@stores/conexus.svelte';
  import {
    getCurrentUser,
    checkUserRoles,
    checkIfTesterApproved,
  } from '@utils/route-guard';
  import { loadUserbackWidget, clearUserbackUserData } from '@utils/userback';
  import {
    user,
    isAdmin,
    developerMode,
    approvedTester,
  } from '@stores/account.svelte';
  import { showProfile } from '@stores/modal.svelte';
  import { sidebarOpen } from '@stores/navigation.svelte';

  import Profile from '@components/Profile.svelte';
  import Background from '@components/utils/Background.svelte';
  import Breadcrumbs from '@components/Breadcrumbs.svelte';
  import Sidebar from '@components/utils/Sidebar.svelte';
  import Home from '@components/icons/Home.svelte';

  import BookSVG from '@components/icons/Book.svelte';
  import PlaySVG from '@components/icons/Play.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import DreamSVG from '@components/icons/Dream.svelte';
  import GearSVG from '@components/icons/Gear.svelte';
  import GridSVG from '@components/icons/Grid.svelte';

  let {
    header = '',
    subheading = '',
    activeTab = 'Home',
    breadcrumbs = [],
  }: {
    header: string;
    subheading: string;
    activeTab: string;
    breadcrumbs: Breadcrumb[];
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

  // Hardcoded sections for active tab state
  let sections = ['Community Picks', 'Collabs', 'Dischordian Saga'];
  let activeSection = $derived<boolean>(sections.some((s) => s === activeTab));

  // Navigation tabs — defined once, rendered in both top bar and bottom bar
  type NavTab = {
    id: string;
    label: string;
    href: string;
    icon: Component;
    active: boolean;
    visible?: boolean;
  };

  let navItems = $derived<NavTab[]>([
    {
      id: 'Stories',
      label: 'Stories',
      href: '/s/Community%20Picks',
      icon: BookSVG,
      active: activeSection,
    },
    {
      id: 'Dream',
      label: 'Dream',
      href: '/dream',
      icon: DreamSVG,
      active: activeTab === 'Dream',
    },
    {
      id: 'Dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: GridSVG,
      active: activeTab === 'Dashboard',
    },
    {
      id: 'Admin',
      label: 'Admin',
      href: '/admin/users',
      icon: GearSVG,
      active: activeTab === 'Admin',
      visible: $isAdmin,
    },
  ]);

  // Sidebar hover control (desktop dropdown behavior)
  let sidebarTimer: ReturnType<typeof setTimeout> | null = null;

  function openSidebar(event: PointerEvent) {
    if (event.pointerType === 'touch') return;

    if (sidebarTimer) clearTimeout(sidebarTimer);
    $sidebarOpen = true;
  }

  function closeSidebarDelayed(event: PointerEvent) {
    // Don't auto-close on touch - let the user tap links without the menu disappearing
    if (event.pointerType === 'touch') return;

    sidebarTimer = setTimeout(() => {
      $sidebarOpen = false;
    }, 300);
  }

  function toggleSidebar() {
    $sidebarOpen = !$sidebarOpen;
  }

  // PC-Hide
  const clamp = 64; // px after which hiding can kick in

  let lastY = 0;
  let ticking = false;
  const onscroll = (event: Event) => {
    const y = window.scrollY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (y > lastY && y > clamp) {
        hiddenHeader = true;
        $sidebarOpen = false;
      } else if (y < lastY) hiddenHeader = false;
      lastY = y;
      ticking = false;
    });
  };

  let lastUserbackId: string | null = null;

  $effect(() => {
    if (!isDevelopmentEnv && !isTestingEnv) return;
    if (typeof window === 'undefined') return;

    const currentUser = $user;
    if (currentUser) {
      const id = currentUser.id ?? '';
      if (id === lastUserbackId) return;

      const name = currentUser.username || currentUser.first_name || '';
      const email = currentUser.email ?? '';

      lastUserbackId = id || null;
      loadUserbackWidget({
        id,
        info: { name, email },
      });
    } else {
      lastUserbackId = null;
      clearUserbackUserData();
    }
  });
</script>

<svelte:window {onkeypress} {onscroll} />

{#if $story === null}
  <Breadcrumbs items={breadcrumbs} hidden={hiddenHeader} />

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
    <h1 class:sr-only={header === 'CoNexus'}>{header}</h1>
    <p class="mobile-text-wrapper subheading pad-inline text-shad">
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

  <!-- Top bar: logo + desktop nav links + profile trigger -->
  <nav
    class="nav-bar flex-row"
    class:hide={hiddenHeader}
    class:disabled={!$approvedTester}
  >
    <Home />

    {#each navItems.filter((t) => t.visible !== false) as tab (tab.id)}
      <a
        class="navigation-tab pc-only"
        class:active={tab.active}
        class:inactive={!$approvedTester}
        href={tab.href}
        draggable="false"
      >
        <p>{tab.label}</p>
      </a>
    {/each}

    <Profile
      {activeTab}
      expanded={$sidebarOpen}
      onclick={toggleSidebar}
      onpointerenter={openSidebar}
      onpointerleave={closeSidebarDelayed}
    />
  </nav>

  <!-- Mobile bottom bar: nav icons -->
  <nav class="bottom-nav flex-row" class:disabled={!$approvedTester}>
    {#each navItems.filter((t) => t.visible !== false) as tab (tab.id)}
      <a
        class="navigation-tab"
        class:active={tab.active}
        class:inactive={!$approvedTester}
        href={tab.href}
        draggable="false"
      >
        <tab.icon />
        <p>{tab.label}</p>
      </a>
    {/each}
  </nav>

  <Sidebar onpointerenter={openSidebar} onpointerleave={closeSidebarDelayed} />
{/if}

<Background />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .subheading {
    position: relative;
    @include text-shadow;

    .intro-wrapper {
      width: 100%;
      padding-top: 1rem;
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

  .nav-bar {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 4.5rem;
    gap: 0;
    z-index: 100;
    padding-inline: 1rem;
    border-bottom: 1px solid $transparent-gray;
    @include dark-blue;
    transition: transform 0.3s ease;

    &.hide {
      transform: translateY(-100%);
    }

    .pc-only {
      display: none;

      @include respond-up('small-desktop') {
        display: flex;
      }
    }

    @include respond-up(small-desktop) {
      justify-content: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: none;
      @include box-shadow;
    }

    &.disabled {
      cursor: not-allowed;
    }
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    width: 100vw;
    gap: 0;
    z-index: 100;
    border-top: 1px solid $transparent-gray;
    @include dark-blue;

    @include respond-up('small-desktop') {
      display: none;
    }

    &.disabled {
      cursor: not-allowed;
    }
  }
</style>
