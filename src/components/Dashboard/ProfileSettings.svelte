<script lang="ts">
  let user = {
    name: '',
    email: '',
    password: '',
    visibility: 'public',
  };

  async function saveProfileSettings() {
    await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  }
</script>

<div class="profile-settings">
  <h2>Profile Settings</h2>
  <label>
    Name:
    <input type="text" bind:value={user.name} />
  </label>
  <label>
    Email:
    <input type="email" bind:value={user.email} />
  </label>
  <label>
    Password:
    <input type="password" bind:value={user.password} />
  </label>
  <label>
    Visibility:
    <select bind:value={user.visibility}>
      <option value="public">Public</option>
      <option value="private">Private</option>
    </select>
  </label>
  <button on:click={saveProfileSettings}>Save Changes</button>
</div>

<style>
  .profile-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
</style>
