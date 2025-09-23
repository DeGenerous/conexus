<script lang="ts">
  import { onDestroy } from 'svelte';
  import { location } from 'svelte-spa-router';

  // import { NAV_ROUTES }from '@constants/routes';
  import SidebarLink from '@components/dashboard/SidebarLink.svelte';
  import { DASHBOARD_LINKS } from '@components/dashboard/routes';

  import QuitSVG from '@components/icons/Quit.svelte';

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

  const unsubscribe = location.subscribe((value) => {
    activePath = value ?? '';
    close?.();
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

{#if open}
  <div class="sidebar-scrim blur" role="presentation" aria-hidden="true" onclick={close}></div>
{/if}

<aside class="flex pad-24 vert-scrollbar" class:open aria-label="Dashboard navigation">
  <header class="flex-row">
    <QuitSVG onclick={() => (window.location.href = "/")} text="Back to CoNexus" fullWidth={true} />
    <!-- <h4>Dashboard</h4> -->
    <button aria-label="Close navigation" onclick={close}>
      ✕
    </button>
  </header>

  <nav class="flex gap-8">
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

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .sidebar-scrim {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 900;

    @include respond-up(small-desktop) {
      display: none;
    }
  }

  aside {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(85vw, 320px);
    max-width: 320px;
    height: 100dvh;
    top: 0;
    align-items: flex-start;
    justify-content: flex-start;
    padding-inline: 1.5rem;
    background-color: $dark-blue;
    border-right: 1px solid rgba(150, 150, 150, 0.25);
    overflow-y: scroll;
    overscroll-behavior: contain;
    z-index: 1000;
    transform: translateX(-110%);
    transition: transform 0.3s ease;

    &.open {
      transform: translateX(0);
    }

    header {
      width: 100%;
      justify-content: space-between;

      // h4 {
      //   width: 100%;
      //   text-transform: uppercase;
      //   @include cyan(1, text);
      // }
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

    @include respond-up(small-desktop) {
      position: sticky;
      transform: none;

      header button {
        display: none;
      }
    }
  }
</style>
