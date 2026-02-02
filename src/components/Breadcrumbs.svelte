<script lang="ts">
  let {
    items = [],
    hidden = false,
  }: { items: Breadcrumb[]; hidden?: boolean } = $props();

  let peerMode = $derived(items.some((item) => item.active));
</script>

{#if items.length > 0}
  <nav class="breadcrumbs" class:hidden aria-label="Breadcrumb">
    <ol>
      {#each items as crumb, i}
        <li>
          {#if crumb.active}
            <span class="active">{crumb.label}</span>
          {:else if crumb.href}
            <a
              class="nohover-link"
              href={crumb.href === 'back'
                ? 'javascript:window.history.back()'
                : crumb.href}
            >
              {crumb.label}
            </a>
          {:else}
            <span class="current">{crumb.label}</span>
          {/if}
          {#if i < items.length - 1}
            <span class="separator" aria-hidden="true">
              {peerMode ? '/' : '\u203A'}
            </span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .breadcrumbs {
    position: fixed;
    width: 100vw;
    top: 4.5rem;
    left: 0;
    z-index: 97;
    padding: 0.5rem 1rem;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease,
      transform 0.3s ease;
    @include dark-blue;

    @include respond-up(small-desktop) {
      width: auto;
      border-bottom-right-radius: 1rem;
      @include box-shadow;
    }

    &.hidden {
      opacity: 0;
      transform: translateY(-4.5rem);
      visibility: hidden;
    }

    ol {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
      white-space: nowrap;
    }

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    a {
      overflow: hidden;
      text-overflow: ellipsis;
      @include cyan(0.85, text);
      @include text-shadow;

      &:hover,
      &:active,
      &:focus-visible {
        @include light-blue(1, text);
      }
    }

    .active {
      overflow: hidden;
      text-overflow: ellipsis;
      @include white-txt;
      @include text-shadow;
    }

    .current {
      overflow: hidden;
      text-overflow: ellipsis;
      @include white-txt;
      @include text-shadow;
    }

    .separator {
      @include cyan(0.5, text);
      user-select: none;
    }
  }
</style>
