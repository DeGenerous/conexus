<script lang="ts">
  import { onDestroy } from 'svelte';
  import { location } from 'svelte-spa-router';

  // import { NAV_ROUTES }from '@constants/routes';
  import SidebarLink from '@components/dashboard/SidebarLink.svelte';
  import { DASHBOARD_LINKS } from '@components/dashboard/routes';

  import BurgerSVG from '@components/icons/Burger.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';

  let {
    isAdmin,
    isCreator,
  }: {
    isAdmin: boolean;
    isCreator: boolean;
  } = $props();

  let sidebarOpen = $state<boolean>(false);
  let expanded = $state<Set<string>>(new Set());
  let activePath = $state<string>('');

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function closeSidebar() {
    sidebarOpen = false;
  }

  function hasChildren(link: Linking): link is Linking & { children: Linking[] } {
    return Array.isArray((link as { children?: Linking[] }).children);
  }

  function findParentChain(
    links: Linking[],
    targetPath: string,
    trail: string[] = [],
  ): string[] | null {
    for (const link of links) {
      if ('path' in link && link.path === targetPath) {
        return trail;
      }

      if (hasChildren(link)) {
        const nextTrail = [...trail, link.name];
        const result = findParentChain(link.children, targetPath, nextTrail);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  function ensureExpandedForPath(path: string) {
    const chain = findParentChain(DASHBOARD_LINKS, path);
    if (!chain || chain.length === 0) {
      return;
    }

    const next = new Set(expanded);
    let changed = false;

    for (const name of chain) {
      if (!next.has(name)) {
        next.add(name);
        changed = true;
      }
    }

    if (changed) {
      expanded = next;
    }
  }

  function sanitizePath(path: string | null | undefined): string {
    if (!path) {
      return '';
    }

    const withoutHash = path.split('#')[0];
    const [clean] = withoutHash.split('?');
    return clean ?? '';
  }

  const unsubscribe = location.subscribe((value) => {
    const nextPath = sanitizePath(value);
    activePath = nextPath;
    ensureExpandedForPath(nextPath);
    closeSidebar();
  });

  onDestroy(() => {
    unsubscribe();
  });

  function toggleExpand(name: string) {
    const next = new Set(expanded);
    next.has(name) ? next.delete(name) : next.add(name);
    expanded = next;
  }
</script>

{#if sidebarOpen}
  <div
    class="sidebar-scrim blur fade-in"
    role="presentation"
    aria-hidden="true"
    onclick={closeSidebar}
  ></div>
{/if}

<section
  class:open={sidebarOpen}
  aria-label="Dashboard navigation"
>
  <button
    class="flex void-btn pad-8"
    aria-label="Toggle navigation"
    aria-controls="dashboard-sidebar"
    aria-expanded={sidebarOpen}
    onclick={toggleSidebar}
  >
    <BurgerSVG expanded={sidebarOpen} />
  </button>

  <aside class="flex pad-24 vert-scrollbar">
    <header class="flex-row">
      <QuitSVG onclick={() => (window.location.href = "/")} text="Back to CoNexus" fullWidth={true} />
      <!-- <h4>Dashboard</h4> -->
      <!-- <button aria-label="Close navigation" onclick={close}>
        ✕
      </button> -->
    </header>

    <nav class="flex gap-8">
      <SidebarLink
        {isAdmin}
        {isCreator}
        item={{
          name: 'Dashboard',
          path: '/dashboard',
        }}
        {expanded}
        {toggleExpand}
        {activePath}
      />
      {#each DASHBOARD_LINKS as item}
        <SidebarLink
          {isAdmin}
          {isCreator}
          {item}
          {expanded}
          {toggleExpand}
          {activePath}
        />
      {/each}
    </nav>

    <!-- <footer>
      <hr />
      <p>Report bugs or ask for help</p>
      <div>
        <a href={NAV_ROUTES.SUPPORT}>Support</a>
        <span aria-hidden="true">|</span>
        <a href={NAV_ROUTES.DISCORD}>Discord</a>
        <span aria-hidden="true">|</span>
        <a href={NAV_ROUTES.FAQ}>FAQ</a>
      </div>
    </footer> -->
  </aside>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .sidebar-scrim {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 900;
    transform: none !important;

    @include respond-up(small-desktop) {
      display: none;
    }
  }

  section {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(85vw, 320px);
    max-width: 320px;
    height: 100dvh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &.open {
      transform: translateX(0);
    }

    button {
      position: absolute;
      left: calc(100% - 1px);
      border-right: 1px solid rgba(150, 150, 150, 0.25);
      border-bottom: 1px solid rgba(150, 150, 150, 0.25);
      border-bottom-right-radius: 1rem;
      @include dark-blue;
    }

    aside {
      width: 100%;
      height: 100%;
      align-items: flex-start;
      justify-content: flex-start;
      padding-inline: 1.5rem;
      background-color: $dark-blue;
      border-right: 1px solid rgba(150, 150, 150, 0.25);
      overflow-y: scroll;
      overscroll-behavior: contain;

      header {
        width: 100%;
        justify-content: space-between;
      }

      nav {
        width: 100%;
        align-items: stretch;
      }

      // footer {
      //   margin-top: auto;
      //   color: #bebebe;

      //   div {
      //     display: flex;
      //     align-items: center;
      //     justify-content: center;
      //     gap: 0.5rem;

      //     a {
      //       color: #ffffff;
      //       text-decoration: none;

      //       &:hover {
      //         text-decoration: underline;
      //       }
      //     }
      //   }
      // }
    }

    @include respond-up(small-desktop) {
      transform: none;

      button {
        display: none;
      }
    }
  }
</style>
