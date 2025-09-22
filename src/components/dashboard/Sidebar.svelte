<script lang="ts">
  import { link } from 'svelte-spa-router';

  import { NAV_ROUTES }from '@constants/routes';
  import SidebarLink from '@components/dashboard/SidebarLink.svelte';
  import {
    DASHBOARD_PATH,
    DASHBOARD_LINKS,
  } from '@components/dashboard/routes';

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
  <a class="sidebar-title" href={DASHBOARD_PATH} use:link tabindex="0">
    Dashboard
  </a>
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
  <div class="sidebar-footer">
    <hr />

    <h4>Report bugs or ask for help</h4>
    <div class="flex-row">
      <a href={NAV_ROUTES.SUPPORT}>Support</a>
      <span style:color="#bebebe">|</span>
      <a href={NAV_ROUTES.DISCORD}>Discord</a>
      <span style:color="#bebebe">|</span>
      <a href={NAV_ROUTES.FAQ}>FAQ</a>
    </div>
  </div>
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
    flex-shrink: 0;

    .sidebar-title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1rem;
      @include text-glow;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 1rem;
      color: #bebebe;

      h4 {
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }

      a {
        color: #ffffff;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }

      .flex-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
    }
  }

  /* Default: visible */
  .sidebar.open {
    transform: none;
  }

  /* Small screens: slide in/out */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
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
