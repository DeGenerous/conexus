<script lang="ts">
  import { NAV_ROUTES } from '@constants/routes';

  import DiscordBtn from '@components/icons/Discord.svelte';

  let { section_name = '' }: { section_name: string } = $props();
</script>

{#if section_name == 'Community Picks' || section_name == 'Dischordian Saga'}
  <section class="transparent-container">
    {#if section_name == 'Community Picks'}
      <div class="flex-row">
        <h5>Join the community:</h5>
        <DiscordBtn />
      </div>
    {:else}
      <div class="flex-row">
        <h5>Explore more:</h5>
        <a class="button-anchor" href={NAV_ROUTES.LOREDEX} target="_blank">
          Loredex
        </a>
      </div>
      <div class="flex-row">
        <h5>Influence the storyline:</h5>
        <a
          class="button-anchor"
          href={NAV_ROUTES.GOVERNANCE_HUB}
          target="_blank"
        >
          Governance Hub
        </a>
      </div>
    {/if}
  </section>
{/if}

<style lang="scss">
  .transparent-container {
    width: auto;

    h5 {
      text-align: right;
    }
  }
</style>
