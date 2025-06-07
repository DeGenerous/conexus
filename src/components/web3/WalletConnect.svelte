<script lang="ts">
  import { createRoot } from 'react-dom/client';

  import { showProfile } from '@stores/modal.svelte';

  import RainbowConnect from './Rainbow';

  let {
    linking = false,
    title = 'Connect Wallet',
  }: {
    linking?: boolean;
    title?: string;
  } = $props();

  $effect(() => {
    const reactRoot = document.getElementById('react-root');
    if (reactRoot) {
      const root = createRoot(reactRoot); // Create a root
      root.render(RainbowConnect(linking, title));
    }
  });

  const closeProfile = () => {
    if (!$showProfile) return;
    $showProfile = false;
  };
</script>

<!-- svelte-ignore
a11y_click_events_have_key_events
a11y_no_static_element_interactions -->
<div id="react-root" onclick={closeProfile} role="toolbar" tabindex="-1"></div>
