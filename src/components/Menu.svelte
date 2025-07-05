<script lang="ts">
  import CoNexusApp from '@lib/view';

  import MenuTile from '@components/utils/MenuTile.svelte';

  let app: CoNexusApp = new CoNexusApp();

  const menuText: string[] = [
    'A new world of endless possibilities awaits you.',
    'Infinitely unique. Never repeatable.',
  ];
</script>

<section
  class="flex blur pad round transparent-dark-bg shad-inset-glow fade-in dark-glowing"
>
  <h5>{menuText[0]}</h5>

  {#await app.getSections()}
    <div class="flex-row">
      {#each Array(3) as _}
        <div class="loading-menu-tile">
          <div class="loading-animation"></div>
          <span class="loading-animation"></span>
        </div>
      {/each}
    </div>
  {:then sections}
    <div class="flex-row">
      {#each sections as section (section.id)}
        <MenuTile {section} />
      {/each}
    </div>
  {:catch error}
    <p class="validation">Failed to fetch story sections...</p>
    <p class="validation">Error: {error.message}</p>
  {/await}

  <h5>{menuText[1]}</h5>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    width: clamp(250px, 95%, 80rem);

    & > div {
      width: 100%;
      flex-wrap: wrap;
      padding-inline: 0;
    }
  }

  @include respond-up(tablet) {
    section {
      width: auto;

      & > div {
        padding-inline: 1rem;
      }
    }
  }
</style>
