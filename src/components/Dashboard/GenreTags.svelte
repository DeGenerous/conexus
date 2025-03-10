<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { CoNexusApp } from '@lib/view';
  import { availableGenres } from '@stores/view';

  let viewApp = new CoNexusApp();

  export let topic: ViewTopic;
  export let handleGenreChange = async (genreId: number, method: 'add' | 'remove') => {};
  
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
    if (genre)  await handleGenreChange(genre.id, 'remove');
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

<div class="container">
  <div class="tags">
    {#each $genres as genre (genre)}
      <div class="tag">
        <span>{genre}</span>
        <button on:click={() => handleRemoveGenre(genre)} title="Remove genre"
          >✕</button
        >
      </div>
    {/each}
  </div>

  <div class="dropdown">
    <select bind:value={$newGenre}>
      <option value="">Select genre to add</option>
      {#each $availableGenres.filter((g) => !$genres.includes(g.name)) as genre}
        <option value={genre.name}>{genre.name}</option>
      {/each}
    </select>
    <button on:click={handleAddGenre}>Add Genre</button>
  </div>
</div>

<style>
  .container {
    text-align: center;
    color: #333;
    font-size: 1.125rem;
    margin-top: 0.5rem;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .tag {
    display: flex;
    align-items: center;
    background-color: #e5e7eb;
    color: #374151;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    margin: 0.25rem;
    position: relative;
  }
  .tag button {
    margin-left: 0.5rem;
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    visibility: hidden;
  }
  .tag:hover button {
    visibility: visible;
  }
  .dropdown {
    margin-top: 1rem;
  }
  select {
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
  }
  button {
    margin-left: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  button:hover {
    background-color: #2563eb;
  }
</style>
