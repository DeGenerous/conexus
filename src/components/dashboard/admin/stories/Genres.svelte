<script lang="ts">
  import { onMount } from 'svelte';

  import AdminApp from '@lib/admin';
  import AppView from '@lib/view';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';

  import CloseSVG from '@components/icons/Close.svelte';

  const admin: AdminApp = new AdminApp();
  const view: AppView = new AppView();

  let genres = $state<Genre[]>([]);
  let newGenreName = $state<string>('');

  onMount(async () => {
    genres = await view.getGenres();
  });

  const addNewGenre = async () => {
    if (!newGenreName.trim()) return;

    await admin.createNewGenre(newGenreName);
    genres = await view.getGenres(true);

    newGenreName = '';
  };

  const deleteGenre = async (id: string) => {
    openModal(ensureMessage('delete this genre'), 'Delete', async () => {
      await admin.deleteGenre(id);
      genres = await view.getGenres(true);
    });
  };

  const onkeypress = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.repeat) return;
    if (!newGenreName) return;
    const activeInput = document.activeElement as HTMLElement;
    if (activeInput && activeInput.tagName === 'INPUT') {
      addNewGenre();
      activeInput.blur();
    }
  };
</script>

<svelte:window {onkeypress} />

<section class="dream-container">
  <h4>Available Genres: {genres.length}</h4>
  <div class="container">
    {#if genres.length > 0}
      {#each genres as genre (genre)}
        <button class="void-btn small-purple-tile">
          <p>{genre.name}</p>
          <CloseSVG
            onclick={() => deleteGenre(genre.id!)}
            voidBtn={true}
            dark={true}
          />
        </button>
      {/each}
    {:else}
      <p class="validation">No genres available</p>
    {/if}
  </div>
  <div class="input-container">
    <input type="text" placeholder="New genre name" bind:value={newGenreName} />
  </div>
  <button onclick={addNewGenre}> Add New Genre </button>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section .container {
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
