<script lang="ts">
  import { onMount } from 'svelte';

  import { blankImage, serveUrl } from '@constants/media';
  import Account from '@lib/account';
  import { toastStore } from '@stores/toast.svelte';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';

  import CloseSVG from '@components/icons/Close.svelte';

  const account: Account = new Account();

  // Derive types from Account methods so we don't guess import paths
  // type FolderTopics = Awaited<ReturnType<Account['getBookmarkFolderTopic']>>; // Bookmark[]
  // type TagTopics = NonNullable<
  //   Awaited<ReturnType<Account['getBookmarkTagsTopic']>>
  // >; // Bookmark[]
  // type Topics = FolderTopics | TagTopics; // both resolve to Bookmark[]
  // type BookmarkItem = Topics extends (infer U)[] ? U : never;

  // --- Svelte 5 runes state ---
  let folders = $state<BookmarkFolder[]>([]);
  // let tags = $state<BookmarkTag[]>([]);
  let selectedFolder = $state<string | null>(null);
  // let selectedTag = $state<string | null>(null);
  let topics = $state<Bookmark[]>([]);
  let newFolderName = $state('');
  // let newTagName = $state('');

  let openedTitle = $state<string>('Topics');

  // For CRUD on individual bookmarks
  // let viewingBookmarkId = $state<string | null>(null);
  // let viewingBookmark = $state<BookmarkItem | null>(null);
  // let editJSON = $state<string>('');
  let busy = $state(false);

  // --- Data loaders using the exact Account methods ---
  async function loadFolders() {
    folders = await account.getBookmarkFolders();
  }

  // async function loadTags() {
  //   tags = await account.getBookmarkTags();
  // }

  async function addFolder() {
    const name = newFolderName.trim();
    if (!name) {
      toastStore.show('Folder name cannot be empty', 'error');
      return;
    }
    await account.createBookmarkFolder(name);
    newFolderName = '';
    await loadFolders();
  }

  // async function addTag() {
  //   const name = newTagName.trim();
  //   if (!name) return;
  //   await account.createBookmarkTag(name);
  //   newTagName = '';
  //   await loadTags();
  // }

  async function openFolder(folderId?: string, folderName?: string) {
    if (!folderId) return;

    selectedFolder = folderId;
    // selectedTag = null;
    topics = await account.getBookmarkFolderTopic(folderId);
    openedTitle = folderName ? `${folderName}` : 'Topics';
    // viewingBookmarkId = null;
    // viewingBookmark = null;
    // editJSON = '';
  }

  const openGeneralFolder = () => {
    const general = folders.find((f) => f.name.toLowerCase() === 'general');
    if (general) {
      openFolder(general.id, general.name);
    }
  };

  async function removeFolder(folder: BookmarkFolder) {
    if (!folder.id) {
      toastStore.show('Folder ID is missing', 'error');
      return;
    }

    if (folder.name.toLowerCase() === 'general') {
      toastStore.show('Cannot remove the General folder', 'error');
      return;
    }

    openModal(ensureMessage('remove this folder'), 'Remove', async () => {
      await account.deleteBookmarkFolder(folder.id!);
      await loadFolders();
      openGeneralFolder();
    });
  }

  // async function openTag(tagId?: string, tagName?: string) {
  //   if (!tagId) return;

  //   selectedTag = tagId;
  //   selectedFolder = null;
  //   topics =
  //     (await account.getBookmarkTagsTopic(tagId)) ?? ([] as unknown as Topics);
  //   openedTitle = tagName ? `${tagName} Tag` : 'Topics';
  //   viewingBookmarkId = null;
  //   viewingBookmark = null;
  //   editJSON = '';
  // }

  // async function openBookmarkDetails(bookmarkId?: string) {
  //   if (!bookmarkId) return;

  //   // viewingBookmarkId = bookmarkId;
  //   viewingBookmark = (await account.getBookmark(
  //     bookmarkId,
  //   )) as unknown as BookmarkItem | null;
  //   editJSON = viewingBookmark ? JSON.stringify(viewingBookmark, null, 2) : '';
  // }

  // async function saveBookmarkEdits() {
  //   if (!viewingBookmarkId) return;
  //   let payload: Partial<BookmarkItem> | null = null;
  //   try {
  //     payload = JSON.parse(editJSON);
  //   } catch (_) {
  //     // Let backend toasts handle; keep UI quiet
  //     return;
  //   }
  //   busy = true;
  //   try {
  //     await account.updateBookmark(viewingBookmarkId, payload as any);
  //     // refresh the details and the current list
  //     await openBookmarkDetails(viewingBookmarkId);
  //     if (selectedFolder) await openFolder(selectedFolder);
  //     if (selectedTag) await openTag(selectedTag);
  //   } finally {
  //     busy = false;
  //   }
  // }

  async function removeBookmark(bookmarkId?: string) {
    if (!bookmarkId) return;

    busy = true;
    try {
      await account.deleteBookmark(bookmarkId);
      // refresh current list after deletion
      if (selectedFolder) await openFolder(selectedFolder);
      // if (selectedTag) await openTag(selectedTag);
      // if (viewingBookmarkId === bookmarkId) {
      //   viewingBookmarkId = null;
      //   viewingBookmark = null;
      //   editJSON = '';
      // }
    } finally {
      busy = false;
    }
  }

  const onkeypress = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.repeat) return;
    if (!newFolderName) return;
    const activeInput = document.activeElement as HTMLElement;
    if (activeInput && activeInput.tagName === 'INPUT') {
      addFolder();
      activeInput.blur();
    }
  };

  onMount(async () => {
    await loadFolders();
    openGeneralFolder();
    // await loadTags();
  });
</script>

<svelte:window {onkeypress} />

<p>
  Quick return to saved stories and moments. Organize by folders and pick up
  exactly where you left off.
</p>

<div class="container">
  {#if !folders.length}
    <h4>No bookmark folders yet</h4>
  {:else}
    <h4>Bookmark Folders: {folders.length}</h4>
    <ul class="flex-row flex-wrap">
      {#each folders as folder}
        <li>
          <button
            class="void-btn"
            type="button"
            class:small-rose-tile={folder.id !== selectedFolder}
            class:small-green-tile={folder.id === selectedFolder}
            onclick={() => openFolder(folder.id, folder.name)}
          >
            <p>{folder.name}</p>
            <CloseSVG
              onclick={() => removeFolder(folder)}
              voidBtn={true}
              dark={true}
            />
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<!-- <h2>Tags</h2>
<ul>
  {#each tags as tag}
    <li>
      <button
        type="button"
        class:selected={tag.id === selectedTag}
        onclick={() => openTag(tag.id, tag.name)}
      >
        {tag.name}
      </button>
    </li>
  {/each}
</ul>
<input bind:value={newTagName} placeholder="New tag name" />
<button onclick={addTag}>+ Tag</button> -->

<!-- <h3>{openedTitle}</h3> -->

<div class="tiles-collection dashboard-collection">
  {#if topics.length === 0}
    <h5 class="empty-title flex text-glowing">
      {#if !folders.length}
        Bookmark any story to create the General folder automatically, or create
        a folder now
      {:else if openedTitle === 'Topics'}
        Select any folder to see bookmarks
      {:else}
        Folder "{openedTitle}" is empty
      {/if}
    </h5>
  {:else}
    {#each topics as topic}
      <a
        class="tile rose-tile"
        href="/{topic.creator
          ? 'c'
          : 's'}/{topic.route_name}/{topic.topic_id}?title={topic.name}"
      >
        <img
          loading="lazy"
          src={serveUrl(topic.tile_file_url) ?? blankImage}
          alt={topic.name}
          draggable="false"
          height="1024"
          width="1024"
        />
        <h5>{topic.name}</h5>
        <button
          class="red-btn"
          onclick={(event) => {
            event.preventDefault();
            removeBookmark(topic.id);
          }}
        >
          Remove
        </button>
      </a>
      <!-- <li>
        <div class="card-head">
          <h3>
            {topic.name ?? 'Bookmark'}
          </h3>
          <div class="actions"> -->
      <!-- <button onclick={() => openBookmarkDetails(topic.id)}
              >Details</button
            > -->
      <!--<button class="danger" onclick={() => removeBookmark(topic.id)}
              >Remove</button
            >
          </div>
        </div>
        <p>
          {#if topic.tile_file_url}
            <img
              src={serveUrl(topic.tile_file_url)}
              alt={topic.name ?? ''}
              width="100"
            />
          {:else}
            No image
          {/if}
        </p>
        <code class="muted">ID: {topic.id}</code>
      </li> -->
    {/each}
  {/if}
</div>

<!-- <aside class="bookmark-tools">
  <div class="details-panel">
    <h3>Bookmark Details</h3>
    {#if viewingBookmarkId}
      <p><strong>ID:</strong> {viewingBookmarkId}</p>
      <textarea bind:value={editJSON} rows="10" spellcheck="false"></textarea>
      <div class="row">
        <button disabled={busy} onclick={saveBookmarkEdits}
          >Save changes</button
        >
        <button
          disabled={busy}
          class="danger"
          onclick={() => removeBookmark(viewingBookmarkId!)}>Delete</button
        >
      </div>
    {:else}
      <p class="empty">Select a bookmark to see details.</p>
    {/if}
  </div>
</aside> -->

<div class="container flex-row flex-wrap">
  <input bind:value={newFolderName} placeholder="New folder name" />
  <button onclick={addFolder}>Add New Bookmark Folder</button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    width: 100%;

    @include respond-up(small-desktop) {
      width: auto;
      min-width: 42rem;
    }
  }
</style>
