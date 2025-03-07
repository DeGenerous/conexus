<script>
  let selectedComponent = 'Table';
  const showBlank = () => (selectedComponent = 'Open');
  const showParameters = () => (selectedComponent = 'Table');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_to_interactive_role -->
<a href="./dream/create">Create a story</a>

<style>
  :global(input) {
    font-family: inherit;
  }

  :global(textarea) {
    font-family: inherit;
    resize: vertical;
  }

  h2 {
    padding-inline: 1vw;
    color: rgba(56, 117, 250, 0.5);
  }

  h2:hover,
  h2:active {
    text-decoration: underline;
    filter: brightness(125%);
  }

  .active {
    color: rgb(51, 226, 230);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
  }

  @media only screen and (max-width: 600px) {
    h2 {
      padding-inline: 1em;
    }
  }
</style>
