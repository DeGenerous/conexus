<script lang="ts">
  import Topic from '@lib/topics';

  import CloseSVG from '@components/icons/Close.svelte';

  let topic: Topic = new Topic();

  // TODO: processDraftDocument
</script>

{#await topic.getDrafts()}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:then drafts}
  {#if drafts.length}
    <div class="container flex-row flex-wrap">
      {#each drafts as { id, title, created_at, updated_at }}
        <button class="void-btn small-tile">
          <h5>{title}</h5>
          <!-- <p>{updated_at}</p> -->
          <CloseSVG onclick={() => topic.deleteDraft(id!)} voidBtn={true} />
        </button>
      {/each}
    </div>
  {:else}
    <h5>Your drafts will be there</h5>
    <button
      class="button-glowing"
      onclick={() => open('/dashboard#/dream/create', '_self')}
    >
      Create a Dream
    </button>
  {/if}
{/await}
