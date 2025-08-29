<script lang="ts">
  import { onMount } from 'svelte';

  import { serveUrl } from '@constants/media';
  import Account from '@lib/account';

  const account: Account = new Account();

  // Derive types from Account methods so we don't guess import paths
  type FolderTopics = Awaited<ReturnType<Account['getBookmarkFolderTopic']>>; // Bookmark[]
  type TagTopics = NonNullable<
    Awaited<ReturnType<Account['getBookmarkTagsTopic']>>
  >; // Bookmark[]
  type Topics = FolderTopics | TagTopics; // both resolve to Bookmark[]
  type BookmarkItem = Topics extends (infer U)[] ? U : never;

  // --- Svelte 5 runes state ---
  let folders = $state<BookmarkFolder[]>([]);
  let tags = $state<BookmarkTag[]>([]);
  let selectedFolder = $state<string | null>(null);
  let selectedTag = $state<string | null>(null);
  let topics = $state<Bookmark[]>([]);
  let newFolderName = $state('');
  let newTagName = $state('');

  let openedTitle = $state<string>('Topics');

  // For CRUD on individual bookmarks
  let viewingBookmarkId = $state<string | null>(null);
  let viewingBookmark = $state<BookmarkItem | null>(null);
  let editJSON = $state<string>('');
  let busy = $state(false);

  // --- Data loaders using the exact Account methods ---
  async function loadFolders() {
    folders = await account.getBookmarkFolders();
  }

  async function loadTags() {
    tags = await account.getBookmarkTags();
  }

  async function addFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    await account.createBookmarkFolder(name);
    newFolderName = '';
    await loadFolders();
  }

  async function addTag() {
    const name = newTagName.trim();
    if (!name) return;
    await account.createBookmarkTag(name);
    newTagName = '';
    await loadTags();
  }

  async function openFolder(folderId?: string, folderName?: string) {
    if (!folderId) return;

    selectedFolder = folderId;
    selectedTag = null;
    topics = await account.getBookmarkFolderTopic(folderId);
    openedTitle = folderName ? `${folderName} Folder` : 'Topics';
    viewingBookmarkId = null;
    viewingBookmark = null;
    editJSON = '';
  }

  async function openTag(tagId?: string, tagName?: string) {
    if (!tagId) return;

    selectedTag = tagId;
    selectedFolder = null;
    topics =
      (await account.getBookmarkTagsTopic(tagId)) ?? ([] as unknown as Topics);
    openedTitle = tagName ? `${tagName} Tag` : 'Topics';
    viewingBookmarkId = null;
    viewingBookmark = null;
    editJSON = '';
  }

  async function openBookmarkDetails(bookmarkId?: string) {
    if (!bookmarkId) return;

    viewingBookmarkId = bookmarkId;
    viewingBookmark = (await account.getBookmark(
      bookmarkId,
    )) as unknown as BookmarkItem | null;
    editJSON = viewingBookmark ? JSON.stringify(viewingBookmark, null, 2) : '';
  }

  async function saveBookmarkEdits() {
    if (!viewingBookmarkId) return;
    let payload: Partial<BookmarkItem> | null = null;
    try {
      payload = JSON.parse(editJSON);
    } catch (_) {
      // Let backend toasts handle; keep UI quiet
      return;
    }
    busy = true;
    try {
      await account.updateBookmark(viewingBookmarkId, payload as any);
      // refresh the details and the current list
      await openBookmarkDetails(viewingBookmarkId);
      if (selectedFolder) await openFolder(selectedFolder);
      if (selectedTag) await openTag(selectedTag);
    } finally {
      busy = false;
    }
  }

  async function removeBookmark(bookmarkId?: string) {
    if (!bookmarkId) return;

    busy = true;
    try {
      await account.deleteBookmark(bookmarkId);
      // refresh current list after deletion
      if (selectedFolder) await openFolder(selectedFolder);
      if (selectedTag) await openTag(selectedTag);
      if (viewingBookmarkId === bookmarkId) {
        viewingBookmarkId = null;
        viewingBookmark = null;
        editJSON = '';
      }
    } finally {
      busy = false;
    }
  }

  onMount(async () => {
    await loadFolders();
    await loadTags();
  });
</script>

<section class="bookmark-dashboard">
  <div class="bookmark-sidebar">
    <h2>Folders</h2>
    <ul>
      {#each folders as folder}
        <li>
          <button
            type="button"
            class:selected={folder.id === selectedFolder}
            onclick={() => openFolder(folder.id, folder.name)}
          >
            {folder.name}
          </button>
        </li>
      {/each}
    </ul>
    <input bind:value={newFolderName} placeholder="New folder name" />
    <button onclick={addFolder}>+ Folder</button>

    <h2>Tags</h2>
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
    <button onclick={addTag}>+ Tag</button>
  </div>

  <div class="bookmark-content">
    <h2>{openedTitle}</h2>
    {#if topics.length === 0}
      <p class="empty">No topics yet.</p>
    {:else}
      <ul>
        {#each topics as topic}
          <li>
            <div class="card-head">
              <h3>
                {topic.name ?? 'Bookmark'}
              </h3>
              <div class="actions">
                <button onclick={() => openBookmarkDetails(topic.id)}
                  >Details</button
                >
                <button class="danger" onclick={() => removeBookmark(topic.id)}
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
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <aside class="bookmark-tools">
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
  </aside>
</section>

<style>
  .bookmark-dashboard {
    display: flex;
    gap: 2rem;
    padding: 1rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .bookmark-sidebar {
    flex: 1;
    max-width: 300px;
    min-width: 260px;
  }

  .bookmark-sidebar h2 {
    margin-bottom: 0.5rem;
  }

  .bookmark-sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
  }

  .bookmark-sidebar li {
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 4px;
  }

  .bookmark-sidebar li button.selected,
  .bookmark-sidebar li:hover {
    background-color: #007acc;
    color: white;
  }

  .bookmark-sidebar input {
    width: 100%;
    padding: 0.4rem;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
  }

  .bookmark-sidebar button {
    width: 100%;
    padding: 0.5rem;
    background-color: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .bookmark-sidebar button:hover {
    background-color: #005fa3;
  }

  .bookmark-content {
    flex: 2;
    min-width: 420px;
  }

  .bookmark-content h2 {
    margin-bottom: 1rem;
  }

  .bookmark-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .bookmark-content li {
    background: #f9f9f9;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .bookmark-content li h3 {
    margin: 0 0 0.5rem 0;
  }

  .bookmark-content li p {
    margin: 0;
  }

  .empty {
    font-style: italic;
    color: #666;
  }

  .bookmark-tools {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 420px;
  }
  .details-panel {
    background: #0f172a0d;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
  }
  .details-panel h3 {
    margin: 0 0 0.5rem 0;
  }
  textarea {
    width: 100%;
    box-sizing: border-box;
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: 0.9rem;
    padding: 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    color: #0f172a;
  }
  .row {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  .danger {
    background-color: #ef4444 !important;
    color: white;
  }
  .bookmark-content .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
</style>
