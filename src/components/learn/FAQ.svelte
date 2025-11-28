<script lang="ts">
  import Dropdown from '@components/utils/Dropdown.svelte';
  import frequentlyAskedQuestions from '@constants/faq';
</script>

<section class="flex">
  {#each frequentlyAskedQuestions as { question, answer }}
    <Dropdown name={question}>
      {@html answer}
    </Dropdown>
  {/each}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    width: 100%;
    color: $soft-white;

    @include respond-up(tablet) {
      padding-inline: 1.5rem;
    }
  }
</style>
