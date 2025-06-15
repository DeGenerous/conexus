<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { CoNexusApp } from '@lib/view';
  import { availableGenres } from '@stores/view.svelte';

  import CloseSVG from '@components/icons/Close.svelte';

  let viewApp = new CoNexusApp();

  export let topic: ViewTopic;
  export let handleGenreChange = async (
    genreId: number,
    method: 'add' | 'remove',
  ) => {};

  let genres = writable<string[]>([]);
  let newGenre = writable('');

  onMount(() => {
    if (topic && topic.genres && topic.genres.length)
      genres.set(topic.genres.split(',').map((genre: string) => genre.trim()));
  });

  async function handleRemoveGenre(genreToRemove: string) {
    genres.update((prevGenres) =>
      prevGenres.filter((genre) => genre !== genreToRemove),
    );

    const genre = availableGenres.find((g: Genre) => g.name === genreToRemove);
    if (genre) await handleGenreChange(genre.id, 'remove');
  }

  function handleAddGenre() {
    newGenre.update((value) => {
      if (value && !$genres.includes(value)) {
        genres.update((prev) => [...prev, value]);

        const genre = availableGenres.find((g) => g.name === value);
        if (genre) handleGenreChange(genre.id, 'add');
      }
      return '';
    });
  }

  onMount(async () => {
    const genres_ = await viewApp.getGenres();

    if (genres_) {
      availableGenres.splice(0, availableGenres.length, ...genres_);
    }
  });
</script>

<div class="flex-row">
  <h4>Genres</h4>
  <div class="container">
    {#if $genres.length > 0}
      {#each $genres as genre (genre)}
        <span
          class="genre flex-row gap-8 pad-8 round-8 shad"
          role="button"
          tabindex="0"
        >
          <h5>{genre}</h5>
          <CloseSVG
            onclick={() => handleRemoveGenre(genre)}
            voidBtn={true}
            dark={true}
          />
        </span>
      {/each}
    {:else}
      <p class="valigation">No genres selected</p>
    {/if}
  </div>
</div>

<div class="add-genre flex-row">
  <select bind:value={$newGenre}>
    <option value="" hidden disabled>Select</option>
    {#each availableGenres.filter((g) => !$genres.includes(g.name)) as genre}
      <option value={genre.name}>{genre.name}</option>
    {/each}
  </select>
  <button on:click={handleAddGenre} disabled={!$newGenre}>Add Genre</button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    flex-wrap: wrap;
    justify-content: center;

    .genre {
      padding-left: 1rem;
      @include purple;
      @include white-txt;

      &:hover,
      &:active {
        @include dark-red(1, text);
        @include purple(1, bg, bright);
        @include scale-up(soft);
        @include box-shadow(deep);
      }

      h5 {
        color: inherit;
        text-shadow: none;
        text-transform: uppercase;
      }
    }
  }

  .add-genre {
    justify-content: center;
  }
</style>
