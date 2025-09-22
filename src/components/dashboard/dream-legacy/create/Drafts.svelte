<script lang="ts">
  import { currentDraft, draftsIndex } from '@stores/dream.svelte';

  import Drafts from '@utils/story-drafts';

  import CloseSVG from '@components/icons/Close.svelte';

  let {
    closeDialog = () => {},
  }: {
    closeDialog: () => void;
  } = $props();

  let selectedDraftID = $state<string>('');
  let selectedDraftTitle = $state<string>('');

  function restoreDraft(id: string) {
    Drafts.restore(id);
    closeDialog();
  }

  function deleteDraft(id: string) {
    Drafts.delete(id);
    $draftsIndex = Drafts.list();
    if (!$currentDraft) return;
    if ($currentDraft.id == id) $currentDraft = null;
  }

  // Calculate story creation date to show on DRAFT tile
  const convertDate = (date: string | Date) => {
    if (!date) return 'CORRUPTED';
    date = new Date(date);

    let minutes = String(date.getMinutes());
    let hours = String(date.getHours());

    let day = String(date.getDate());
    let month = String(date.getMonth() + 1);
    let year = String(date.getFullYear());

    if (Number(minutes) < 10) minutes = '0' + minutes;
    if (Number(hours) < 10) hours = '0' + hours;
    if (Number(day) < 10) day = '0' + day;
    if (Number(month) < 10) month = '0' + month;

    return `${day}.${month}.${year.slice(2)} ${hours}:${minutes}`;
  };
</script>

<h3>Story Draft Manager</h3>
<h5>All of your in-progress stories live here. Nothing gets lost.</h5>

{#if $draftsIndex.length}
  <ul class="drafts-wrapper transparent-container">
    {#each $draftsIndex as { id, title, updated_at }}
      <button
        class="draft void-btn small-rose-tile small-tile-addon"
        class:selected={selectedDraftID == id}
        class:active={$currentDraft && $currentDraft.id == id}
        onclick={() => {
          if (selectedDraftID == id) selectedDraftID = '';
          else selectedDraftID = id;
          selectedDraftTitle = title;
        }}
      >
        <p class="flex">
          {convertDate(new Date(updated_at))}
          <span>{id.split('-')[0]}</span>
        </p>
        <!-- <p>{id.split('-')[0]}</p> -->
        <CloseSVG onclick={() => deleteDraft(id)} voidBtn={true} dark={true} />
      </button>
    {/each}
  </ul>

  <hr />

  <span class="buttons flex">
    <button
      class="rose-btn blur"
      onclick={() => {
        Drafts.create();
        $draftsIndex = Drafts.list();
      }}
    >
      Create New
    </button>
    <button
      onclick={() => restoreDraft(selectedDraftID)}
      disabled={!selectedDraftID}
    >
      {selectedDraftID
        ? `Restore Draft: ${selectedDraftID.split('-')[0]} (${selectedDraftTitle})`
        : 'Restore Draft'}
    </button>
  </span>
{:else}
  <div class="transparent-container">
    <p class="validation">There is no drafts found</p>
  </div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .drafts-wrapper {
    width: 100%;
    flex-flow: row wrap;

    .draft {
      p {
        gap: 0;

        span {
          opacity: 0.5;
          @include font(caption);
        }
      }

      &.selected {
        background-color: $deep-green !important;

        &::after {
          content: 'Selected';
        }
      }

      &.active {
        background-color: $bright-rose;
        color: $white;

        &::after {
          content: 'Active';
        }
      }
    }
  }

  .buttons {
    width: 100%;
    flex-direction: column-reverse;

    button {
      width: inherit;
    }
  }

  @include respond-up(tablet) {
    .drafts-wrapper {
      width: auto;
    }

    .buttons {
      width: auto;
      flex-flow: row wrap;
    }
  }
</style>
