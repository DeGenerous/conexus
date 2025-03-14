<script lang="ts">
  import { authenticated } from '@stores/account';
  import BackArrow from './BackArrow.svelte';
  import Profile from '../Profile.svelte';

  export let activeTab: string = 'Home';
  export let arrow: Nullable<string> = null;

  $: admin = $authenticated.user?.role;

  const sections: string[] = ['Community Picks', 'Collabs', 'Dischordian Saga'];

  $: activeSectionIndex = sections.indexOf(activeTab);
  $: prevSectionIndex = activeSectionIndex == 0 ? sections.length - 1 : activeSectionIndex - 1;

  const navigateHome = () => {
    window.open('/', '_self');
  }

  const navigateDashboard = () => {
    window.open('/dashboard', '_self');
  }

  const navigateDream = () => {
    window.open('/dashboard/dream', '_self');
  }

  const navigateBackSection = () => {
    if (!sections.includes(activeTab)) return;
    window.open(`/${sections[prevSectionIndex]}`, '_self');
  }

  const navigateNextSection = () => {
    if (!sections.includes(activeTab)) return;
    window.open(`/${sections[(activeSectionIndex + 1) % sections.length]}`, '_self');
  }
</script>

<nav>
  {#if arrow}
    <BackArrow href={arrow} />
  {:else}
    <a
      class="circle-icon"
      href="https://degenerousdao.com/"
      target="_blank"
      aria-label="DeGenerous"
    >
      <img class="logo" src="/logo.avif" alt="Logo" />
    </a>
  {/if}

  <section>
    {#if activeTab !== 'Home'}
      <a href="/">Home</a>
      <a class:active={activeTab === 'Community Picks'} href="/Community Picks"
        >Community Picks</a
      >
      <a class:active={activeTab === 'Collabs'} href="/Collabs">Collabs</a>
      <a
        class:active={activeTab === 'Dischordian Saga'}
        href="/Dischordian Saga">Dischordian Saga</a
      >
    {/if}
    {#if admin}
      <a class:active={activeTab === 'Dashboard'} href="/dashboard">Dashboard</a
      >
      <a class:active={activeTab === 'Dream'} href="/dashboard/dream">Dream</a>
    {/if}
  </section>

  <Profile />
</nav>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<nav class="mobile-navigation blur">
  <!-- PREVIOUS SECTION -->
  <span
    class:inactive={!sections.includes(activeTab)}
    on:click={navigateBackSection}
    role="button"
    tabindex="0"
  >
    <img
      src="/icons/switch-arrow.svg"
      alt="Switch"
    />
    {#if sections.includes(activeTab)}
      <p>{sections[prevSectionIndex]}</p>
    {/if}
  </span>

  <!-- Dashboard -->
  {#if admin}
    <span
      class:active={activeTab === 'Dashboard'}
      on:click={navigateDashboard}
      role="button"
      tabindex="0"
    >
      <img
        src="/icons/dashboard.svg"
        alt="Switch"
      />
      <p>Dashboard</p>
    </span>
  {/if}

  <!-- HOME -->
  <span
    class:active={activeTab === 'Home'}
    on:click={navigateHome}
    role="button"
    tabindex="0"
  >
    <img
      class="home"
      src="/icons/home.svg"
      alt="Home"
    />
    <p>Home</p>
  </span>

  <!-- DREAM -->
  {#if admin}
    <span
      class:active={activeTab === 'Dream'}
      on:click={navigateDream}
      role="button"
      tabindex="0"
    >
      <img
        src="/icons/dream.svg"
        alt="Dream"
      />
      <p>Dream</p>
    </span>
  {/if}

  <!-- NEXT SECTION -->
  <span
    class:inactive={!sections.includes(activeTab)}
    on:click={navigateNextSection}
    role="button"
    tabindex="0"
  >
    <img
      src="/icons/switch-arrow.svg"
      alt="Switch"
      style="transform: rotate(180deg)"
    />
    {#if sections.includes(activeTab)}
      <p>{sections[(activeSectionIndex + 1) % sections.length]}</p>
    {/if}
  </span>
</nav>

<style>
  nav {
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1vw;
    padding-bottom: 0 !important;
  }

  section {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 2vw;
  }

  a {
    color: rgba(51, 226, 230, 0.5);
  }

  a:hover,
  a:active {
    color: rgb(51, 226, 230);
  }

  .active {
    color: rgb(51, 226, 230);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
  }

  .logo {
    cursor: inherit;
    border-radius: inherit;
    opacity: 0.7;
    transition: all 0.3s ease-in-out;
  }

  .logo:hover,
  .logo:active {
    opacity: 1;
    transform: scale(1.05);
  }

  .mobile-navigation {
    display: none;
  }

  @media only screen and (max-width: 600px) {
    :global(html) {
      padding-bottom: calc(20vw + 1em) !important;
    }

    nav {
      padding: 1em;
    }

    section {
      display: none;
    }

    .mobile-navigation {
      position: fixed;
      bottom: 0;
      height: 15vw;
      width: 100vw;
      padding: 0;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      background-color: rgba(1, 0, 32, 0.75);
      box-shadow: 0 -0.25vw 0.5vw #010020;
      z-index: 2;
    }

    .mobile-navigation span {
      min-width: 15vw;
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      opacity: 0.5;
    }

    .mobile-navigation p {
      font-size: 0.65em;
      line-height: 1em;
      color: white;
      text-align: center;
    }

    .mobile-navigation img {
      height: 60%;
      width: auto;
    }

    .active {
      opacity: 1 !important;
    }

    .inactive {
      opacity: 0.15 !important;
    }

    .mobile-navigation span:hover,
    .mobile-navigation span:active {
      opacity: 1;
      background-color: rgba(51, 226, 230, 0.1);
    }
  }
</style>
