<script lang="ts">
  import { isAdmin, isCreator } from '@stores/account.svelte';

  let Admin = $isAdmin;
  let Creator = $isCreator;
</script>

<h5>Your drafts will be there</h5>
