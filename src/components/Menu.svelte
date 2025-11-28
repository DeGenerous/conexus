<script lang="ts">
  import CoNexusApp from '@lib/view';

  import MenuTile from '@components/utils/MenuTile.svelte';

  let app: CoNexusApp = new CoNexusApp();

  const menuText: string[] = [
    'A new world of endless possibilities awaits you.',
    'Infinitely unique. Never repeatable.',
  ];

  const prioritizeCommunityPicks = (sections: Section[]): Section[] => {
    const targetIndex = sections.findIndex(
      (section) => section.name === 'Community Picks',
    );

    if (targetIndex <= 0) {
      return sections;
    }

    const reordered = [...sections];
    const [target] = reordered.splice(targetIndex, 1);
    reordered.unshift(target);

    return reordered;
  };
</script>

<section class="container fade-in dark-glowing">
  <h5>{menuText[0]}</h5>

  {#await app.getSections()}
    <div class="flex-row">
      {#each Array(3) as _, index}
        <div class="loading-menu-tile" class:big-menu-tile={index === 0}>
          <div class="loading-animation"></div>
          <span class="loading-animation"></span>
        </div>
      {/each}
    </div>
  {:then sections}
    <div class="flex-row">
      {#each prioritizeCommunityPicks(sections) as section, i (section.id ?? `section-${i}`)}
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
    margin: 0;

    & > div {
      width: 100%;
      flex-wrap: wrap;
      gap: 1rem;
      padding-inline: 0;

      @include respond-up(tablet) {
        flex-wrap: nowrap;
        gap: 1.5rem;
      }
    }
  }
</style>
