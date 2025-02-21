<script lang="ts">
  import Account from '@lib/auth';

  export let token: string;

  let email: string = '';
  let password: string = '';
  let passwordConfirm: string = '';
  let passwordVisible: boolean = false;

  $: passwordsMatch = password && password === passwordConfirm;
  $: validation = email && password.length >= 8 && passwordsMatch;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="container-wrapper">
  <div class="container blur">
    <h3>Confirm your email address and create a new password</h3>
    <input
      class="user-input"
      class:red-border={!email}
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />

    {#if !email}
      <p class="validation">Provide the email associated with your profile</p>
    {/if}

    <div class="password-input-container">
      <input
        class="user-input"
        class:red-border={!password || password.length < 8}
        type={passwordVisible ? 'text' : 'password'}
        bind:value={password}
        placeholder="New password"
        required
        autocomplete="new-password"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        class="eye-svg"
        fill="none"
        stroke="rgb(51, 226, 230)"
        stroke-width="15"
        stroke-linejoin="round"
        stroke-linecap="round"
        opacity="0.75"
        on:click={() => (passwordVisible = !passwordVisible)}
        role="button"
        tabindex="0"
        aria-label="Show password"
      >
        <defs>
          <mask id="eye-svg-top-mask">
            <rect
              class="eye-svg-top"
              x="-100"
              y="-100"
              width="200"
              height="200"
              fill="white"
              style="transform: {passwordVisible
                ? 'none'
                : 'translateX(-200px)'}"
            />
          </mask>
          <mask id="eye-svg-bottom-mask">
            <rect
              class="eye-svg-bottom"
              x="100"
              y="-100"
              width="200"
              height="200"
              fill="white"
              style="transform: {passwordVisible
                ? 'none'
                : 'translateX(-200px)'}"
            />
          </mask>
          <mask id="eye-svg-crossed-out-mask">
            <g stroke="white">
              <circle r="20" />
              <path
                d="
                  M -80 0
                  Q 0 -90 80 0
                  Q 0 90 -80 0
                  Z
                "
              />
            </g>
            <line x1="55" y1="-75" x2="-95" y2="75" stroke="black" />
          </mask>
        </defs>

        <g mask="url(#eye-svg-top-mask)">
          <circle r="20" />
          <path
            d="
              M -80 0
              Q 0 -90 80 0
              Q 0 90 -80 0
              Z
            "
          />
        </g>

        <g mask="url(#eye-svg-bottom-mask)">
          <g mask="url(#eye-svg-crossed-out-mask)">
            <circle r="20" />
            <path
              d="
                M -80 0
                Q 0 -90 80 0
                Q 0 90 -80 0
                Z
              "
            />
          </g>
          <line x1="75" y1="-75" x2="-75" y2="75" />
        </g>
      </svg>
    </div>

    <input
      class="user-input"
      class:red-border={!passwordsMatch}
      type={passwordVisible ? 'text' : 'password'}
      bind:value={passwordConfirm}
      placeholder="Confirm new password"
      required
    />

    {#if !password}
      <p class="validation">Provide new password</p>
    {:else if password.length < 8}
      <p class="validation">Password should contain at least 8 characters!</p>
    {:else if !passwordsMatch}
      <p class="validation">Passwords do not match!</p>
    {/if}

    <button
      on:click={() => Account.resetPassword({ email, password, token })}
      disabled={!validation}
    >
      Reset Password
    </button>
  </div>
</div>
