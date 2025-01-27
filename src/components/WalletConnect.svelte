<script lang="ts">
  import { onMount } from 'svelte';
  import ReactDOM from 'react-dom';

  import { YourApp } from './Rainbow';

  onMount(() => {
    const reactRoot = document.getElementById('react-root');
    if (reactRoot) {
      ReactDOM.render(YourApp(), reactRoot);
    }
  });
</script>

<div id="react-root"></div>

<style>
  #react-root {
    width: 100%;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
    padding: 1vw;
    font-size: 1.5vw;
    line-height: 1.5vw;
    color: #dedede;
    background-color: rgba(56, 117, 250, 0.5);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1vw;
  }
</style>
