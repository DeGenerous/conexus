<script lang="ts">
  import { CoNexus } from '@lib/conexus';
  import { web3LoggedIn } from '@stores/account';

  import MenuTile from './MenuTile.svelte';

  let isWeb3LoggedIn: boolean = false;

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

  {#await CoNexus.sections()}
    <p class="validation green">Loading story sections...</p>
  {:then sections}
    <div class="conexus-menu-tiles">
      {#each sections as section}
        <MenuTile {section} />
      {/each}
    </div>
  {:catch error}
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
