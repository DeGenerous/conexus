<script lang="ts">
  import Profile from '../Profile.svelte';
  import { authenticated } from '@stores/account';

  export let activeTab: string = 'Home';

  $: admin = $authenticated.user?.role;
</script>

<nav>
  <a
    class="circle-icon"
    href="https://degenerousdao.com/"
    target="_blank"
    aria-label="DeGenerous"
  >
    <img class="logo" src="/logo.avif" alt="Logo" />
  </a>

  <section>
    {#if activeTab !== 'Home'}
      <a href="/">Home</a>
      <a class:active={activeTab === 'Community Picks'} href="/Community Picks">Community Picks</a>
      <a class:active={activeTab === 'Collabs'} href="/Collabs">Collabs</a>
      <a class:active={activeTab === 'Dischordian Saga'} href="/Dischordian Saga">Dischordian Saga</a>
    {/if}
    {#if admin}
      <a class:active={activeTab === 'Dashboard'} href="/dashboard">Dashboard</a>
      <a class:active={activeTab === 'Dream'} href="/dashboard/dream">Dream</a>
    {/if}
  </section>

  <Profile />
</nav>

<style>
  nav {
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1vw;
    padding-bottom: 0;
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

  @media only screen and (max-width: 600px) {
    nav {
      padding: 1em;
    }

    section {
      display: none;
    }
  }
</style>