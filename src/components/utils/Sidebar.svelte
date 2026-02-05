<script lang="ts">
  import { onMount } from 'svelte';

  import Authentication from '@lib/authentication.ts';
  import { user } from '@stores/account.svelte';
  import { sidebarOpen } from '@stores/navigation.svelte';
  import { showProfile } from '@stores/modal.svelte';

  import { modal } from '@lib/modal-manager.svelte';

  import SidebarLink from '@components/utils/SidebarLink.svelte';
  import DoorSVG from '@components/icons/Door.svelte';

  let {
    onpointerenter,
    onpointerleave,
  }: {
    onpointerenter?: (event: PointerEvent) => void;
    onpointerleave?: (event: PointerEvent) => void;
  } = $props();

  const authentication: Authentication = new Authentication();

  const hasMainWallet = () =>
    Boolean($user?.wallets?.filter((wallet) => !wallet.faux).length);

  let profilePath = $user ? `/c/${$user?.username ?? 'unknown'}` : '/dashboard';

  function isComponentItem(item: SidebarItem): item is SidebarComponentItem {
    return 'id' in item && 'component' in item;
  }

  const sidebarItems: SidebarItem[] = [
    {
      name: 'My Profile',
      intended: 'all',
      path: profilePath,
    },
    {
      name: 'Collections',
      intended: 'player',
      path: '/dashboard/collections',
    },
    {
      name: 'Bookmarks',
      intended: 'all',
      path: '/dashboard/bookmarks',
    },
    {
      name: 'Account',
      intended: 'all',
      path: '/dashboard/account',
    },
    {
      name: 'Preferences',
      intended: 'all',
      path: '/dashboard/preferences',
    },
    {
      name: 'Settings',
      intended: 'all',
      onclick: () => modal.topicSettings(),
    },
    {
      name: 'OmniHub',
      path: '/dashboard/omnihub',
      display: hasMainWallet,
    },
    {
      name: 'Admin',
      intended: 'admin',
      children: [
        {
          name: 'Users',
          path: '/admin/users',
        },
        {
          name: 'Stories',
          path: '/admin/stories',
        },
        {
          name: 'Web3',
          path: '/admin/web3',
        },
      ],
    },
    {
      id: 'sign-out',
      component: DoorSVG,
      props: {
        state: 'outside',
        text: 'Sign Out',
        onclick: () => authentication.logout(),
        voidBtn: true,
      },
    },
  ];

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
    const linkItems = sidebarItems.filter(
      (item): item is Linking => !isComponentItem(item),
    );
    const chain = findParentChain(linkItems, path);
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
    class="sidebar-scrim fade-in"
    role="presentation"
    aria-hidden="true"
    onclick={() => ($sidebarOpen = false)}
  ></div>
{/if}

<section
  class="flex gap-8 vert-scrollbar"
  class:open={$sidebarOpen}
  aria-label="Dashboard navigation"
  {onpointerenter}
  {onpointerleave}
>
  {#if $user}
    {#each sidebarItems as item}
      {#if isComponentItem(item)}
        <item.component {...item.props} />
      {:else}
        <SidebarLink {item} {expanded} {toggleExpand} {activePath} />
      {/if}
    {/each}
  {:else}
    <DoorSVG
      state="inside"
      text="Sign In"
      onclick={() => {
        $showProfile = true;
      }}
      voidBtn={true}
    />
  {/if}
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
      display: none;
    }
  }

  section {
    position: fixed;
    top: 4.5rem;
    left: 0;
    right: 0;
    max-height: 60dvh;
    width: 100%;
    align-items: stretch;
    justify-content: flex-start;
    padding: 0.5rem 1.5rem;
    background-color: $dark-blue;
    overflow-y: auto;
    overscroll-behavior: contain;
    z-index: 99;
    opacity: 0;
    transform: translateY(-100%);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease,
      visibility 0.3s ease;

    &.open {
      opacity: 1;
      transform: translateY(0);
    }

    @include respond-up(small-desktop) {
      left: unset;
      width: auto;
      min-width: 220px;
      max-height: 80vh;
      padding: 1rem;
      border-bottom-left-radius: 1rem;
      transform: translateX(100%);
      @include box-shadow;

      &.open {
        transform: translateX(0);
      }
    }
  }
</style>
