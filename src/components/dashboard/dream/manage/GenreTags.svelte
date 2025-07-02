<script lang="ts">
  import { CoNexusApp } from '@lib/view';
  import { availableGenres } from '@stores/view.svelte';

  import CloseSVG from '@components/icons/Close.svelte';

  let viewApp = new CoNexusApp();

  let {
    topic,
    handleGenreChange,
  }: {
    topic: ViewTopic;
    handleGenreChange: (
      genreId: number,
      method: 'add' | 'remove',
    ) => Promise<void>;
  } = $props();

  let genres = $state<string[]>([]);
  let newGenre = $state('');

  $effect(() => {
    if (topic && topic.genres && topic.genres.length)
      genres = topic.genres
        .split(',')
        .map((genre: string) => genre.trim())
        .sort();
  });

  $effect(() => {
    viewApp.getGenres().then((genres_) => {
      if (genres_) {
        availableGenres.splice(0, availableGenres.length, ...genres_);
      }
    });
  });

  async function handleRemoveGenre(genreToRemove: string) {
    genres = genres.filter((genre) => genre !== genreToRemove);

    const genre = availableGenres.find((g: Genre) => g.name === genreToRemove);
    if (genre) await handleGenreChange(genre.id, 'remove');
  }

  function handleAddGenre() {
    if (newGenre && !genres.includes(newGenre)) {
      genres = [...genres, newGenre].sort();

      const genre = availableGenres.find((g) => g.name === newGenre);
      if (genre) handleGenreChange(genre.id, 'add');
    }
    newGenre = '';
  }

  function sortByName(a: Genre, b: Genre) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
</script>

<div class="flex-row">
  <h4>Genres</h4>
  <div class="container">
    {#if genres.length > 0}
      {#each genres as genre (genre)}
        <button class="genre void-btn small-tile">
          <p>{genre}</p>
          <CloseSVG
            onclick={() => handleRemoveGenre(genre)}
            voidBtn={true}
            dark={true}
          />
        </button>
      {/each}
    {:else}
      <p class="valigation">No genres selected</p>
    {/if}
  </div>
</div>

<div class="add-genre flex-row">
  <select bind:value={newGenre}>
    <option value="" hidden disabled>Select</option>
    {#each availableGenres
      .filter((g) => !genres.includes(g.name))
      .sort(sortByName) as genre}
      <option value={genre.name}>{genre.name}</option>
    {/each}
  </select>
  <button onclick={handleAddGenre} disabled={!newGenre}>Add Genre</button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    flex-wrap: wrap;
    justify-content: center;

    .genre {
      @include purple;

      &:hover,
      &:active {
        @include purple(1, bg, bright);
      }
    }
  }

  .add-genre {
    justify-content: center;
  }
</style>
