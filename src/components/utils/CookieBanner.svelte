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
  <div class="cookie-banner blur">
    <h3>
      We use cookies to provide you with a better service. By continuing to use
      this website, you consent to the use of cookies as described in our
      <a
        href="https://docs.google.com/document/d/1kkIY-86y2LtoM4IXzp80E5H7Op1YSezw8nPBG1AQ2uo/edit?usp=sharing"
        target="_blank">Privacy Policy</a
      >.
    </h3>
    <div>
      <button on:click={() => acceptCookies(true)}>Accept all</button>
      <button on:click={() => acceptCookies(false)}>Essential only</button>
    </div>
  </div>
{/if}

<style>
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    text-align: center;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding: 1.5vw;
    background-color: rgba(1, 0, 32, 0.75);
    box-shadow: 0 0 0.5vw #010020;
    z-index: 1000;
  }

  h3 {
    width: 75%;
    line-height: 2.5vw;
  }

  .cookie-banner div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1.5vw;
  }

  @media only screen and (max-width: 600px) {
    .cookie-banner {
      gap: 1em;
      padding: 1.5em;
    }

    h3 {
      width: 100%;
      line-height: 1.5em;
    }

    .cookie-banner div {
      gap: 1em;
    }
  }
</style>
