<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { CoNexusApp } from '@lib/view';
  import { availableGenres } from '@stores/view';

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

    const genre = $availableGenres.find((g: Genre) => g.name === genreToRemove);
    if (genre) await handleGenreChange(genre.id, 'remove');
  }

  function handleAddGenre() {
    newGenre.update((value) => {
      if (value && !$genres.includes(value)) {
        genres.update((prev) => [...prev, value]);

        const genre = $availableGenres.find((g) => g.name === value);
        if (genre) handleGenreChange(genre.id, 'add');
      }
      return '';
    });
  }

  onMount(async () => {
    const genres_ = await viewApp.getGenres();

    if (genres_) {
      availableGenres.set(genres_);
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="dream-box blur genres-list">
  <div class="buttons-wrapper">
    <h2>Genres</h2>
    <div class="container buttons-wrapper genres-wrapper">
      {#if $genres.length > 0}
        {#each $genres as genre (genre)}
          <div class="genre">
            <h3>{genre}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="close-svg"
              stroke="rgba(255, 60, 64, 0.85)"
              stroke-width="30"
              stroke-linecap="round"
              on:click={() => handleRemoveGenre(genre)}
              role="button"
              tabindex="0"
            >
              <path d="M -65 -65 L 65 65 M -65 65 L 65 -65" fill="none" />
            </svg>
          </div>
        {/each}
      {:else}
        <h3>No genres selected</h3>
      {/if}
    </div>
  </div>

  <div class="buttons-wrapper">
    <select class="selector" bind:value={$newGenre}>
      <option value="" hidden disabled>Select</option>
      {#each $availableGenres.filter((g) => !$genres.includes(g.name)) as genre}
        <option value={genre.name}>{genre.name}</option>
      {/each}
    </select>
    <button on:click={handleAddGenre}>Add Genre</button>
  </div>
</div>

<style>
  .genres-list {
    align-items: center;
    width: auto;
    max-width: 95vw;
  }

  .genres-wrapper {
    flex-flow: row wrap;
    justify-content: center !important;
  }

  .genre {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
    background-color: rgba(56, 117, 250, 0.5);
    border-radius: 1vw;
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  .genre h3 {
    color: #dedede;
  }

  @media only screen and (max-width: 600px) {
    .genres-list {
      width: 100vw;
      max-width: none;
    }

    .genres-list .container {
      flex-flow: row wrap;
    }

    .selector {
      width: 95vw;
    }

    .genre {
      gap: 1em;
      padding: 1em;
      border-radius: 0.5em;
    }
  }
</style>
