<script>
  import { onMount } from 'svelte';

  let showBanner = false;
  let analyticsEnabled = false;

  onMount(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      showBanner = true;
    } else {
      analyticsEnabled = consent === 'full';
      if (analyticsEnabled) loadAnalytics();
    }
  });

  function acceptCookies(fullConsent) {
    analyticsEnabled = fullConsent;
    localStorage.setItem('cookieConsent', fullConsent ? 'full' : 'essential');

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
  <div class="cookie-banner">
    <p>
      We use cookies to provide you with a better service. By continuing to use
      this website, you consent to the use of cookies as described in our
      <a href="/privacy-policy">Privacy Policy</a>.
    </p>
    <button on:click={() => acceptCookies(true)}>Accept all</button>
    <button on:click={() => acceptCookies(false)}>Essential only</button>
  </div>
{/if}

<style>
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background-color: #333;
    color: white;
    text-align: center;
    z-index: 1000;
  }

  .cookie-banner p {
    margin: 0;
  }

  .cookie-banner button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #fff;
    color: #333;
    border: none;
    cursor: pointer;
    min-width: 100px;
  }
</style>
