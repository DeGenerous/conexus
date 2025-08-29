<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import Account from '@lib/account';

  let { user_id, topic_id }: { user_id: string; topic_id: string } = $props();

  const account: Account = new Account();

  let bookmarkTimeout: NodeJS.Timeout;
  let svgFocus = $state(false);
  let showManage = $state(false);

  let isBookmarked = $state<Bookmark | null>(null);
  let folders = $state<BookmarkFolder[]>([]);

  async function fetchFolders() {
    folders = await account.getBookmarkFolders();
  }

  async function addBookmark(folderId?: string) {
    const body: Bookmark = { topic_id, bookmark_folder_id: folderId };
    await account.bookmarkTopic(body);
    isBookmarked = await account.isTopicBookmarked(topic_id);
    showManage = false;
  }

  async function removeBookmark() {
    if (!isBookmarked?.id) return;
    await account.deleteBookmark(isBookmarked.id);
    isBookmarked = null;
  }

  function handleBookmarkClick() {
    if (isBookmarked && isBookmarked.id) {
      removeBookmark();
      return;
    }

    showManage = true;
    fetchFolders();

    bookmarkTimeout = setTimeout(() => {
      if (showManage) addBookmark();
    }, 2000);

    document.addEventListener('click', handleOutsideClick, true);
  }

  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.bookmark-container')) {
      clearTimeout(bookmarkTimeout);
      if (showManage) addBookmark();
      showManage = false;
      document.removeEventListener('click', handleOutsideClick, true);
    }
  }

  async function handleManageClick() {
    clearTimeout(bookmarkTimeout);
    await tick();
  }

  function handleFolderSelect(folderId?: string) {
    clearTimeout(bookmarkTimeout);
    addBookmark(folderId);
  }

  onMount(async () => {
    if (user_id && topic_id) {
      await fetchFolders();
      isBookmarked = await account.isTopicBookmarked(topic_id);
    }
  });

  onDestroy(() => {
    document.removeEventListener('click', handleOutsideClick, true);
  });
</script>

<span class="bookmark-container">
  <div class="bookmark-icon">
    <button
      class="void-btn flex"
      onclick={handleBookmarkClick}
      aria-label="Bookmark"
      onpointerover={() => {
        if (!isBookmarked) svgFocus = true;
      }}
      onpointerout={() => {
        if (!isBookmarked) svgFocus = false;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        >
        <path
        d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"
        transform={svgFocus ? 'scale(1.1) translate(-1,-1)' : ''}
        fill={!isBookmarked ? 'none' : 'currentColor'}
        />
      </svg>
    </button>
  </div>

  {#if showManage}
    <div
      class="manage-bookmark"
      role="dialog"
      tabindex="0"
      onmouseenter={() => clearTimeout(bookmarkTimeout)}
      onmouseleave={() => {
        bookmarkTimeout = setTimeout(() => {
          if (showManage) addBookmark();
        }, 2000);
      }}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleManageClick();
      }}
    >
      <h5>Select a folder:</h5>
      <ul>
        {#each folders as folder}
          <li>
            <button
              class="folder-btn"
              onclick={() => handleFolderSelect(folder.id)}
            >
              {folder.name}
            </button>
          </li>
        {/each}
      </ul>
      <small>Or wait to bookmark without folder</small>
    </div>
  {/if}
</span>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .bookmark-container {
    position: relative;
    display: inline-block;
    margin-left: 0.5rem;
  }

  .bookmark-icon button {
    width: 2rem;
    fill: none;
    stroke: $cyan;

    &:hover,
    &:active,
    &:focus {
      @include scale;
      @include bright;
    }
  }

  .bookmark-icon button svg {
    transition:
      fill 0.2s ease,
      transform 0.2s ease;
  }

  .manage-bookmark {
    position: absolute;
    bottom: 2.5rem;
    left: 0;
    background: #2a2a2a;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    padding: 1rem;
    z-index: 9999; /* ensure on top */
    min-width: 220px;
    animation: fadeIn 0.15s ease;
  }

  .manage-bookmark h5 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .manage-bookmark ul {
    list-style: none;
    padding: 0;
    margin: 0 0 0.75rem 0;
  }

  .manage-bookmark .folder-btn {
    background: #3a3a3a;
    color: #fff;
    border: none;
    border-radius: 6px;
    margin-bottom: 0.4rem;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: background 0.2s;
  }

  .manage-bookmark .folder-btn:hover {
    background: #555;
  }

  .manage-bookmark small {
    display: block;
    margin-top: 0.5rem;
    color: #aaa;
    font-size: 0.85rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
