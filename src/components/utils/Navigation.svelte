<script lang="ts">
  import { authenticated } from '@stores/account';
  import BackArrow from '@components/utils/BackArrow.svelte';
  import Profile from '@components/Profile.svelte';

  export let activeTab: string = 'Home';
  export let arrow: Nullable<string> = null;

  $: admin = $authenticated.user?.role === 'admin';

  const sections: string[] = ['Community Picks', 'Collabs', 'Dischordian Saga'];

  $: activeSectionIndex = sections.indexOf(activeTab);
  $: prevSectionIndex =
    activeSectionIndex == 0 ? sections.length - 1 : activeSectionIndex - 1;

  const navigateHome = () => {
    window.open('/', '_self');
  };

  const navigateDashboard = () => {
    window.open('/dashboard', '_self');
  };

  const navigateDream = () => {
    window.open('/dashboard/dream', '_self');
  };

  const navigateBackSection = () => {
    if (!sections.includes(activeTab)) return;
    window.open(`/sections/${sections[prevSectionIndex]}`, '_self');
  };

  const navigateNextSection = () => {
    if (!sections.includes(activeTab)) return;
    window.open(
      `/sections/${sections[(activeSectionIndex + 1) % sections.length]}`,
      '_self',
    );
  };
</script>

<nav class="top-navigation flex pad">
  {#if arrow}
    <BackArrow href={arrow} />
  {:else}
    <a
      class="flex fade-in"
      href="https://degenerousdao.com/"
      target="_blank"
      aria-label="DeGenerous"
    >
      <img src="/logo.avif" alt="Logo" />
    </a>
  {/if}

  <section class="flex">
    {#if activeTab !== 'Home'}
      <a href="/">Home</a>
      <a
        class:active={activeTab === 'Community Picks'}
        href="/sections/Community Picks">Community Picks</a
      >
      <a class:active={activeTab === 'Collabs'} href="/sections/Collabs"
        >Collabs</a
      >
      <a
        class:active={activeTab === 'Dischordian Saga'}
        href="/sections/Dischordian Saga">Dischordian Saga</a
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
<nav class="bottom-navigation flex blur dark-semi-transparent-bg shad-behind">
  <!-- PREVIOUS SECTION -->
  <span
    class:inactive={!sections.includes(activeTab)}
    on:click={navigateBackSection}
    role="button"
    tabindex="0"
  >
    <img src="/icons/switch-arrow.svg" alt="Switch" />
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
      <img src="/icons/dashboard.svg" alt="Switch" />
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
    <img class="home" src="/icons/home.svg" alt="Home" />
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
      <img src="/icons/dream.svg" alt="Dream" />
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

<style lang="scss">
  @use "/src/styles/mixins" as *;

  .top-navigation {
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 0;

    & > a {
      width: 4rem;

      &:hover,
      &:active,
      &:focus {
        @include scale;
        @include bright;
      }
    }

    section {
      display: none;
      flex-direction: row;

      @include respond-up(small-desktop) {
        display: flex;
      }

      a:not(a:hover, a:active, a:focus) {
        @include cyan(0.5, text);

        // Fallback if no support
        opacity: 1;
        transform: none;

        @starting-style {
          opacity: 0;
          transform: scale(0.9, 0);
        }
      }
    }
  }

  .bottom-navigation {
    position: fixed;
    bottom: 0;
    width: 100vw;
    flex-direction: row;
    justify-content: space-between;
    z-index: 100;

    @media (orientation: landscape) {
      display: none;

      @include respond-up(tablet) {
        display: flex;
      }

      @include respond-up(small-desktop) {
        display: none;
      }
    }

    span {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      opacity: 0.5;

      &.active {
        opacity: 1;
      }

      &.inactive {
        opacity: 0.15;
      }

      img {
        height: 2.75rem;
        width: auto;
      }

      p {
        @include font(caption);
        @include white-txt;
      }
    }
  }
</style>
