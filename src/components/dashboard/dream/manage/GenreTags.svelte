<script lang="ts">
  import AppView from '@lib/view';
  import { availableGenres } from '@stores/view.svelte';

  import CloseSVG from '@components/icons/Close.svelte';

  let viewApp = new AppView();

  let {
    topic_genres,
    handleGenreChange,
  }: {
    topic_genres: TopicGenre[];
    handleGenreChange: (
      genreId: string,
      method: 'add' | 'remove',
    ) => Promise<void>;
  } = $props();

  let newGenreId = $state('');

  $effect(() => {
    topic_genres = topic_genres.sort(sortByName);
  });

  $effect(() => {
    viewApp.getGenres().then((genres_) => {
      if (genres_) {
        availableGenres.splice(0, availableGenres.length, ...genres_);
      }
    });
  });

  async function handleRemoveGenre(genre_id: string) {
    topic_genres = topic_genres.filter((genre) => genre.id !== genre_id);

    const genre = availableGenres.find((g: Genre) => g.name === genre_id);
    if (genre && genre.id) await handleGenreChange(genre.id, 'remove');
  }

  async function handleAddGenre() {
    if (newGenreId === '') return;

    if (topic_genres.some((tg) => tg.id === newGenreId)) {
      return;
    }

    await handleGenreChange(newGenreId, 'add');

    newGenreId = '';
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
    {#if topic_genres.length > 0}
      {#each topic_genres as genre (genre)}
        <button class="void-btn small-purple-tile">
          <p>{genre.name}</p>
          <CloseSVG
            onclick={() => handleRemoveGenre(genre.id)}
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
  <select bind:value={newGenreId}>
    <option value="" hidden disabled>Select</option>
    {#each availableGenres
      .filter((g) => !topic_genres.some((tg) => tg.id === g.id))
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
