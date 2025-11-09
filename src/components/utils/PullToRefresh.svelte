<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { toastStore } from '@stores/toast.svelte';
  import { handlePullRefresh } from '@stores/view.svelte';

  import Arrow from '@components/icons/Arrow.svelte';

  let {
    threshold = 80,
    maxDistance = 120,
  }: {
    threshold?: number;
    maxDistance?: number;
  } = $props();

  // Gesture settings
  const MIN_VISUAL_DISTANCE = 2;
  const RESUME_DELAY_MS = 600;
  const TOP_SETTLE_MS = 1200;

  let dragDistance = $state(0);
  let isPulling = $state(false);
  let isLoading = $state(false);
  let hasTriggered = $state(false);

  let activePointerId: number | null = null;
  let startY = 0;
  let releaseTimer: ReturnType<typeof setTimeout> | null = null;
  let cooldownUntil = 0;

  let hasCrossedThreshold = false;
  let topReady = false;
  let topReadyTimer: ReturnType<typeof setTimeout> | null = null;

  // Progress clamps against whichever is larger: threshold or maxDistance
  const effectiveMaxDistance = $derived(Math.max(threshold, maxDistance));

  // Expose normalized progress for styling.
  const progress = $derived(
    isLoading ? 1 : Math.min(dragDistance / effectiveMaxDistance, 1),
  );

  // Keep UI hidden until the pull is meaningful or we're actively refreshing
  const showIndicator = $derived(
    isLoading || dragDistance >= MIN_VISUAL_DISTANCE,
  );

  const getTimestamp = () =>
    typeof performance !== 'undefined' ? performance.now() : Date.now();

  const armTopReady = () => {
    if (topReady || topReadyTimer) return;
    topReadyTimer = setTimeout(() => {
      topReadyTimer = null;
      topReady = true;
    }, TOP_SETTLE_MS);
  };

  const clearTopReady = () => {
    if (topReadyTimer) {
      clearTimeout(topReadyTimer);
      topReadyTimer = null;
    }
    topReady = false;
  };

  // Debounce to avoid spamming reset logic
  const clearReleaseTimer = () => {
    if (releaseTimer !== null) {
      clearTimeout(releaseTimer);
      releaseTimer = null;
    }
  };

  const scheduleRelease = () => {
    clearReleaseTimer();
    releaseTimer = setTimeout(() => {
      releaseTimer = null;
      if (isLoading || hasTriggered) return;
      if (dragDistance > 0) resetState();
    }, 150);
  };

  const canStartPull = () => {
    if (isLoading || hasTriggered) return false;
    if (getTimestamp() < cooldownUntil) return false;
    if (!topReady) return false;
    if (document.documentElement.classList.contains('no-scroll')) return false;
    if (window.scrollY > 0) return false;
    return true;
  };

  const updateDragDistance = (distance: number) => {
    const clamped = Math.max(0, Math.min(distance, effectiveMaxDistance));
    dragDistance = clamped;
    const crossed = clamped >= threshold;
    if (crossed) hasCrossedThreshold = true;
    else if (clamped <= threshold * 0.5) hasCrossedThreshold = false;
    return crossed;
  };

  // Resets every bit of transient state, then re-arms top-ready if we are still at 0
  const resetState = () => {
    clearReleaseTimer();
    hasCrossedThreshold = false;
    isPulling = false;
    hasTriggered = false;
    dragDistance = 0;
    activePointerId = null;
    startY = 0;
    if (!isLoading && window.scrollY <= 0) {
      armTopReady();
    } else if (!isLoading) {
      clearTopReady();
    }
  };

  // Called once the gesture commits and we need to invoke the refresh callback
  const beginRefresh = () => {
    if (hasTriggered || isLoading) return;
    clearReleaseTimer();
    clearTopReady();
    hasTriggered = true;
    isPulling = false;
    activePointerId = null;
    dragDistance = effectiveMaxDistance;
    isLoading = true;
    hasCrossedThreshold = false;

    queueMicrotask(async () => {
      try {
        await $handlePullRefresh?.();
      } catch (error) {
        console.error('[PullToRefresh] Refresh failed:', error);
        toastStore.show('Refresh failed. Please try again.', 'error');
      } finally {
        isLoading = false;
        resetState();
        cooldownUntil = getTimestamp() + RESUME_DELAY_MS;
      }
    });
  };

  // Pointer (touch/mouse) gesture handlers

  const handlePointerDown = (event: PointerEvent) => {
    if (activePointerId !== null || !canStartPull()) return;
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    clearTopReady();
    activePointerId = event.pointerId;
    startY = event.clientY;
    dragDistance = 0;
    hasCrossedThreshold = false;
    isPulling = true;
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isPulling || event.pointerId !== activePointerId) return;

    const deltaY = event.clientY - startY;
    if (deltaY <= 0) {
      updateDragDistance(0);
      return;
    }

    if (event.cancelable) event.preventDefault();
    const crossed = updateDragDistance(deltaY);
    if (crossed && !hasTriggered) beginRefresh();
  };

  const handlePointerEnd = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return;

    activePointerId = null;
    if (hasCrossedThreshold && !hasTriggered) beginRefresh();
    else resetState();
  };

  // Wheel gesture handler (desktop touchpads / scroll wheels)

  const handleWheel = (event: WheelEvent) => {
    if (isLoading) return;

    if (event.deltaY < 0) {
      if (!isPulling) {
        if (!canStartPull()) return;
        isPulling = true;
        hasCrossedThreshold = false;
        dragDistance = 0;
        clearTopReady();
      }

      if (event.cancelable) event.preventDefault();

      const increment = Math.abs(event.deltaY) * 0.4;
      const crossed = updateDragDistance(dragDistance + increment);
      if (crossed && !hasTriggered) beginRefresh();
      else if (!hasTriggered) scheduleRelease();
      return;
    }

    if (!hasTriggered && !isLoading && isPulling) resetState();
  };

  // Track whether the document is scrolled to the top
  const handleScroll = () => {
    if (window.scrollY <= 0) {
      if (!isPulling && !isLoading) armTopReady();
    } else {
      clearTopReady();
      if (isPulling && !hasTriggered) resetState();
    }
  };

  onMount(() => {
    const wheelListener = (event: WheelEvent) => handleWheel(event);

    if (window.scrollY <= 0) armTopReady();

    window.addEventListener('pointerdown', handlePointerDown, {
      passive: true,
    });
    window.addEventListener('pointermove', handlePointerMove, {
      passive: false,
    });
    window.addEventListener('pointerup', handlePointerEnd, { passive: true });
    window.addEventListener('pointercancel', handlePointerEnd, {
      passive: true,
    });
    window.addEventListener('wheel', wheelListener, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
      window.removeEventListener('wheel', wheelListener);
      window.removeEventListener('scroll', handleScroll);
    };
  });

  onDestroy(() => {
    // Clear timers so they don't leak if the component unmounts mid-gesture.
    clearReleaseTimer();
    clearTopReady();
  });
</script>

<div
  class="flex gap-8 fade-in"
  aria-live="polite"
  aria-busy={isLoading}
  aria-hidden={progress === 0}
  style:transform="translate(-50%, {progress * 3 * 100}%)"
  style:color="hsl(120, {progress * 2 * 100}%, 50%)"
  style:opacity={showIndicator ? '1' : '0'}
>
  <p>Pull Down to Refresh</p>
  <Arrow />
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 1000;
    pointer-events: none;
    transition:
      transform 0.15s ease,
      opacity 0.3s ease,
      color 0.15s linear;
    @include green(1, text);

    @starting-style {
      transform: translate(-50%, -100%);
    }

    p {
      text-transform: uppercase;
      font-weight: bold;
      color: inherit;
      @include font(caption);
    }
  }
</style>
