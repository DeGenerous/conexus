<script lang="ts">
  import SidebarLink from './SidebarLink.svelte';
  import { DASHBOARD_LINKS } from '../routes';

  let {
    isAdmin,
    isCreator,
  }: {
    isAdmin: boolean;
    isCreator: boolean;
  } = $props();

  let expanded = $state<Set<string>>(new Set());
  let activePath = $state<string>('');

  function toggleExpand(name: string) {
    const newSet = new Set(expanded);
    newSet.has(name) ? newSet.delete(name) : newSet.add(name);
    expanded = newSet;
  }
</script>

<aside class="sidebar">
  <h2 class="sidebar-title">Dashboard</h2>
  <nav>
    {#each DASHBOARD_LINKS as item}
      <SidebarLink
        {isAdmin}
        {isCreator}
        {item}
        {expanded}
        {toggleExpand}
        {activePath}
      />
    {/each}
  </nav>
</aside>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .sidebar {
    width: 250px;
    min-height: 100vh;
    background: rgba(10, 10, 20, 0.95);
    padding: 1.5rem;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .sidebar-title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1rem;
      @include text-glow;
    }
  }
</style>
