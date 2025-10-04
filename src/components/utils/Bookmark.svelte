<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Account from '@lib/account';

  let { user_id, topic_id }: { user_id: string; topic_id: string } = $props();

  const account: Account = new Account();
  const AUTO_BOOKMARK_DELAY = 3000;

  let svgFocus = $state(false);
  let showManage = $state(false);
  let folders = $state<BookmarkFolder[]>([]);
  let isBookmarked = $state<Bookmark | null>(null);
  let optimisticBookmarked = $state(false);
  let inFlight = $state(false);

  let bookmarkTimeout: ReturnType<typeof setTimeout> | null = null;

  async function fetchFolders() {
    try {
      folders = await account.getBookmarkFolders();
    } catch (err) {
      console.error('failed fetching folders', err);
    }
  }

  async function refreshBookmarkState() {
    try {
      isBookmarked = await account.isTopicBookmarked(topic_id);
    } catch (err) {
      console.warn('failed fetching bookmark state', err);
      isBookmarked = null;
    } finally {
      optimisticBookmarked = !!isBookmarked;
    }
  }

  function startAutoBookmarkTimer() {
    clearAutoBookmarkTimer();
    bookmarkTimeout = setTimeout(() => {
      if (showManage) {
        void addBookmark();
      }
    }, AUTO_BOOKMARK_DELAY);
  }

  function clearAutoBookmarkTimer() {
    if (!bookmarkTimeout) return;
    clearTimeout(bookmarkTimeout);
    bookmarkTimeout = null;
  }

  function closeManage() {
    showManage = false;
    clearAutoBookmarkTimer();
    document.removeEventListener('click', handleOutsideClick, true);
  }

  async function addBookmark(folderId?: string) {
    if (inFlight) return;
    closeManage();
    optimisticBookmarked = true;
    inFlight = true;

    try {
      await account.bookmarkTopic({ topic_id, bookmark_folder_id: folderId });
      await refreshBookmarkState();
    } catch (err) {
      console.error('failed to create bookmark', err);
      optimisticBookmarked = !!isBookmarked;
    } finally {
      inFlight = false;
    }
  }

  async function removeBookmark() {
    if (inFlight || !isBookmarked?.id) return;
    inFlight = true;

    try {
      await account.deleteBookmark(isBookmarked.id);
      isBookmarked = null;
      optimisticBookmarked = false;
    } catch (err) {
      console.error('failed to remove bookmark', err);
    } finally {
      inFlight = false;
    }
  }

  async function handleBookmarkClick() {
    if (inFlight) return;

    if (isBookmarked?.id) {
      await removeBookmark();
      return;
    }

    optimisticBookmarked = true;
    showManage = true;
    if (!folders.length) {
      fetchFolders();
    }
    startAutoBookmarkTimer();
    document.addEventListener('click', handleOutsideClick, true);
  }

  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.bookmark-container')) {
      if (showManage) {
        void addBookmark();
      } else {
        closeManage();
      }
    }
  }

  function handleFolderSelect(folderId?: string) {
    void addBookmark(folderId);
  }

  onMount(async () => {
    if (!user_id || !topic_id) return;
    await fetchFolders();
    await refreshBookmarkState();
  });

  onDestroy(() => {
    closeManage();
  });
</script>

<span class="bookmark-container flex">
  <button
    class="bookmark void-btn flex"
    aria-label="Bookmark"
    onclick={handleBookmarkClick}
    onpointerover={() => {
      if (!optimisticBookmarked) svgFocus = true;
    }}
    onpointerout={() => {
      if (!optimisticBookmarked) svgFocus = false;
    }}
    disabled={inFlight}
    title={inFlight
      ? 'Saving...'
      : optimisticBookmarked
        ? 'Bookmarked'
        : 'Bookmark'}
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
        transform={svgFocus ? 'scale(1.08) translate(-0.8,-0.8)' : ''}
        stroke="currentColor"
        fill={optimisticBookmarked ? 'currentColor' : 'none'}
      />
    </svg>
  </button>

  {#if showManage}
    <div
      class="flex gap pad round-8 fade-in"
      role="dialog"
      tabindex="0"
      onpointerenter={() => clearAutoBookmarkTimer()}
      onpointerleave={() => startAutoBookmarkTimer()}
      onkeydown={(e) => {
        if (e.key === 'Escape') {
          closeManage();
        }
      }}
    >
      <h5>Select a folder</h5>
      <ul class="flex gap-8">
        {#each folders as folder}
          <li>
            <button onclick={() => handleFolderSelect(folder.id)}>
              {folder.name}
            </button>
          </li>
        {/each}
      </ul>
      <p>Or wait to bookmark without folder</p>
    </div>
  {/if}
</span>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .bookmark-container {
    position: relative;
    width: 100%;

    @include respond-up(tablet) {
      width: auto;
    }

    .bookmark {
      width: 2rem;
      fill: none;
      @include rose(1, text);

      &:hover,
      &:active,
      &:focus-visible {
        @include scale;
        @include bright;
      }

      &:disabled {
        opacity: 0.5;
        cursor: wait;
      }
    }

    div {
      position: absolute;
      bottom: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      min-width: 20rem;
      @include dark-blue;
      @include gray-border;
      @include box-shadow;

      ul,
      li,
      button {
        width: 100%;
      }

      p {
        @include white-txt(soft);
        @include font(caption);
      }
    }
  }
</style>
