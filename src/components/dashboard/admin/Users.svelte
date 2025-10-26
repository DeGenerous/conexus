<script lang="ts">
  import { onMount } from 'svelte';

  import AdminApp from '@lib/admin';

  import Numbers from '@components/dashboard/admin/users/Numbers.svelte';
  import UserList from '@components/dashboard/admin/users/UserList.svelte';

  const admin: AdminApp = new AdminApp();

  let roles = $state<TenantRole[]>([]);

  onMount(async () => {
    roles = await admin.fetchRoles();
  });
</script>

<h3>Accounts & Roles</h3>

<Numbers {roles} />

<UserList {roles} />
