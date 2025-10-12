<script lang="ts">
  import { onMount } from 'svelte';

  import Topic from '@lib/topics';
  import Drafts from '@utils/story-drafts';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage, restoreDraft } from '@constants/modal';
  import { SetCache, CURRENT_DRAFT_KEY } from '@constants/cache';

  import CloseSVG from '@components/icons/Close.svelte';

  let topic: Topic = new Topic();

  let inFlight = $state<boolean>(true);
  let drafts = $state<DraftView[]>([]);

  onMount(async () => {
    drafts = await topic.getDrafts();
    inFlight = false;
  });

  const convertDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    const converted = {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear(),
      hour: date.getHours().toString().padStart(2, '0'),
      minute: date.getMinutes().toString().padStart(2, '0'),
    };
    return `${converted.hour}:${converted.minute} ${converted.day}.${converted.month}.${converted.year}`;
  };

  const openDraft = (id: string, title: string) => {
    openModal(
      restoreDraft(title),
      'Restore',
      () => {
        SetCache(CURRENT_DRAFT_KEY, id);
        open('/dashboard#/dream/create', '_self');
      },
    );
  };

  const deleteDraft = (event: Event, id: string) => {
    event.stopPropagation();
    openModal(
      ensureMessage('delete this draft'),
      'Delete',
      () => {
        Drafts.delete(id).then(() => {
          drafts = drafts.filter((draft) => draft.id !== id);
        });
      },
    );
  };

  // TODO: processDraftDocument
</script>

{#if inFlight}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else}
  <p>
    All your works-in-progress in one place. Pick a draft to reopen the creator
    and keep writing without re-entering details.
  </p>
  {#if drafts.length}
    <h4>Saved Drafts: {drafts.length}</h4>
    <div class="container flex-row flex-wrap">
      {#each drafts as { id, title, created_at, updated_at }}
        <button class="void-btn small-tile small-rose-tile" onclick={() => openDraft(id!, title!)}>
          <h5>{title}</h5>
          <span class="flex-row gap-8">
            <p>{id.split('-')[0]} - {convertDate(updated_at)}</p>
            <CloseSVG onclick={(event) => deleteDraft(event, id!)} voidBtn={true} dark={true} />
          </span>
        </button>
      {/each}
    </div>
  {:else}
    <h4>Your drafts will be there</h4>
    <button
      class="button-glowing"
      onclick={() => open('/dashboard#/dream/create', '_self')}
    >
      Create a Dream
    </button>
  {/if}
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    width: 100%;

    .small-tile {
      width: 100%;

      h5 {
        white-space: wrap;
        @include dark-red(1, text);
      }

      p {
        width: auto;
      }

      @include respond-up(large-desktop) {
        width: calc(50% - 0.75rem);
      }
    }
  }
</style>
