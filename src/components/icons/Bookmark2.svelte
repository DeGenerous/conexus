<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import Account from '@lib/account';

  let { user_id, topic_id }: { user_id: string; topic_id: string } = $props();

  const account: Account = new Account();

  // UI state (Svelte 5 runes)
  let svgFocus = $state(false);
  let showManage = $state(false);
  let folders = $state<BookmarkFolder[]>([]);
  let isBookmarked = $state<Bookmark | null>(null); // current persisted bookmark (or null)
  let optimisticBookmarked = $state<boolean | null>(null); // null = unknown, true/false = optimistic state
  let inFlight = $state(false); // request in progress (disables controls)

  // Queue/locking/coalescing
  // desiredState tracks the final desired boolean state (true = bookmarked, false = not)
  // We update desiredState on user clicks; worker serializes operations toward that state.
  let desiredState: boolean | null = null;
  let opWorkerRunning = false;

  // Timer used when opening the manage popup (auto-bookmark after delay)
  let bookmarkTimeout: NodeJS.Timeout | null = null;

  // Config
  const AUTO_BOOKMARK_MS = 2000; // auto-bookmark delay
  const DEBOUNCE_MS = 250; // coalesce rapid clicks
  const MAX_RETRIES = 3;
  const BASE_BACKOFF_MS = 350; // exponential backoff base

  // Helpers -------------------------------------------------------------
  function now() {
    return Date.now();
  }

  async function safeFetchFolders() {
    try {
      folders = await account.getBookmarkFolders();
    } catch (err) {
      console.error('failed fetching folders', err);
    }
  }

  // Set optimistic UI and schedule a worker to reconcile with server
  function setDesiredBookmarked(state: boolean) {
    desiredState = state;
    optimisticBookmarked = state;
    scheduleWorker();
  }

  // Called on user clicking the icon (toggle)
  function handleBookmarkClick() {
    const current = optimisticBookmarked ?? !!isBookmarked;
    const next = !current;

    if (next) {
      // User wants to bookmark -> optimistic only, no worker yet
      optimisticBookmarked = true;
      showManage = true;
      safeFetchFolders();
      startAutoBookmarkTimer();
      attachOutsideClickListener();
    } else {
      // User wants to unbookmark -> go straight to worker
      setDesiredBookmarked(false);
      showManage = false;
      clearAutoBookmarkTimer();
      detachOutsideClickListener();
    }
  }

  // When user selects a folder in the manage UI:
  function handleFolderSelect(folderId?: string) {
    // desired state is bookmarked; we simply store the folder id as "tag" for the operation
    // use the op worker to send the create with folder info
    executeCreateWithFolder(folderId);
    clearAutoBookmarkTimer();
    showManage = false;
    detachOutsideClickListener();
  }

  // Auto-bookmark timer behavior
  function startAutoBookmarkTimer() {
    clearAutoBookmarkTimer();
    bookmarkTimeout = setTimeout(() => {
      // when timer fires, make sure desiredState still wants bookmarked
      if (desiredState === true) {
        // create without folder
        executeCreateWithFolder(undefined);
        showManage = false;
        detachOutsideClickListener();
      }
    }, AUTO_BOOKMARK_MS);
  }
  function clearAutoBookmarkTimer() {
    if (bookmarkTimeout) {
      clearTimeout(bookmarkTimeout);
      bookmarkTimeout = null;
    }
  }

  // Outside click: if user clicks anywhere else while manage is open, create without folder
  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.bookmark-container')) {
      // proceed with auto-create if the desired state is bookmarked
      if (desiredState === true) {
        executeCreateWithFolder(undefined);
      }
      showManage = false;
      clearAutoBookmarkTimer();
      detachOutsideClickListener();
    }
  }
  function attachOutsideClickListener() {
    document.addEventListener('click', handleOutsideClick, true);
  }
  function detachOutsideClickListener() {
    document.removeEventListener('click', handleOutsideClick, true);
  }

  // Operation worker / queue -------------------------------------------
  // We provide a small API: executeCreateWithFolder(folderId) and requestDelete()
  // Worker serializes and retries transient failures

  async function scheduleWorker(delay = DEBOUNCE_MS) {
    // small debounce: if worker already scheduled/run, harmless
    if (opWorkerRunning) return;
    opWorkerRunning = true;
    await new Promise((res) => setTimeout(res, delay));
    try {
      await opWorker();
    } finally {
      opWorkerRunning = false;
    }
  }

  async function opWorker() {
    if (desiredState === null) return;

    const persisted = !!isBookmarked;
    if (desiredState === persisted) {
      optimisticBookmarked = persisted;
      desiredState = null;
      return;
    }

    if (desiredState === false) {
      // handle delete only
      inFlight = true;
      try {
        await doDelete();
        isBookmarked = await account.isTopicBookmarked(topic_id);
        optimisticBookmarked = !!isBookmarked;
      } finally {
        inFlight = false;
        desiredState = null;
      }
    }
  }

  // async function opWorker() {
  //   // If desiredState is null, nothing to do
  //   if (desiredState === null) return;

  //   // Determine current persisted state
  //   const persisted = !!isBookmarked;
  //   // If desired equals persisted, nothing to do (but ensure optimistic equals persisted)
  //   if (desiredState === persisted) {
  //     optimisticBookmarked = persisted;
  //     desiredState = null;
  //     return;
  //   }

  //   // At this point we must perform a network operation to reconcile.
  //   inFlight = true;
  //   let attempts = 0;
  //   let success = false;
  //   while (attempts < MAX_RETRIES && !success) {
  //     attempts++;
  //     try {
  //       if (desiredState === true) {
  //         // Create bookmark (no folder supplied here). If you want folder support,
  //         // call executeCreateWithFolder(...) instead which calls this worker but uses given folder.
  //         await doCreate(undefined);
  //       } else {
  //         // desiredState === false -> delete bookmark
  //         await doDelete();
  //       }
  //       success = true;
  //     } catch (err) {
  //       // transient errors will retry with backoff; permanent errors we bail out
  //       console.warn(`bookmark op attempt ${attempts} failed`, err);
  //       // simple heuristic: if error looks like client (4xx) don't retry; assume server or network otherwise
  //       // We can't inspect error types reliably here — so always backoff, but stop after MAX_RETRIES
  //       const backoff = BASE_BACKOFF_MS * Math.pow(2, attempts - 1);
  //       await new Promise((r) => setTimeout(r, backoff));
  //     }
  //   }

  //   // After trying:
  //   inFlight = false;
  //   if (!success) {
  //     // rollback optimistic state to actual persisted state (re-fetch)
  //     try {
  //       isBookmarked = await account.isTopicBookmarked(topic_id);
  //       optimisticBookmarked = !!isBookmarked;
  //     } catch {
  //       optimisticBookmarked = persisted; // best-effort
  //     }
  //     desiredState = null;
  //     // surface failure: app toast or console
  //     console.error('Bookmark operation failed after retries');
  //     return;
  //   }

  //   // success -> update persisted state
  //   try {
  //     isBookmarked = await account.isTopicBookmarked(topic_id);
  //     optimisticBookmarked = !!isBookmarked;
  //   } catch (err) {
  //     // If fetch fails, assume success based on optimistic state
  //     optimisticBookmarked = desiredState;
  //   } finally {
  //     desiredState = null;
  //   }
  // }

  // Low-level helpers that perform create/delete and support folder variant
  async function doCreate(folderId?: string) {
    // Build body per your API
    const body: Bookmark = {
      topic_id,
      bookmark_folder_id: folderId,
    };
    // call Account method
    await account.bookmarkTopic(body);
  }

  async function doDelete() {
    if (!isBookmarked?.id) {
      // If we don't have server bookmark ID, try to fetch first
      const b = await account.isTopicBookmarked?.(topic_id).catch(() => null);
      // (Note: if your Account lacks getBookmarkByTopicId, implement server-side lookup)
      if (b?.id) {
        await account.deleteBookmark(b.id);
      } else {
        // fallback: try delete with what you have (maybe account.deleteBookmark accepts topic id)
        throw new Error('no bookmark id available to delete');
      }
    } else {
      await account.deleteBookmark(isBookmarked.id);
    }
  }

  // Convenience wrapper: when user selects folder from manage popup
  async function executeCreateWithFolder(folderId?: string) {
    // If there is an outstanding desiredState flip toward "false", clear it
    desiredState = true;
    optimisticBookmarked = true;
    // perform immediate create with folder; bypass debounce to respect explicit user choice
    inFlight = true;
    try {
      await doCreate(folderId);
      // refresh persisted state
      isBookmarked = await account.isTopicBookmarked(topic_id);
      optimisticBookmarked = !!isBookmarked;
    } catch (err) {
      // on failure, rollback optimistic
      optimisticBookmarked = false;
      console.error('failed to create bookmark with folder', err);
    } finally {
      inFlight = false;
      desiredState = null;
    }
  }

  // Initialization + teardown ------------------------------------------
  async function init() {
    try {
      isBookmarked = await account.isTopicBookmarked(topic_id);
      optimisticBookmarked = !!isBookmarked;
    } catch (err) {
      console.warn('failed to fetch initial bookmark state', err);
      optimisticBookmarked = !!isBookmarked;
    }
  }

  onMount(async () => {
    await init();
  });

  onDestroy(() => {
    clearAutoBookmarkTimer();
    detachOutsideClickListener();
  });
</script>

<span class="bookmark-container">
  <div class="bookmark-icon" role="button" aria-pressed={optimisticBookmarked}>
    <button
      class="void-btn flex"
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
  </div>

  {#if showManage}
    <div
      class="manage-bookmark"
      role="dialog"
      tabindex="0"
      onmouseenter={() => clearAutoBookmarkTimer()}
      onmouseleave={() => startAutoBookmarkTimer()}
      onkeydown={(e) => {
        if (e.key === 'Escape') {
          showManage = false;
          clearAutoBookmarkTimer();
          detachOutsideClickListener();
        }
      }}
    >
      <h5>Select a folder</h5>
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
  .bookmark-icon {
    cursor: pointer;
    vertical-align: middle;
  }

  .bookmark-icon button {
    width: 2rem;
    height: 2rem;
    fill: none;
    stroke: $cyan;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    padding: 0.1rem;
    transition: transform 0.12s ease;

    &:hover,
    &:active,
    &:focus {
      @include scale;
      @include bright;
    }
  }

  .bookmark-icon button[disabled] {
    opacity: 0.6;
    cursor: wait;
  }

  .bookmark-icon button svg {
    transition:
      fill 0.2s ease,
      transform 0.2s ease;
  }

  .manage-bookmark {
    position: absolute;
    bottom: 2.6rem;
    left: 0;
    background: linear-gradient(
      180deg,
      rgba(18, 20, 26, 0.96),
      rgba(12, 14, 20, 0.96)
    );
    color: #e6eef8;
    border-radius: 12px;
    box-shadow:
      0 10px 30px rgba(2, 6, 23, 0.6),
      0 2px 6px rgba(0, 0, 0, 0.4);
    padding: 1rem;
    z-index: 99999;
    min-width: 240px;
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .manage-bookmark h5 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #aee7d8;
  }
  .manage-bookmark ul {
    margin: 0 0 0.6rem 0;
    padding: 0;
    list-style: none;
  }
  .manage-bookmark .folder-btn {
    background: rgba(255, 255, 255, 0.03);
    color: #e6eef8;
    border: none;
    border-radius: 8px;
    margin-bottom: 0.4rem;
    padding: 0.45rem 0.7rem;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  .manage-bookmark .folder-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }
  .manage-bookmark small {
    display: block;
    margin-top: 0.6rem;
    color: #9fb6c6;
    font-size: 0.85rem;
  }
</style>
