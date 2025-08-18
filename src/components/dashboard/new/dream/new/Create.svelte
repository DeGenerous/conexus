<script lang="ts">
  import { isAdmin, isCreator } from '@stores/account.svelte';

  let Admin = $isAdmin;
  let Creator = $isCreator;
</script>

<h1>Welcome to create</h1>
