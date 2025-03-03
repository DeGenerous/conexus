<script lang="ts">
  import { onMount } from 'svelte';
  import { Account } from '@lib/account';
  import { authenticated, referralCodes } from '@stores/account';
  import Eye from '@components/icons/Eye.svelte';
  import passwordVisible from '@stores/password-visibility';

  let account: Account = new Account();
  onMount(async () => {
    account.me();
  });

  $: user = $authenticated.user;

  let password: string = 'password';

  async function saveProfileSettings() {
    await fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  }

  let updateNewsletterStatus: boolean | null = null;
  const dateToString = (date: Date) => {
    const dateObject: Date = new Date(date);

    const day: string = ('0' + dateObject.getDate()).slice(-2);
    const month: string = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const year: number = dateObject.getFullYear();

    const fullDate: string = `${day}.${month}.${year}`;
    return fullDate;
  };
</script>

{#if user}
  {#if user.available}
    <div class="stories-count">
      <h3>
        You have used
        <strong
          >{user.available.used} / {user.available.available} weekly</strong
        >
        stories
      </h3>

      {#if user.available.bonus > 0}
        <h3>
          You have
          <strong>{user.available.bonus} bonus</strong>
          stories
        </h3>
      {/if}
    </div>

    <hr>
  {/if}

  <h2>Profile Settings</h2>

  <div class="container">
    <div class="input-container">
      <label for="email">Email</label>
      <input
        id="email"
        class="user-input"
        type="text"
        bind:value={user.email}
        disabled={true}
      />
    </div>

    <div class="input-container">
      <label for="first-name">First name</label>
      <input
        id="first-name"
        class="user-input"
        type="text"
        bind:value={user.first_name}
      />
    </div>

    <div class="input-container">
      <label for="last-name">Last name</label>
      <input
        id="last-name"
        class="user-input"
        type="text"
        bind:value={user.last_name}
      />
    </div>

    <div class="input-container">
      <label for="last-name">Password</label>
      <div class="password-input-container">
        <input
          id="password"
          class="user-input"
          class:red-border={!password || password.length < 8}
          type={$passwordVisible.edit ? 'text' : 'password'}
          bind:value={password}
        />
        <Eye visibility="edit" />
      </div>
    </div>

    <div class="input-container">
      <label>
        Visibility:
        <select class="selector">
          <option value="" selected={true} disabled hidden>Select</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
    </div>

    <button on:click={saveProfileSettings}>Save Changes</button>
  </div>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if $referralCodes}
  <hr>

  <h2>Referral Codes:</h2>

  <div class="referral-codes">
    {#each $referralCodes as code}
      <div class="ref-code-container">
        <input
          class="ref-code"
          id="code-{code.code}"
          class:active-code={!code.is_used}
          value={code.code}
          disabled
        />
        {#if !code.is_used}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            class="copy-svg"
            fill="none"
            stroke="rgb(51, 226, 230)"
            stroke-width="15"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.75"
            on:click={() =>
              navigator.clipboard.writeText(code.code)}
            role="button"
            tabindex="0"
            aria-label="Copy code"
          >
            <defs>
              <mask id="copy-checkmark">
                <rect
                  x="-45"
                  y="-60"
                  width="130"
                  height="150"
                  fill="white"
                  stroke="white"
                />
                <path
                  d="
                      M -10 10
                      L 10 40
                      L 50 -20
                    "
                  fill="none"
                  stroke="black"
                />
              </mask>
            </defs>

            <path
              d="
                  M 40 -67
                  L 40 -90
                  L -90 -90
                  L -90 60
                  L -52 60
                "
              fill="none"
            />
            <rect
              x="-45"
              y="-60"
              width="130"
              height="150"
              mask="url(#copy-checkmark)"
            />
            <path
              d="
                  M -10 10
                  L 10 40
                  L 50 -20
                "
              fill="none"
              stroke="rgb(1, 0, 32)"
              stroke-width="20"
            />
          </svg>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
{#key updateNewsletterStatus}
  {#await account.subscriptionStatus() then { is_active, subscribed_at }}
    <hr />

    {#if is_active}
      <div class="container">
        <h2>Newsletter Subscription</h2>

        {#if subscribed_at}
          <h3>Active since: {dateToString(subscribed_at.Time)}</h3>
        {/if}
        <h3
          class="unsubscribe-button"
          on:click={() => {
            account
              .unsubscribeNewsletter()
              .then(() => (updateNewsletterStatus = true));
          }}
          role="button"
          tabindex="0"
        >
          Unsubscribe
        </h3>
      </div>
    {:else}
      <div class="newsletter-subscription container">
        <h3>Subscribe to Newsletter:</h3>
        <button
          on:click={() => {
            account
              .subscribeNewsletter()
              .then(() => (updateNewsletterStatus = false));
          }}
        >
          Subscribe
        </button>
      </div>
    {/if}
  {/await}
{/key}

<style>
  .stories-count {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 1.5vw;
  }

  .stories-count h3 {
    color: rgba(51, 226, 230, 0.65);
  }

  .stories-count strong {
    color: rgba(51, 226, 230, 0.9);
  }

  .referral-codes {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  .ref-code-container {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(1, 0, 32, 0.75);
    box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.25);
    border-radius: 1vw;
    padding: 1vw;
  }

  .ref-code {
    font-size: 1.5vw;
    line-height: 1.5vw;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
  }

  .active-code {
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
    cursor: text;
  }

  .newsletter-subscription {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  .newsletter-subscription button {
    background-color: rgba(0, 185, 55, 0.75);
  }

  .newsletter-subscription button:hover,
  .newsletter-subscription button:active {
    color: #010020;
    background-color: rgb(0, 185, 55);
  }

  .unsubscribe-button {
    color: rgba(255, 60, 64, 0.75);
    cursor: pointer;
  }

  .unsubscribe-button:hover,
  .unsubscribe-button:active {
    color: rgb(255, 60, 64);
    text-decoration: underline;
  }

  @media only screen and (max-width: 600px) {
    label select {
      width: 25vw;
    }

    .referral-codes {
      gap: 0.5em;
    }

    .ref-code-container {
      padding: 0.5em 1em;
      border-radius: 0.5em;
    }

    .ref-code {
      font-size: 1em;
      line-height: 1.5em;
      padding: 0.25em 0.5em;
    }

    .newsletter-subscription {
      gap: 0.5em;
    }
  }
</style>
