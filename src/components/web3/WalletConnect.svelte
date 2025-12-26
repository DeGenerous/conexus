<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { createRoot, type Root } from 'react-dom/client';

  import { showProfile } from '@stores/modal.svelte';

  import RainbowConnect from '@components/web3/Rainbow';

  let {
    linking = false,
    title = 'Connect Wallet',
  }: {
    linking?: boolean;
    title?: string;
  } = $props();

  const rootMap = new WeakMap<HTMLElement, Root>();

  let container: HTMLDivElement | null = null;

  const renderReact = () => {
    if (!container) return;

    let root = rootMap.get(container);
    if (!root) {
      root = createRoot(container);
      rootMap.set(container, root);
    }

    root.render(RainbowConnect(linking, title));
  };

  onMount(() => {
    renderReact();
  });

  $effect(() => {
    if (!container) return;

    const root = rootMap.get(container);
    if (!root) return;

    root.render(RainbowConnect(linking, title));
  });

  onDestroy(() => {
    if (!container) return;

    const root = rootMap.get(container);
    root?.unmount();
    if (root) rootMap.delete(container);
  });

  const closeProfile = () => {
    if (!$showProfile) return;
    $showProfile = false;
  };
</script>

<!-- svelte-ignore
a11y_click_events_have_key_events
a11y_no_static_element_interactions -->
<div
  id="react-root"
  bind:this={container}
  onclick={closeProfile}
  role="toolbar"
  tabindex="-1"
  style:width="auto"
></div>
