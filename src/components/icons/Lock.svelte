<script lang="ts">
  export let className: string = "";
</script>

<svg
  class={className}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 16"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z"
  />
</svg>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  svg {
    width: 1rem;
    flex: none;
  }
</style>
