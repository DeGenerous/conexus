<script lang="ts">
  import { onMount } from 'svelte';

  import { currentDraft, draftsIndex } from '@stores/dream.svelte';

  import Drafts from '@utils/story-drafts';

  let {
    closeDialog = () => {},
  }: {
    closeDialog: () => void;
  } = $props();

  function restoreDraft(id: string) {
    Drafts.restore(id);
    closeDialog();
  }

  function deleteDraft(id: string) {
    Drafts.delete(id);
    $draftsIndex = Drafts.list();
  }
</script>

{#if $draftsIndex.length}
  <ul class="flex-row flex-wrap">
    {#each $draftsIndex as { id, title, updated }}
      <div class="rose-tile" role="button" tabindex="0">
        <h4>{title || 'Untitled'}</h4>
        <h5>{new Date(updated).toLocaleString()}</h5>
        <p>{id.split('-')[0]}</p>
        <span class="flex-row flex-wrap round-12 pad-8 gap-8 shad-inset">
          <button class="red-btn" onclick={() => deleteDraft(id)}>
            Delete
          </button>
          <button class="green-btn" onclick={() => restoreDraft(id)}>
            Restore
          </button>
        </span>
      </div>
    {/each}
  </ul>
{:else}
  <p class="validation">There is no drafts found</p>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  ul {
    div {
      width: auto;
      padding: 0.5rem;

      h4 {
        color: inherit;
      }

      span {
        @include dark-red(0.5);
      }
    }
  }
</style>
