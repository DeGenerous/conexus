<script lang="ts">
  import { onMount } from 'svelte';

  import Topic from '@lib/topics';
  import Drafts from '@utils/story-drafts';
  import { modal } from '@lib/modal-manager.svelte';
  import { currentDraft } from '@stores/dream.svelte';

  import CloseSVG from '@components/icons/Close.svelte';

  let { onRestore }: { onRestore?: () => void } = $props();

  const topic = new Topic();

  let inFlight = $state(true);
  let drafts = $state<DraftView[]>([]);
  let error = $state('');

  onMount(async () => {
    drafts = await topic.getDrafts();
    inFlight = false;
  });

  const convertDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute} ${day}.${month}.${year}`;
  };

  const restoreDraft = async (id: string) => {
    error = '';
    try {
      await Drafts.save($currentDraft?.id);
      await Drafts.restore(id);
      onRestore?.();
      modal.close();
    } catch {
      error = 'Failed to restore draft.';
    }
  };

  const deleteDraft = async (event: Event, draft: DraftView) => {
    event.stopPropagation();
    error = '';

    try {
      await Drafts.delete(draft.id);
      drafts = drafts.filter((d) => d.id !== draft.id);

      if ($currentDraft?.id === draft.id) {
        await Drafts.create();
        onRestore?.();
      }
    } catch {
      error = `Failed to delete "${draft.title}".`;
    }
  };
</script>

<div
  class="modal-content dream-container"
  onclick={(e) => e.stopPropagation()}
  role="presentation"
>
  {#if inFlight}
    <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
  {:else if drafts.length}
    <h4>Saved Drafts: {drafts.length}</h4>
    <div class="container">
      {#each drafts as draft (draft.id)}
        <button
          class="void-btn small-tile small-rose-tile"
          class:active={$currentDraft?.id === draft.id}
          onclick={() => restoreDraft(draft.id)}
        >
          <h5>{draft.title}</h5>
          <span class="flex-row gap-8">
            <p>{draft.id.split('-')[0]} - {convertDate(draft.updated_at)}</p>
            <CloseSVG
              onclick={(e) => deleteDraft(e, draft)}
              voidBtn={true}
              dark={true}
            />
          </span>
        </button>
      {/each}
    </div>
  {:else}
    <h4>No drafts yet</h4>
  {/if}

  {#if error}
    <p class="validation">{error}</p>
  {/if}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    width: 100%;
    flex-flow: row wrap;

    .small-tile {
      width: 100%;

      h5 {
        white-space: wrap;
        @include dark-red(1, text);
      }

      span > p {
        padding: 0.5rem;
        border-radius: 0.5rem;
        @include dark-red(0.5);
        @include box-shadow(soft, inset);
      }

      @include respond-up(large-desktop) {
        width: calc(50% - 0.75rem);
      }
    }
  }
</style>
