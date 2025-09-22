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
        class="menu-toggle"
        aria-expanded={expanded.has(item.name)}
        onclick={() => toggleExpand(item.name)}
      >
        {item.name}
      </button>

      {#if expanded.has(item.name)}
        <ul class="submenu">
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
      >
        {item.name}
      </a>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .menu-toggle {
    background: none;
    border: none;
    font-size: 1rem;
    text-align: left;
    padding: 0.5rem 0;
    color: white;
    cursor: pointer;
    transition: color 0.2s;
    @include text-glow;

    &:hover {
      color: #64b5f6;
    }
  }

  .submenu {
    list-style: none;
    margin: 0.25rem 0 0.5rem 1rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  a.standalone {
    display: block;
    color: white;
    padding: 0.5rem 0;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #64b5f6;
    }

    &.selected {
      font-weight: bold;
      color: #64b5f6;
    }
  }
</style>
