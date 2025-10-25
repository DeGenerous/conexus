<script lang="ts">
  import { onDestroy } from 'svelte';
  import { location } from 'svelte-spa-router';

  import Authentication from '@lib/authentication.ts';
  import { DASHBOARD_LINKS } from '@components/dashboard/routes';

  import SidebarLink from '@components/dashboard/SidebarLink.svelte';
  import BurgerSVG from '@components/icons/Burger.svelte';
  import DoorSVG from '@components/icons/Door.svelte';

  const authentication: Authentication = new Authentication();

  let sidebarOpen = $state<boolean>(false);
  let expanded = $state<Set<string>>(new Set());
  let activePath = $state<string>('');

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function closeSidebar() {
    sidebarOpen = false;
  }

  function hasChildren(
    link: Linking,
  ): link is Linking & { children: Linking[] } {
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

<section class:open={sidebarOpen} aria-label="Dashboard navigation">
  <button
    class="flex void-btn pad-8"
    aria-label="Toggle navigation"
    aria-controls="dashboard-sidebar"
    aria-expanded={sidebarOpen}
    onclick={toggleSidebar}
  >
    <BurgerSVG expanded={sidebarOpen} />
  </button>

  <nav class="flex gap-8">
    <SidebarLink
      item={{
        name: 'Dashboard',
        path: '/dashboard',
      }}
      {expanded}
      {toggleExpand}
      {activePath}
    />
    {#each DASHBOARD_LINKS as item}
      <SidebarLink {item} {expanded} {toggleExpand} {activePath} />
    {/each}
    <DoorSVG
      state="outside"
      text="Sign Out"
      onclick={() => authentication.logout()}
      voidBtn={true}
    />
  </nav>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .sidebar-scrim {
    position: fixed;
    inset: 0;
    background: $transparent-black;
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
      border-right: 1px solid $transparent-gray;
      border-bottom: 1px solid $transparent-gray;
      border-bottom-right-radius: 1rem;
      @include dark-blue;
    }

    nav {
      width: 100%;
      height: 100%;
      align-items: stretch;
      justify-content: flex-start;
      padding: 0.5rem 1.5rem;
      background-color: $dark-blue;
      border-right: 1px solid $transparent-gray;
      overflow-y: scroll;
      overscroll-behavior: contain;
    }

    @include respond-up(small-desktop) {
      transform: none;
      top: 4.5rem;
      height: calc(100dvh - 4.5rem);

      button {
        display: none;
      }

      nav {
        padding: 0 1.5rem;
        padding-bottom: 1.5rem;
        border: none;
        box-shadow: 0.1rem 0 0.25rem rgba(0, 0, 0, 0.75);
      }
    }
  }
</style>
