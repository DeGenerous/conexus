<script lang="ts">
  import { link } from 'svelte-spa-router';

  import SidebarLink from '@components/dashboard/SidebarLink.svelte';

  let {
    isAdmin,
    isCreator,
    item,
    expanded,
    toggleExpand,
    activePath,
  }: {
    isAdmin: boolean;
    isCreator: boolean;
    item: Linking;
    expanded: Set<string>;
    toggleExpand: (name: string) => void;
    activePath: string;
  } = $props();

  function shouldShow(item: Linking): boolean {
    // If there's a custom display function, respect it first
    if (item.display && !item.display()) {
      return false;
    }

    if ('path' in item) {
      if (!item.path) {
        return false;
      }

      if (item.intended !== undefined) {
        // Leaf link → check intended audience
        switch (item.intended) {
          case 'admin':
            return isAdmin;
          case 'creator':
            return isAdmin || isCreator;
          default:
            return true;
        }
      }

      // Leaf link → only check display (already handled above)
      return true;
    }

    // Parent link → check intended audience
    switch (item.intended) {
      case 'all':
        return true;
      case 'admin':
        return isAdmin;
      case 'creator':
        return isAdmin || isCreator;
      default:
        return false;
    }
  }
</script>

{#if shouldShow(item)}
  <div class="menu-group">
    {#if item.children}
      <!-- Dropdown -->
      <button
        class="void-btn menu-toggle"
        class:expanded={expanded.has(item.name)}
        aria-expanded={expanded.has(item.name)}
        onclick={() => toggleExpand(item.name)}
        title={item.name}
      >
        <h5>{item.name}</h5>
        <span class="chevron" aria-hidden="true">
          {expanded.has(item.name) ? '▾' : '▸'}
        </span>
      </button>

      {#if expanded.has(item.name)}
        <ul class="submenu flex gap-8">
          {#each item.children as child}
            <li>
              <SidebarLink
                {isAdmin}
                {isCreator}
                item={child}
                {expanded}
                {toggleExpand}
                {activePath}
              />
            </li>
          {/each}
        </ul>
      {/if}
    {:else if item.path}
      <!-- Standalone -->
      <a
        href={item.path}
        class="standalone {activePath === item.path ? 'selected' : ''}"
        use:link
        tabindex="0"
        title={item.name}
      >
        {item.name}
      </a>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .menu-toggle,
  .standalone {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    text-align: left;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: background 0.3s ease, color 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @include white-txt;

    &:hover,
    &:focus-visible {
      @include cyan(0.1);
      @include bright;
    }
  }

  .menu-toggle {
    h5 {
      @include white-txt;
      @include font(body);
    }

    &.expanded h5 {
      @include cyan(1, text);
    }
  }

  .standalone {
    &:hover,
    &:focus-visible {
      @include cyan(1, text);
    }

    &.selected{
      @include cyan(0.85);
      @include dark-blue(1, text);
    }
  }

  .chevron {
    margin-left: auto;
    font-size: 0.75rem;
    opacity: 0.75;
    flex: none;
  }

  .submenu {
    align-items: flex-start;
    margin-top: 0.5rem;
    padding-left: 0.75rem;
    margin-left: 0.75rem;
    border-left: 1px solid rgba(51, 226, 230, 0.25);
    transition: all 0.3s ease;

    // Fallback if no support
    opacity: 1;
    transform: none;

    @starting-style {
      opacity: 0;
      transform: scaleY(0.5) translateY(-50%);
    }

    li {
      width: 100%;
    }
  }
</style>
