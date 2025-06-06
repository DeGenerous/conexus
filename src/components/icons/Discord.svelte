<script lang="ts">
  let { text = 'Discord' }: { text: string } = $props();
</script>

<a
  class="button-anchor blur purple-btn"
  href="https://discord.gg/349FgMSUK8"
  target="_blank"
>
  <img src="/icons/discord.png" alt="Discord" />
  {text}
</a>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  a {
    img {
      width: 1.5rem;
      border-radius: 0.25rem;
    }

    &:hover,
    &:active,
    &:focus {
      img {
        @include scale-up(soft);
        @include box-shadow;
      }
    }
  }
</style>
