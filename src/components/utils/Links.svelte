<script lang="ts">
  import DiscordBtn from '@components/icons/Discord.svelte';

  let { section = '' }: { section: string } = $props();
</script>

{#if section == 'Community Picks' || section == 'Dischordian Saga'}
  <section
    class="flex pad mar-inline round blur shad-inset-glow transparent-glowing"
  >
    {#if section == 'Community Picks'}
      <div class="flex-row">
        <h5>Join the community:</h5>
        <DiscordBtn />
      </div>
    {:else}
      <div class="flex-row">
        <h5>Explore more:</h5>
        <button
          onclick={() =>
            window.open('https://loredex.dgrslabs.ink/', '_blank')}
        >
          Loredex
        </button>
      </div>
      <div class="flex-row">
        <h5>Influence the storyline:</h5>
        <button
          onclick={() =>
            window.open('https://governance.dgrslabs.ink/', '_blank')}
        >
          Governance Hub
        </button>
      </div>
    {/if}
  </section>
{/if}

<style>
  h5 {
    text-align: right;
  }
</style>
