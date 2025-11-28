<script lang="ts">
  import Account from '@lib/account';
  import { notifications, unread } from '@stores/notification.svelte';

  const acct: Account = new Account();

  let open = false;
</script>

<button class="bell" on:click={() => (open = !open)}>
  🔔 {#if $unread > 0}<span class="badge">{$unread}</span>{/if}
</button>

{#if open}
  <div class="inbox">
    {#each $notifications as n}
      <article class="notif {n.read_at ? '' : 'unread'}">
        <h5>{n.title}</h5>
        <p>{n.body}</p>
        <div class="row">
          <a href={n.data?.href}>Open</a>
          {#if !n.read_at}<button
              on:click={() => acct.notification.markRead(n.id)}
              >Mark read</button
            >{/if}
        </div>
      </article>
    {/each}
  </div>
{/if}

<style>
  .bell {
    position: relative;
  }
  .badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #f44;
    color: #fff;
    border-radius: 999px;
    padding: 0 6px;
    font-size: 12px;
  }
  .inbox {
    position: absolute;
    right: 0;
    width: 360px;
    max-height: 60vh;
    overflow: auto;
    background: rgba(10, 10, 20, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px;
  }
  .notif {
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    padding: 8px 4px;
  }
  .notif.unread h5 {
    color: #90caf9;
  }
  .row {
    display: flex;
    gap: 8px;
  }
</style>
