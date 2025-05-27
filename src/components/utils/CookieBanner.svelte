<script>
  import { onMount } from 'svelte';
  import {
    GetCache,
    SetCache,
    COOKIE_CONSENT_KEY,
    COOKIE_CONSENT_TTL,
  } from '@constants/cache';

  let showBanner = false;
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

    SetCache(
      COOKIE_CONSENT_KEY,
      fullConsent ? 'full' : 'essential',
      COOKIE_CONSENT_TTL,
    );

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
  <div class="container">
    <h5>
      We use cookies to provide you with a better service. By continuing to use
      this website, you consent to the use of cookies as described in our
      <a
        href="https://docs.google.com/document/d/1kkIY-86y2LtoM4IXzp80E5H7Op1YSezw8nPBG1AQ2uo/edit?usp=sharing"
        target="_blank">Privacy Policy</a
      >.
    </h5>
    <div class="flex-row">
      <button class="green-btn" on:click={() => acceptCookies(true)}>Accept all</button>
      <button on:click={() => acceptCookies(false)}>Essential only</button>
    </div>
  </div>
{/if}

<style>
  .container {
    position: fixed;
    bottom: 1rem;
    width: 75rem;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
