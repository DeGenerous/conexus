<script lang="ts">
  import SidebarLink from './SidebarLink.svelte';
  import { DASHBOARD_LINKS } from './routes';

  let {
    isAdmin,
    isCreator,
    open,
    close,
  }: {
    isAdmin: boolean;
    isCreator: boolean;
    open: boolean;
    close: () => void;
  } = $props();

  let expanded = $state<Set<string>>(new Set());
  let activePath = $state<string>('');

  function toggleExpand(name: string) {
    const newSet = new Set(expanded);
    newSet.has(name) ? newSet.delete(name) : newSet.add(name);
    expanded = newSet;
  }
</script>

{#if open}
  <div
    role="button"
    class="backdrop"
    aria-label="Close sidebar"
    onclick={close}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') close();
    }}
    tabindex="0"
  ></div>
{/if}

<aside class="sidebar {open ? 'open' : ''}">
  <h2 class="sidebar-title">Dashboard</h2>
  <nav>
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
</aside>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .sidebar {
    width: 250px;
    min-height: 100vh;
    background: rgba(10, 10, 20, 0.95);
    padding: 1.5rem;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .sidebar-title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1rem;
      @include text-glow;
    }
  }

  /* Default: visible */
  .sidebar.open {
    transform: translateX(0);
  }

  /* Small screens: slide in/out */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      transform: translateX(-100%);
      z-index: 1500;
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1400;
    }
  }
</style>
