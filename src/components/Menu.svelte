<script lang="ts">
  import { onMount } from 'svelte';
  import { onMount } from 'svelte';
  import CoNexusApp from '@lib/view';
  import { checkIfTesterApproved } from '@utils/route-guard';
  import { checkIfTesterApproved } from '@utils/route-guard';

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


  let sections = $state<Section[]>([]);
  let sectionsLoading = $state<boolean>(true);
  let sectionError = $state<string>('');

  let isTestingEnv = $derived<boolean>(
    import.meta.env.PUBLIC_ENV === 'testing',
  );

  onMount(async () => {
    try {
      if (isTestingEnv) checkIfTesterApproved();
      sections = await app.getSections();
    } catch (error) {
      sectionError = (error as Error).message;
    } finally {
      sectionsLoading = false;
    }
  });

  let sections = $state<Section[]>([]);
  let sectionsLoading = $state<boolean>(true);
  let sectionError = $state<string>('');

  let isTestingEnv = $derived<boolean>(
    import.meta.env.PUBLIC_ENV === 'testing',
  );

  onMount(async () => {
    try {
      if (isTestingEnv) checkIfTesterApproved();
      sections = await app.getSections();
    } catch (error) {
      sectionError = (error as Error).message;
    } finally {
      sectionsLoading = false;
    }
  });
</script>

<section class="container fade-in dark-glowing">
  <h5>{menuText[0]}</h5>

  {#if sectionsLoading}
    <div class="flex-row">
      {#each Array(3) as _, index}
        <div class="loading-menu-tile" class:big-menu-tile={index === 0}>
          <div class="loading-animation"></div>
          <span class="loading-animation"></span>
        </div>
      {/each}
    </div>
  {:else if sectionError}
    <p class="validation">Failed to fetch story sections...</p>
    <p class="validation">Error: {sectionError}</p>
  {:else}
    <div class="flex-row">
      {#each prioritizeCommunityPicks(sections) as section, i (section.id ?? `section-${i}`)}
        <MenuTile {section} />
      {/each}
    </div>
  {/if}

  <h5>{menuText[1]}</h5>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section.container {
    width: 95%;
    max-width: unset;
    margin: 0;

    & > div {
      width: 100%;
      flex-wrap: wrap;
      gap: 1rem;

      @include respond-up(tablet) {
        flex-wrap: nowrap;
        gap: 1.5rem;
      }
    }

    @include respond-up(large-desktop) {
      width: 78rem;
    }

    @include respond-up(large-desktop) {
      width: 78rem;
    }
  }
</style>
