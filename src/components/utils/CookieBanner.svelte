<script>
  import { onMount } from 'svelte';
  import { v4 as uuid } from 'uuid';

  import {
    GetCache,
    SetCache,
    COOKIE_CONSENT_KEY,
    TTL_MONTH,
  } from '@constants/cache';
  import { tempUserID } from '@stores/account.svelte';

  let showBanner = $state(false);
  let analyticsEnabled = false;

  onMount(() => {
    const cachedConsent = GetCache(COOKIE_CONSENT_KEY);
    if (!cachedConsent) {
      showBanner = true;
    } else {
      analyticsEnabled = cachedConsent === 'full';
      if (analyticsEnabled) loadAnalytics();
    }
  });

  function acceptCookies(fullConsent) {
    analyticsEnabled = fullConsent;

    // Set up the temporary ID for the Agent
    // $tempUserID = uuid();

    SetCache(COOKIE_CONSENT_KEY, fullConsent ? 'full' : 'essential', TTL_MONTH);

    if (fullConsent) {
      loadAnalytics();
    } else {
      disableAnalytics();
    }

    showBanner = false;
  }

  function loadAnalytics() {
    if (!document.getElementById('google-analytics')) {
      let script = document.createElement('script');
      script.id = 'google-analytics';
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YSHBY9F7FY';
      document.head.appendChild(script);

      script.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-YSHBY9F7FY', { anonymize_ip: true });
      };
    }
  }

  function disableAnalytics() {
    window['ga-disable-G-YSHBY9F7FY'] = true;
  }
</script>

{#if showBanner}
  <div class="opaque-container fade-in">
    <h5 class="white-txt">
      We use cookies to provide you with a better service.
    </h5>
    <p class="soft-white-txt">
      By continuing to use this website, you consent to the use of cookies as
      described in our
      <a
        href="https://docs.google.com/document/d/1kkIY-86y2LtoM4IXzp80E5H7Op1YSezw8nPBG1AQ2uo/edit?usp=sharing"
        target="_blank">Privacy Policy</a
      >.
    </p>
    <div class="flex-row">
      <button class="green-btn" onclick={() => acceptCookies(true)}
        >Accept all</button
      >
      <button onclick={() => acceptCookies(false)}>Essential only</button>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .opaque-container {
    width: 90%;
    position: fixed;
    bottom: 5rem;
    left: 50%;
    transform: translateX(-50%);

    @include respond-up(small-desktop) {
      bottom: 1rem;
      max-width: 75rem;
    }
  }
</style>
