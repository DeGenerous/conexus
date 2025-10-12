<script lang="ts">
  import Topic from '@lib/topics';
  import Drafts from '@utils/story-drafts';

  import CloseSVG from '@components/icons/Close.svelte';

  let topic: Topic = new Topic();

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

  // TODO: processDraftDocument
</script>

{#await topic.getDrafts()}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:then drafts}
  <p>
    All your works-in-progress in one place. Pick a draft to reopen the creator
    and keep writing without re-entering details.
  </p>
  {#if drafts.length}
    <h4>Saved Drafts: {drafts.length}</h4>
    <div class="container flex-row flex-wrap">
      {#each drafts as { id, title, created_at, updated_at }}
        <button class="void-btn small-tile small-rose-tile">
          <h5>{title}</h5>
          <span class="flex-row gap-8">
            <p>{id.split('-')[0]} - {convertDate(updated_at)}</p>
            <CloseSVG onclick={() => Drafts.delete(id!)} voidBtn={true} dark={true} />
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
{/await}

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
