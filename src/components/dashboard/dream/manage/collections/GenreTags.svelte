<script lang="ts">
  import AppView from '@lib/view';
  import { availableGenres } from '@stores/view.svelte';

  import CloseSVG from '@components/icons/Close.svelte';

  let viewApp = new AppView();

  let {
    topic_genres,
    handleGenreChange,
  }: {
    topic_genres: TopicGenre[] | null;
    handleGenreChange: (
      genreId: string,
      method: 'add' | 'remove',
    ) => Promise<void>;
  } = $props();

  let newGenreId = $state('');

  $effect(() => {
    topic_genres = topic_genres ? topic_genres.sort(sortByName) : null;
  });

  $effect(() => {
    viewApp.getGenres().then((genres_) => {
      if (genres_) {
        availableGenres.splice(0, availableGenres.length, ...genres_);
      }
    });
  });

  async function handleRemoveGenre(name: string) {
    try {
      const genre = availableGenres.find((g: Genre) => g.name === name);
      if (genre && genre.id) await handleGenreChange(genre.id, 'remove');
    } catch (error) {
      console.error('Error removing genre:', error);
    }
  }

  async function handleAddGenre() {
    if (newGenreId === '') return;

    if (topic_genres?.some((tg) => tg.id === newGenreId)) {
      return;
    }

    try {
      await handleGenreChange(newGenreId, 'add');
    } catch (error) {
      console.error('Error adding genre:', error);
    } finally {
      newGenreId = '';
    }
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
    {#if topic_genres && topic_genres.length > 0}
      {#each topic_genres as genre (genre)}
        <button class="void-btn small-purple-tile">
          <p>{genre.name}</p>
          <CloseSVG
            onclick={() => handleRemoveGenre(genre.name)}
            voidBtn={true}
            dark={true}
          />
        </button>
      {/each}
    {:else}
      <p class="validation">No genres selected</p>
    {/if}
  </div>
</div>

<div class="add-genre flex-row">
  <select bind:value={newGenreId}>
    <option value="" hidden disabled>Select</option>
    {#each availableGenres
      .filter((g) => !topic_genres?.some((tg) => tg.id === g.id))
      .sort(sortByName) as genre}
      <option value={genre.id}>{genre.name}</option>
    {/each}
  </select>
  <button onclick={handleAddGenre} disabled={!newGenreId}>Add Genre</button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    flex-wrap: wrap;
    justify-content: center;
  }

  .add-genre {
    justify-content: center;
  }
</style>
