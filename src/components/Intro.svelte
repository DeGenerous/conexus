<script lang="ts">
  import { CoNexusApp } from '@lib/view';
  import { web3LoggedIn } from '@stores/account';

  import MenuTile from './utils/MenuTile.svelte';

  let isWeb3LoggedIn: boolean = false;

  let app: CoNexusApp = new CoNexusApp();

  web3LoggedIn.subscribe((value) => {
    isWeb3LoggedIn = value;
  });

  const menuText: string[] = [
    'A new world with no limits awaits you.',
    'Within CoNexus, you will transcend the boundaries of reality as we know it.',
  ];
</script>

<section class="blur">
  <h3>{menuText[0]}</h3>

  {#await app.getSections()}
    <div class="conexus-menu-tiles loading-conexus-menu-tiles">
      {#each Array(3) as _}
        <div class="menu-tile loading-menu-tile">
          <div class="menu-tile-picture loading-menu-tile-picture loading-animation"></div>
          <p class="menu-tile-title loading-menu-tile-title loading-animation"></p>
        </div>
      {/each}
    </div>
  {:then sections}
    <div class="conexus-menu-tiles">
      {#each sections as section}
        <MenuTile {section} />
      {/each}
    </div>
  {:catch error}
    <p class="validation">Failed to fetch story sections...</p>
    <p class="validation">Error: {error.message}</p>
  {/await}

  <h3>{menuText[1]}</h3>
</section>

<style>
  section {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 2vw;
    padding: 2vw;
    background-color: rgba(1, 0, 32, 0.5);
    border-radius: 1.5vw;
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.25),
      0 0 0.5vw #010020;
  }

  .conexus-menu-tiles {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    gap: 2vw;
  }

  @media only screen and (max-width: 600px) {
    section {
      width: 95%;
      gap: 1em;
      padding: 0.5em;
      border-radius: 1em;
    }

    .conexus-menu-tiles {
      border-radius: 1em;
      gap: 1em;
    }
  }
</style>
