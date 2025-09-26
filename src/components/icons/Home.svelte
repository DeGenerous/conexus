<script lang="ts">
  let { activeTab = 'Home' }: { activeTab: string } = $props();
</script>

<a
  class="navigation-tab"
  class:active={activeTab === 'Home'}
  href="/"
  target="_self"
  draggable="false"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    fill="white"
    stroke="white"
    stroke-width="15"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="
          M -65 -17.5 L -65 70 L 65 70 L 65 -17.5
          M -80 -10 L 0 -75 L 80 -10
        "
      fill="none"
    />
    <rect x="-15" y="15" width="30" height="50" />
    <rect x="60" y="-57.5" width="5" height="30" />
  </svg>
  <p>Home</p>
</a>

<style lang="scss">
  @use '/src/styles/mixins' as *;
</style>
