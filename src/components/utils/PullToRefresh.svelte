<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';
  import { toastStore } from '@stores/toast.svelte';

  let {
    children,
    threshold = 80,
    maxDistance = 120,
    refresh,
  }: {
    children: Snippet;
    threshold?: number;
    maxDistance?: number;
    refresh?: () => Promise<void> | void;
  } = $props();

  // --- CONFIG ---
  const RESISTANCE_FACTOR = 2.5;
  const INDICATOR_HEIGHT = 60;
  const WHEEL_FACTOR = 0.5;
  const COOLDOWN_MS = 500; // Time before another refresh can start

  // --- STATE ---
  let host_element = $state<HTMLElement | undefined>();
  let content_element = $state<HTMLElement | undefined>();

  let is_pulling = $state(false);
  let is_refreshing = $state(false);
  let is_post_refresh = $state(false);
  let drag_start_y = $state(0);
  let drag_distance = $state(0);
  let last_refresh_time = $state(0);
  let wheel_timeout: ReturnType<typeof setTimeout> | undefined;

  // --- DERIVED STATE ---
  const can_start_pull = () => {
    // Check if we're in a browser context.
    if (typeof window === 'undefined') {
      return false;
    }

    // Don't allow pull if a refresh is disabled, already in progress, or on cooldown.
    if (
      !refresh ||
      is_refreshing ||
      Date.now() - last_refresh_time < COOLDOWN_MS
    ) {
      return false;
    }

    // The pull-to-refresh action should only be possible when scrolled to the very top of the page.
    return window.scrollY <= 0;
  };

  const pull_progress = $derived(Math.min(1, drag_distance / threshold));

  const message = $derived.by(() => {
    if (is_post_refresh) return 'Data refreshed';
    if (is_refreshing) return 'Refreshing...';
    if (pull_progress >= 1) return 'Release to refresh';
    return 'Pull to refresh';
  });

  // --- LOGIC ---
  const on_pointer_down = (e: PointerEvent) => {
    if (!can_start_pull() || !e.isPrimary) return;
    is_pulling = true;
    drag_start_y = e.clientY;
  };

  const on_pointer_move = (e: PointerEvent) => {
    if (!is_pulling) return;
    const delta_y = e.clientY - drag_start_y;

    // Stop pulling if the user scrolls up
    if (delta_y < 0) {
      is_pulling = false;
      return;
    }

    // Only prevent default if we are pulling down. This allows for vertical scrolling
    // to be initiated and not be hijacked by the pull-to-refresh.
    if (delta_y > 0) {
      e.preventDefault();
    }

    const resisted_delta = delta_y / RESISTANCE_FACTOR;
    drag_distance = Math.min(maxDistance, resisted_delta);
    if (drag_distance >= threshold && !is_refreshing) {
      trigger_refresh();
    }
  };

  const on_pointer_up = (e: PointerEvent) => {
    if (!is_pulling) return;
    if (!is_refreshing) {
      drag_distance = 0;
    }
    is_pulling = false;
  };

  const on_wheel = (e: WheelEvent) => {
    if (!can_start_pull() || e.deltaY >= 0) return;

    e.preventDefault();

    const new_dist = drag_distance + Math.abs(e.deltaY) * WHEEL_FACTOR;
    drag_distance = Math.min(maxDistance, new_dist);

    clearTimeout(wheel_timeout);
    wheel_timeout = setTimeout(() => {
      if (!is_refreshing) drag_distance = 0;
    }, 300);

    if (drag_distance >= threshold && !is_refreshing) {
      trigger_refresh();
    }
  };

  const trigger_refresh = async () => {
    if (!refresh) return;
    if (is_refreshing) return;

    is_refreshing = true;
    is_pulling = false;
    drag_distance = INDICATOR_HEIGHT;

    try {
      await refresh();
      // toastStore.show('Data refreshed successfully');
      is_post_refresh = true;
    } catch (err) {
      console.error('Pull to refresh failed', err);
      toastStore.show('Refresh failed', 'error');
    } finally {
      setTimeout(() => {
        is_refreshing = false;
        is_post_refresh = false;
        drag_distance = 0;
        last_refresh_time = Date.now();
      }, 1000);
    }
  };

  onDestroy(() => {
    clearTimeout(wheel_timeout);
  });
</script>

<section bind:this={host_element} onwheel={on_wheel}>
  <div
    class="indicator-area"
    aria-hidden="true"
    style:height="{INDICATOR_HEIGHT}px"
  >
    <div
      class="indicator-content"
      style:opacity={pull_progress > 0 || is_refreshing ? 1 : 0}
    >
      <div
        class="spinner"
        class:is-refreshing={is_refreshing}
        class:is-post-refresh={is_post_refresh}
      >
        {#if is_post_refresh}
          <div class="checkmark">✓</div>
        {:else}
          <svg viewBox="0 0 32 32">
            <circle
              class="progress-track"
              r="14"
              cx="16"
              cy="16"
              fill="none"
              stroke-width="3"
            />
            <circle
              class="progress-value"
              r="14"
              cx="16"
              cy="16"
              fill="none"
              stroke-width="3"
              stroke-dasharray={2 * Math.PI * 14}
              stroke-dashoffset={(1 - pull_progress) * (2 * Math.PI * 14)}
              transform="rotate(-90 16 16)"
            />
          </svg>
          <div class="arrow">↓</div>
        {/if}
      </div>
      <p class="message" class:is-post-refresh={is_post_refresh}>{message}</p>
    </div>
  </div>

  <div
    class="content-wrapper flex"
    bind:this={content_element}
    onpointerdown={on_pointer_down}
    onpointermove={on_pointer_move}
    onpointerup={on_pointer_up}
    onpointercancel={on_pointer_up}
    style:transform="translateY({drag_distance}px)"
    style:transition-duration={is_pulling || is_refreshing ? '0s' : '0.3s'}
  >
    {@render children()}
  </div>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;
    padding-inline: 1.5rem;

    .indicator-area {
      position: absolute;
      top: 1rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 999;

      .indicator-content {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.25);
        padding: 8px 16px;
        border-radius: 24px;
        backdrop-filter: blur(10px);
        transition: opacity 0.3s ease;

        .spinner {
          position: relative;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          transition: transform 0.3s ease;

          &.is-refreshing .arrow {
            opacity: 0;
          }
          &.is-refreshing .progress-value {
            animation: dash 1.5s ease-in-out infinite;
          }

          &.is-post-refresh .checkmark {
            animation: check-pop-in 0.3s ease-out;
          }

          svg {
            position: absolute;
          }
          .progress-track {
            stroke: rgba(255, 255, 255, 0.1);
          }
          .progress-value {
            stroke: #ffffff;
            transition: stroke-dashoffset 0.1s linear;
          }

          .arrow {
            font-size: 12px;
            color: white;
            transition:
              transform 0.2s ease-out,
              opacity 0.2s ease;
          }

          .checkmark {
            font-size: 20px;
            color: rgb(0, 185, 55);
          }
        }

        .message {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          white-space: nowrap;

          &.is-post-refresh {
            color: rgb(0, 185, 55);
          }
        }
      }
    }

    .content-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      padding-block: 1.5rem;
      touch-action: pan-y;
      will-change: transform;
      transition-property: transform;
      transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 88;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 44, 44;
      stroke-dashoffset: -22px;
    }
    100% {
      stroke-dasharray: 88, 1;
      stroke-dashoffset: -87px;
    }
  }

  @keyframes check-pop-in {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    80% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
