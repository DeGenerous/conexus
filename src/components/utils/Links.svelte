<script lang="ts">
  export let section: string = '';
</script>

{#if section == 'Community Picks' || section == 'Dischordian Saga'}
  <section class="blur">
    {#if section == 'Community Picks'}
      <div>
        <h3>Join the community:</h3>
        <a href="https://discord.gg/349FgMSUK8" target="_blank">
          <img src="/icons/discord.png" alt="Discord" />
        </a>
      </div>
    {:else}
      <div>
        <h3>Explore more:</h3>
        <button
          on:click={() => (window.open('https://loredex.degenerousdao.com/', '_blank'))}
        >
          Loredex
        </button>
      </div>
      <div>
        <h3>Influence the storyline:</h3>
        <button
          on:click={() => (window.open('https://governance.degenerousdao.com/', '_blank'))}
        >
          Galactic Governance Hub
        </button>
      </div>
    {/if}
  </section>
{/if}

<style>
  section {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1.5vw;
    background-image: radial-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(51, 226, 230, 0.1)
    );
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.25),
      0 0 0.5vw #010020;
    border-radius: 1.5vw;
    padding: 1.5vw;
  }

  div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1.5vw;
  }

  img {
    height: 3vw;
    border-radius: 10%;
    opacity: 0.85;
  }

  img:hover,
  img:active {
    transform: scale(1.025) translateY(-0.25vw);
    filter: drop-shadow(0 0.25vw 0.25vw #010020);
    opacity: 1;
  }

  @media only screen and (max-width: 600px) {
    section {
      width: 85vw;
      padding: 1em;
      border-radius: 1em;
      gap: 1em;
    }

    div {
      flex-wrap: wrap;
      gap: 0.5em;
    }

    img {
      height: 2em;
    }
  }
</style>