<script lang="ts">
  import { onMount } from 'svelte';

  import Authentication from '@lib/authentication.ts';
  import { DASHBOARD_LINKS } from '@components/dashboard/routes';
  import { sidebarOpen } from '@stores/navigation.svelte';

  import SidebarLink from '@components/utils/SidebarLink.svelte';
  import DoorSVG from '@components/icons/Door.svelte';

  const authentication: Authentication = new Authentication();

  let expanded = $state<Set<string>>(new Set());
  let activePath = $state<string>(
    typeof window !== 'undefined' ? window.location.pathname : '',
  );

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

  onMount(() => {
    ensureExpandedForPath(activePath);

    const handler = () => {
      activePath = window.location.pathname;
      ensureExpandedForPath(activePath);
    };

    document.addEventListener('astro:page-load', handler);
    return () => document.removeEventListener('astro:page-load', handler);
  });

  function toggleExpand(name: string) {
    const next = new Set(expanded);
    next.has(name) ? next.delete(name) : next.add(name);
    expanded = next;
  }
</script>

{#if $sidebarOpen}
  <div
    class="sidebar-scrim blur fade-in"
    role="presentation"
    aria-hidden="true"
    onclick={() => ($sidebarOpen = false)}
  ></div>
{/if}

<section class:open={$sidebarOpen} aria-label="Dashboard navigation">
  <nav class="flex gap-8 vert-scrollbar">
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
    z-index: 98;
    transform: none !important;

    @include respond-up(small-desktop) {
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }

  section {
    position: fixed;
    inset: 0;
    top: 4.5rem;
    width: 100%;
    height: 60dvh;
    z-index: 99;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    border-bottom: 1px solid $transparent-gray;

    &.open {
      transform: translateY(0);
    }

    nav {
      width: 100%;
      height: 100%;
      align-items: stretch;
      justify-content: flex-start;
      padding: 0.5rem 1.5rem;
      background-color: $dark-blue;
      border-right: 1px solid $transparent-gray;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    @include respond-up(small-desktop) {
      inset: unset;
      transform: translateX(100%);
      right: 0;
      top: 4.5rem;
      height: 100dvh;
      width: 320px;
      border-bottom: none;

      &.open {
        transform: translateX(0);
      }

      nav {
        padding-bottom: 6rem;
        border: none;
        box-shadow: 0.1rem 0 0.25rem rgba(0, 0, 0, 0.75);
      }
    }
  }
</style>
