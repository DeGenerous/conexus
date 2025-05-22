<script lang="ts">
  import { onMount } from 'svelte';

  import DoorSVG from '@components/icons/Door.svelte';
  import EyeSVG from '@components/icons/Eye.svelte';
  import WalletConnect from '@components/web3/WalletConnect.svelte';
  import { Account } from '@lib/account';
  import { authenticated, referralCodes, accountError } from '@stores/account';
  import {
    showModal,
    showProfile,
    secondButton,
    secondButtonClass,
    handleSecondButton,
    modalContent,
  } from '@stores/modal';
  import passwordVisible from '@stores/password-visibility';
  import {
    regexpEmail,
    regexpPasswordValidation,
    regexpLengthCheck,
    regexpCapitalLetterCheck,
    regexpLowercaseLetterCheck,
    regexpNumberCheck,
    regexpSpecialCharCheck,
    regexpRestrictedCharsCheck,
  } from '@constants/regexp';

  let dialog: HTMLDialogElement;

  $: if (dialog && $showProfile) {
    dialog.classList.remove("dialog-fade-out");
    dialog.showModal();
  } else if (dialog) {
    dialog.classList.add("dialog-fade-out");
    setTimeout(() => dialog.close(), 300);
    if (!isLogged) {
      signUp = false;
      signInWithEmail = false;
    } else {
      editingPassword = false;
    }
  }

  const handleBackArrow = () => {
    if (signUp) {
      signUp = false;
      return;
    }
    if (signInWithEmail) {
      signInWithEmail = false;
      return;
    }
    $showProfile = false;
  };

  // Sign-in
  let user: Nullable<User>;
  let isLogged: boolean;

  let signUp: boolean;
  let signInWithEmail: boolean;
  let loginMail: string = '';
  let loginPassword: string = '';

  let subStatus: SubscriptionStatus | null = null;

  let account: Account = new Account();

  onMount(async () => {
    await account.me();
  });

  authenticated.subscribe((value) => {
    user = value.user;
    isLogged = value.loggedIn;
  });

  $: if (isLogged && account && user && user.email_confirmed) {
    account.getReferralCodes();
    checkSubscription();
  }

  // Change password
  let editingPassword: boolean = false;
  let editOldPassword: string = '';
  let editPassword: string = '';
  let editPasswordConfirm: string = '';

  const saveChangedPassword = async () => {
    $accountError = null as AccountError;
    await account.changePassword({
      old_password: editOldPassword,
      new_password: editPassword,
    });
    if (!$accountError || !$accountError.changePassword)
      editingPassword = false;
  };

  // Sign-up form
  let referralCode: string = '';
  let referralCodeValid: boolean = false;
  let first_name: string = '';
  let last_name: string = '';
  let password: string = '';
  let confirmPassword: string = '';
  let email: string = '';

  $: mandatoryFields =
    regexpEmail.test(email) &&
    first_name.trim() &&
    last_name.trim() &&
    regexpPasswordValidation.test(password) &&
    password == confirmPassword;

  let termsAccepted: boolean = false;
  let newsletterSignup: boolean = false;

  $: isFormValid = mandatoryFields && termsAccepted && referralCodeValid;

  $: if (referralCode.length === 16) validateReferralCode();
  $: if (referralCode.length < 16) referralCodeValid = false;
  async function validateReferralCode() {
    const referralObject: ReferralCode | null =
      await account.validateReferralCode(referralCode);
    if (referralObject) {
      referralCodeValid = true;
    } else {
      referralCodeValid = false;
    }
  }

  const referralSignup = async (event: Event) => {
    event.preventDefault();
    await account
      .signup({
        user: {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim(),
          password,
          referred: referralCodeValid,
          role: 'user',
        },
        referral_code: referralCode,
        newsletter: newsletterSignup,
      })
      .then((res) => {
        if (res !== null) location.reload();
      });
  };

  // Utility functions
  const walletSelectConfirm = (address: string) => {
    $secondButton = 'Select';
    $secondButtonClass = 'green-button';
    $handleSecondButton = () => {
      handleWalletSelect(address);
      $showModal = false;
    };
    $modalContent =
      '<h2>Are you sure you want to select this address as your main one?</h2>';
    $showModal = true;
  };

  const handleWalletSelect = async (address: string) => {
    await account.selectMainWallet(address);
    if ($accountError && $accountError.selectMainWallet) return;
    // reload the page to update the user object
    location.reload();
  };

  // SVG Icons
  let profileSvgFocus: boolean = false;
  let backArrowSvgFocus: boolean = false;
  let closeSvgFocus: boolean = false;
  let signInSvgFocus: boolean = false;
  let signOutSvgFocus: boolean = false;

  // Newsletter
  const checkSubscription = async () => {
    subStatus = await account.subscriptionStatus();
  };

  const dateToString = (date: Date) => {
    const dateObject: Date = new Date(date);

    const day: string = ('0' + dateObject.getDate()).slice(-2);
    const month: string = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const year: number = dateObject.getFullYear();

    const fullDate: string = `${day}.${month}.${year}`;
    return fullDate;
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<button
  class="profile-icon-container void-btn flex fade-in"
  aria-label="Profile"
  on:click={() => ($showProfile = true)}
  on:pointerover={() => (profileSvgFocus = true)}
  on:pointerout={() => (profileSvgFocus = false)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="circle-icon"
  >
    <defs>
      <mask id="profile-svg-mask">
        <circle r="95" fill="white" />
        <g
          class="profile-svg-mask"
          fill="black"
          transform={profileSvgFocus ? 'scale(1.1)' : ''}
        >
          <circle cy="-25" r="30" />
          <path
            d="
                M -55 55
                Q -60 20 -25 15
                L 25 15
                Q 60 20 55 55
                Z
              "
          />
        </g>
      </mask>
    </defs>

    <circle
      class="profile-svg"
      r="95"
      fill="rgba(51, 226, 230, 0.75)"
      mask="url(#profile-svg-mask)"
    />
  </svg>
</button>

<!-- svelte-ignore
a11y-click-events-have-key-events
a11y-no-noninteractive-element-interactions
a11y-no-static-element-interactions
a11y_no_noninteractive_element_to_interactive_role-->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={() => ($showProfile = false)}
  on:click|self={() => ($showProfile = false)}
>
  <div on:click|stopPropagation>
    <header class="flex">
      {#if isLogged}
        <button
          on:click={() => {
            account.signout();
          }}
          on:pointerover={() => (signOutSvgFocus = true)}
          on:pointerout={() => (signOutSvgFocus = false)}
        >
          <DoorSVG state="outside" {signOutSvgFocus} bigIcon={true} />
        </button>
      {:else}
        <button
          on:click|stopPropagation={handleBackArrow}
          on:pointerover={() => (backArrowSvgFocus = true)}
          on:pointerout={() => (backArrowSvgFocus = false)}
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
            <defs>
              <mask id="quit-svg-mask">
                <circle r="95" fill="white" />
                <path
                  class="quit-svg-mask"
                  d="
                      M 50 0
                      L -50 0
                      L 0 -50
                      M -50 0
                      L 0 50
                    "
                  fill="none"
                  stroke="black"
                  stroke-width="25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  transform={backArrowSvgFocus ? 'scale(1.2)' : ''}
                />
              </mask>
            </defs>

            <circle
              style="
                  transition: all 0.3s ease-in-out;
                  transform: {backArrowSvgFocus ? 'scale(1.05);' : 'none'}
                  fill: {backArrowSvgFocus
                ? 'rgb(51, 226, 230)'
                : 'rgba(51, 226, 230, 0.75)'}
                "
              fill="rgba(51, 226, 230, 0.75)"
              r="95"
              mask="url(#quit-svg-mask)"
            />
          </svg>
        </button>
      {/if}
      <button
        on:click|stopPropagation={() => ($showProfile = false)}
        on:pointerover={() => (closeSvgFocus = true)}
        on:pointerout={() => (closeSvgFocus = false)}
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="close-svg"
          stroke="rgba(255, 60, 64, 0.85)"
          stroke-width="30"
          stroke-linecap="round"
          style="
              transform: {closeSvgFocus ? 'scale(1.2);' : 'none'}
              stroke: {closeSvgFocus
            ? 'rgb(255, 60, 64)'
            : 'rgba(255, 60, 64, 0.85)'}
            "
        >
          <path
            d="
                M -65 -65
                L 65 65
                M -65 65
                L 65 -65
              "
            fill="none"
          />
        </svg>
      </button>
    </header>

    <!-- USER PROFILE -->
    {#if isLogged && user}
      <section class="profile-window flex">
        <hr />

        {#if user.available}
          <h4>
            Credits remaining this month:
            <strong>
              {user.available.bonus}
            </strong>
          </h4>
        {:else}
          <p class="validation">Error fetching credits...</p>
        {/if}

        <hr />

        {#if user?.email && user?.first_name}
          <div class="flex">
            <div class="input-container">
              <label for="mail">Email</label>
              <input
                id="mail"
                type="email"
                value={user.email}
                disabled
              />
            </div>
            {#if !user.email_confirmed && !user.is_oauth}
              <p class="validation">
                Please check your inbox and confirm email.
              </p>
            {/if}
            <div class="input-container">
              <label for="first-name">First name</label>
              <input
                id="first-name"
                type="text"
                value={user.first_name}
                disabled={true}
              />
            </div>
            <div class="input-container">
              <label for="last-name">Last name</label>
              <input
                id="last-name"
                type="text"
                value={user.last_name}
                disabled={true}
              />
            </div>

            {#if editingPassword}
              <div class="input-container">
                <label for="password">Old password</label>
                <input
                  id="password"
                  class:red-border={!editOldPassword}
                  type={$passwordVisible.edit ? 'text' : 'password'}
                  placeholder="Enter old password"
                  bind:value={editOldPassword}
                />
              </div>

              {#if !editOldPassword}
                <p class="validation">Please enter your old password</p>
              {/if}

              <div class="input-container">
                <label for="new-password">New password</label>
                <input
                  id="new-password"
                  class:red-border={!regexpPasswordValidation.test(
                    editPassword,
                  )}
                  type={$passwordVisible.edit ? 'text' : 'password'}
                  placeholder="Provide new password"
                  bind:value={editPassword}
                />
                <EyeSVG visibility="edit" />
              </div>
              <input
                class:red-border={!regexpPasswordValidation.test(
                  editPassword,
                ) || editPassword !== editPasswordConfirm}
                type={$passwordVisible.edit ? 'text' : 'password'}
                placeholder="Confirm new password"
                bind:value={editPasswordConfirm}
              />

              {#if editPassword}
                {#if !regexpRestrictedCharsCheck.test(editPassword)}
                  <p class="validation">
                    Password contains a restricted character!
                  </p>
                {:else if !regexpLengthCheck.test(editPassword)}
                  <p class="validation">
                    Password should contain 8 - 24 characters
                  </p>
                {/if}

                {#if !regexpSpecialCharCheck.test(editPassword)}
                  <p class="validation">
                    Provide at least one special character: @ $ ! % * # ? & , .
                  </p>
                {/if}

                {#if !regexpCapitalLetterCheck.test(editPassword)}
                  <p class="validation">Provide at least one capital letter</p>
                {/if}

                {#if !regexpLowercaseLetterCheck.test(editPassword)}
                  <p class="validation">
                    Provide at least one lowercase letter
                  </p>
                {/if}

                {#if !regexpNumberCheck.test(editPassword)}
                  <p class="validation">Provide at least one number</p>
                {/if}

                {#if editPasswordConfirm && editPassword !== editPasswordConfirm}
                  <p class="validation">Passwords do not match!</p>
                {/if}
              {:else}
                <p class="validation">Please enter new password</p>
              {/if}

              {#if $accountError && $accountError.changePassword}
                <p class="validation">{$accountError.changePassword}</p>
              {/if}
            {/if}

            {#if !user.is_oauth}
              <div class="flex-row">
                {#if editingPassword}
                  <button class="red-btn" on:click={() => (editingPassword = false)}>
                    Cancel
                  </button>
                  <button
                    class="green-btn"
                    on:click={saveChangedPassword}
                    disabled={!editPassword ||
                      !regexpPasswordValidation.test(editPassword) ||
                      editPassword !== editPasswordConfirm}
                  >
                    Save
                  </button>
                {:else}
                  <button on:click={() => (editingPassword = true)}>
                    Change password
                  </button>
                {/if}
              </div>
            {/if}
          </div>

          <hr />
        {/if}

        {#key user}
          <div class="web3-wallets flex">
            {#if user && !user.faux}
              {#if user.wallets && user.wallets.length >= 1}
                <h4>Connected Addresses</h4>
                <ul class="flex-row">
                  {#each user.wallets.filter((address) => !address.faux) as wallet, index}
                    <button
                      class="wallet void-btn flex-row pad-8 round-8 blue dark-txt"
                      class:active-wallet={wallet.wallet == user.main_wallet}
                      on:click={() => {
                        if (wallet.wallet != user!.main_wallet)
                          walletSelectConfirm(wallet.wallet);
                      }}
                    >
                      <h4>{index + 1}</h4>
                      <p class="pad-8 round-8 white-soft-txt dark-transparent-bg">
                        {wallet.wallet.slice(0, 6) +
                          '...' +
                          wallet.wallet.slice(-4)}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="star-svg"
                      >
                        <path
                          d="m12 3 2.23 6.88h7.23l-5.85 4.24L17.85 21 12 16.75 6.15 21l2.24-6.88-5.85-4.24h7.23L12 3z"
                        >
                        </path>
                      </svg>
                    </button>
                  {/each}
                </ul>
                {#if user?.email && user?.first_name}
                  <WalletConnect
                    linking={true}
                    title={'Add another address'}
                  />
                {/if}

                {#if $accountError && $accountError.selectMainWallet}
                  <p class="validation">{$accountError.selectMainWallet}</p>
                {/if}
              {/if}
            {:else}
              <WalletConnect linking={true} title={'Connect Web3 Wallet'} />
            {/if}
          </div>
        {/key}

        {#if user?.email && user?.first_name && user?.email_confirmed}
          <hr />

          {#if $referralCodes != null}
            {#key $referralCodes}
              <h4>Your referral codes</h4>
              <ul class="referral-codes flex-row">
                {#each $referralCodes as code}
                  <button
                    class="ref-code void-btn flex-row pad-8 round-8 dark-txt"
                    class:used-code={code.is_used}
                    id={code.code}
                    on:click={() =>
                      navigator.clipboard.writeText(code.code)}
                    aria-label="Copy code {code.code}"
                  >
                    <p class="pad-8 round-8 white-soft-txt dark-transparent-bg">
                      {code.code}
                    </p>
                    {#if !code.is_used}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="-100 -100 200 200"
                        class="copy-svg"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.75)"
                        stroke-width="15"
                        stroke-linejoin="round"
                        stroke-linecap="round"
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
                      </svg>
                    {/if}
                  </button>
                {/each}
                </ul>
            {/key}
            <h4>
              Your referrals: {$referralCodes.filter((code) => code.is_used)
                .length}
            </h4>
          {:else}
            <button
              on:click={() => {
                if (!user?.referred) {
                  window.open('/referral', '_self');
                } else
                  account
                    .generateReferralCode()
                    .then(() => window.location.reload());
              }}
            >
              Get referral codes
            </button>

            {#if $accountError && $accountError.generateReferralCode}
              <p class="validation">{$accountError.generateReferralCode}</p>
            {/if}
          {/if}
        {/if}

        {#if user.email_confirmed}
          {#if subStatus}
            <hr />

            {#if subStatus.is_active}
              <h4>Newsletter Subscription</h4>

              {#if subStatus.subscribed_at}
                <h5 class="pad-8 round-8 gray-transparent-bg green-txt shad">
                  Active since: {dateToString(subStatus.subscribed_at.Time)}
                </h5>
              {/if}
              <button
                class="unsubscribe-button void-btn"
                on:click={() => {
                  account
                    .unsubscribeNewsletter()
                    .then(() => checkSubscription());
                }}
              >
                Unsubscribe
              </button>
            {:else}
              <div class="newsletter-subscription">
                <h4>Subscribe to Newsletter:</h4>
                <button
                  class="green-btn"
                  on:click={() => {
                    account
                      .subscribeNewsletter()
                      .then(() => checkSubscription());
                  }}
                >
                  Subscribe
                </button>
              </div>
            {/if}
          {/if}

          {#if $accountError && $accountError.subscribeNewsletter}
            <p class="validation">{$accountError.subscribeNewsletter}</p>
          {/if}
          {#if $accountError && $accountError.unsubscribeNewsletter}
            <p class="validation">{$accountError.unsubscribeNewsletter}</p>
          {/if}
          {#if $accountError && $accountError.subscriptionStatus}
            <p class="validation">{$accountError.subscriptionStatus}</p>
          {/if}
        {/if}

        <hr />

        <h4>Report bugs or ask for help</h4>
        <div class="flex-row">
          <a href="mailto:support@degenerousdao.com">Support</a>
          <span style:color="#bebebe">|</span>
          <a href="https://discord.gg/349FgMSUK8">Discord</a>
        </div>
      </section>
    {:else}
      <section class="sign-container">
        <h1>{signUp ? 'Sign up' : 'Sign in'}</h1>
        <hr />

        {#if !signUp}
          <!-- SIGN-IN window -->
          {#if signInWithEmail}
            <form class="login-form">
              <div class="input-container">
                <label for="user-mail">Email</label>
                <input
                  bind:value={loginMail}
                  class="user-input"
                  type="email"
                  id="user-mail"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div class="input-container">
                <label for="user-password">Password</label>
                <div class="password-input-container">
                  <input
                    bind:value={loginPassword}
                    class="user-input"
                    type={$passwordVisible.login ? 'text' : 'password'}
                    id="user-password"
                    placeholder="Enter your password"
                    minlength="8"
                    required
                  />
                  <EyeSVG visibility="login" />
                </div>
              </div>

              {#if $accountError && $accountError.signin}
                <p class="validation">{$accountError.signin}</p>
              {/if}

              <button
                class="sign-in-button"
                on:click|preventDefault={() =>
                  account.signin({
                    email: loginMail,
                    password: loginPassword,
                  })}
                on:pointerover={() => {
                  if (loginMail && loginPassword) signInSvgFocus = true;
                }}
                on:pointerout={() => {
                  if (loginMail && loginPassword) signInSvgFocus = false;
                }}
                disabled={!(loginMail && loginPassword)}
              >
                <DoorSVG state="inside" {signInSvgFocus} />
                Sign in
              </button>
              <a href="/reset-password">Forgot password?</a>
              <!-- svelte-ignore a11y_missing_attribute -->
              <a
                href="/"
                on:click={(event) => {
                  event.preventDefault();
                  signUp = true;
                }}>Create account</a
              >
            </form>
          {:else}
            <!-- SIGN-IN general window -->
            <div class="buttons-container">
              <button
                on:click={() => {
                  account.googleSignin();
                }}
              >
                <img class="sign-icon" src="/icons/google.png" alt="Google" />
                <p class="sign-lable">with Google</p>
              </button>

              {#if $accountError && $accountError.googleSignin}
                <p class="validation">{$accountError.googleSignin}</p>
              {/if}

              <button
                on:click={() => {
                  signInWithEmail = true;
                }}
              >
                <img class="sign-icon" src="/icons/email.png" alt="Google" />
                <p class="sign-lable">with email</p>
              </button>
              <WalletConnect title={'with Web3 wallet'} />
            </div>
            <hr />
            <h3>Don't have an account yet?</h3>
            <div class="buttons-container">
              <button
                on:click={() => {
                  signUp = true;
                }}
              >
                <img class="sign-icon" src="/icons/email.png" alt="Google" />
                <p class="sign-lable">Sign up with email</p>
              </button>
            </div>
          {/if}
        {:else}
          <!-- SIGN-UP window -->

          <form class="signup-form">
            <div class="input-container">
              <label for="new-user-mail">Mail</label>
              <input
                class="user-input"
                class:red-border={!regexpEmail.test(email)}
                type="email"
                id="new-user-mail"
                placeholder="Enter email"
                bind:value={email}
                required
              />
            </div>

            {#if email && !regexpEmail.test(email)}
              <p class="validation">Please provide a valid email</p>
            {/if}

            <div class="input-container">
              <label for="new-user-password">Password</label>
              <div class="password-input-container">
                <input
                  class="user-input"
                  class:red-border={!regexpPasswordValidation.test(password)}
                  id="new-user-password"
                  placeholder="Enter password"
                  minlength="8"
                  type={$passwordVisible.signup ? 'text' : 'password'}
                  bind:value={password}
                  required
                />
                <EyeSVG visibility="signup" />
              </div>
            </div>
            <input
              class="user-input"
              class:red-border={!regexpPasswordValidation.test(password) ||
                password !== confirmPassword}
              id="confirm-new-user-password"
              placeholder="Confirm password"
              bind:value={confirmPassword}
              required
              type={$passwordVisible.signup ? 'text' : 'password'}
            />

            {#if password}
              {#if !regexpRestrictedCharsCheck.test(password)}
                <p class="validation">
                  Password contains a restricted character!
                </p>
              {:else if !regexpLengthCheck.test(password)}
                <p class="validation">
                  Password should contain 8 - 24 characters
                </p>
              {/if}

              {#if !regexpSpecialCharCheck.test(password)}
                <p class="validation">
                  Provide at least one special character: @ $ ! % * # ? & , .
                </p>
              {/if}

              {#if !regexpCapitalLetterCheck.test(password)}
                <p class="validation">Provide at least one capital letter</p>
              {/if}

              {#if !regexpLowercaseLetterCheck.test(password)}
                <p class="validation">Provide at least one lowercase letter</p>
              {/if}

              {#if !regexpNumberCheck.test(password)}
                <p class="validation">Provide at least one number</p>
              {/if}

              {#if confirmPassword && password !== confirmPassword}
                <p class="validation">Passwords do not match!</p>
              {/if}
            {:else}
              <p class="validation">Set a secure password</p>
            {/if}

            <div class="input-container">
              <label for="user-first-name">First name</label>
              <input
                class="user-input"
                class:red-border={!first_name.trim()}
                type="text"
                id="user-first-name"
                placeholder="Enter First name"
                bind:value={first_name}
              />
            </div>
            <div class="input-container">
              <label for="user-last-name">Last name</label>
              <input
                class="user-input"
                class:red-border={!last_name.trim()}
                type="text"
                id="user-last-name"
                placeholder="Enter Last name"
                bind:value={last_name}
              />
            </div>
            <div class="input-container">
              <label for="user-ref-code">Referral code</label>
              <input
                class="user-input"
                class:red-border={!referralCodeValid}
                type="text"
                id="user-ref-code"
                placeholder="A11A7528D9C82915"
                minlength="16"
                maxlength="16"
                bind:value={referralCode}
                required
              />
            </div>

            {#if referralCode.length === 16}
              {#await account.validateReferralCode(referralCode)}
                <p class="validation">Checking referral code...</p>
              {:then referralObject}
                {#if referralObject}
                  <p class="validation green">Referral code is valid</p>
                {:else}
                  <p class="validation">Referral code is invalid</p>
                {/if}
              {:catch}
                <p class="validation">Some error occured...</p>
              {/await}
            {:else if referralCode}
              <p class="validation">Code should contain 16 characters</p>
            {:else}
              <p class="validation">
                Enter your referral code. Don't have one yet? Find yours
                <a
                  href="https://discord.gg/349FgMSUK8"
                  target="_blank"
                  rel="noopener noreferrer">here</a
                >!
              </p>
            {/if}

            {#if !mandatoryFields}
              <p class="validation">Fill all required fields</p>
            {/if}

            {#if $accountError && $accountError.signup}
              <p class="validation">{$accountError.signup}</p>
            {/if}

            <div class="agreements-container">
              <div class="agreement">
                <input
                  type="checkbox"
                  id="terms"
                  on:change={(event: any) => {
                    termsAccepted = event.target?.checked;
                  }}
                />
                <label
                  for="terms"
                  class="terms"
                  style={termsAccepted ? '' : 'color: rgba(255, 50, 50, 0.75);'}
                >
                  * I have read and agree to the <a
                    href="https://docs.google.com/document/d/1fEemq6HVM_h8ZTbc_Fl_k3RvlPdjYd70TI1iloT5gXA/edit?usp=sharing"
                    target="_blank"
                    style={termsAccepted
                      ? ''
                      : 'color: rgba(255, 50, 50, 0.9);'}
                  >
                    Terms of Service</a
                  >.
                </label>
              </div>
              <div class="agreement">
                <input
                  type="checkbox"
                  id="newsletter"
                  on:change={(event: any) => {
                    newsletterSignup = event.target?.checked;
                  }}
                />
                <label for="newsletter" class="newsletter">
                  I'd like to receive news twice a month.
                </label>
              </div>
            </div>
            <button
              class="sign-button"
              on:click={referralSignup}
              disabled={!isFormValid}>Create account</button
            >
          </form>
        {/if}
      </section>
    {/if}
  </div>
</dialog>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  .profile-icon-container {
    width: 4rem;
    border-radius: 50%;

    &:hover,
    &:active,
    &:focus {
      @include scale;
      @include bright;
    }

    svg {
      width: inherit;
      border-radius: inherit;
    }
  }

  header {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .profile-window {
    /* <!-- USER PROFILE --> */
    .web3-wallets {
      ul {
        flex-wrap: wrap;
      }

      .wallet {
        min-width: 14rem;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.5rem;
        @include box-shadow;

        h4 {
          color: inherit;
        }

        p {
          @include box-shadow(soft, inset);
        }

        &:hover,
        &:active,
        &:focus {
          @include scale-up(soft);
          @include bright;
        }
      }

      .active-wallet {
        fill: $cyan;
        box-shadow: $shadow-plus-inset-glow;
        @include cyan(1, text);
        @include blue(1, bg, bright);

        p {
          color: $cyan;
        }
      }
    }
    
    .referral-codes {
      flex-wrap: wrap;

      .ref-code {
        gap: 0.5rem;
        @include green(0.75);
        @include box-shadow;

        p {
          @include box-shadow(soft, inset);
        }

        &:hover:not(.used-code),
        &:active:not(.used-code),
        &:focus:not(.used-code) {
          @include scale-up(soft);
          @include bright;
        }
      }

      .used-code {
        cursor: not-allowed;
        @include gray(0.25);

        p {
          @include white-txt(0.5);
        }
      }
    }

    .unsubscribe-button {
      @include red(0.5, text);

      &:hover,
      &:active,
      &:focus {
        text-decoration: underline;
        @include red(1, text);
      }
    }

    /* <!-- SIGN-IN window --> */
    
  }
</style>

<!-- <style>

  /* SIGN-IN & SIGN-UP */

  .sign-container,
  .login-form,
  .signup-form,
  .user-profile-info {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5vw;
  }

  .user-profile-info {
    gap: 1vw;
  }

  .login-form a {
    color: rgba(51, 226, 230, 0.65);
  }

  .login-form a:hover,
  .login-form a:active {
    color: rgb(51, 226, 230);
  }

  .agreements-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    width: 100%;
  }

  .agreement {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    padding: 1vw;
    gap: 1vw;
  }

  .agreement label {
    cursor: pointer;
  }

  #terms,
  #newsletter {
    /* -webkit-transform: scale(2);
    transform: scale(2); */
    width: 1.5vw;
    height: 1.5vw;
    flex: 1;
    accent-color: rgba(51, 226, 230, 0.75);
    cursor: pointer;
  }

  .terms > a {
    color: rgba(255, 255, 255, 0.65);
  }


  /* Referral codes container */

  .referral-codes {
    width: 90%;
    padding: 1vw 2vw;
    margin-inline: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    justify-content: center;
    gap: 1vw;
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25);
    border-radius: 1vw;
    background-color: rgba(51, 226, 230, 0.1);
  }

  .ref-code-container {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.1);
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

  .copy-svg {
    width: 2vw;
    height: 2vw;
  }

  .active-code {
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
    cursor: text;
  }

  /* Newsletter */

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

  /* Profile icon */

  .profile-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media only screen and (max-width: 600px) {
    dialog {
      width: 100vw;
      height: 100%;
      border-radius: 1em;
      overflow-y: scroll;
    }

    dialog > div {
      padding: 1em;
    }

    .back-arrow,
    .close-button,
    .login-button {
      padding: 0.35em;
    }

    .back-arrow svg,
    .close-button svg {
      height: 1.5em;
      width: 1.5em;
    }

    .sign-container,
    .login-form,
    .signup-form,
    .user-profile-info,
    .agreement,
    .wallets-container,
    .edit-buttons,
    ul {
      gap: 1em;
    }

    .edit-buttons,
    .wallet-connect {
      flex-direction: column;
    }

    ul {
      flex-flow: column nowrap;
      max-width: none;
    }

    .wallet {
      min-width: 75vw;
      gap: 0.5em;
      padding: 0.25em 0.5em;
      font-size: 1.2em;
      width: auto;
      border-radius: 0.5em;
    }

    .wallet span {
      width: 100%;
      padding: 0.25em 1em;
      font-size: 1em;
      border-radius: 0.5em;
    }

    .star-svg {
      height: 1.75em;
      width: 1.75em;
    }

    #terms,
    #newsletter {
      /* -webkit-transform: scale(1.5);
      transform: scale(1.5); */
      width: 1em;
      height: 1em;
    }

    .profile-window {
      gap: 0.5em;
      padding-block: 0.5em;
    }

    .referral-codes {
      grid-template-columns: 100%;
      gap: 0.5em;
      padding: 1em;
      width: 100%;
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

    .copy-svg {
      width: 1em;
      height: 1em;
    }

    .newsletter-subscription {
      gap: 0.5em;
    }
  }

  @keyframes zoom {
    from {
      transform: scale(1.5);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style> -->
