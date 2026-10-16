/* Google Analytics 4 for aestheticnursingpnp.com.
   Paste the GA4 Measurement ID (looks like G-XXXXXXXXXX) between the quotes below to turn tracking on.
   Analytics does not load when the visitor's browser sends Global Privacy Control or Do Not Track,
   or when they turn it off on the Privacy Policy page. Advertising features are disabled.
   Form events come from site.js (generate_lead, form_error, click_phone, click_calendar, click_email,
   click_google_review, file_download) and never include what the visitor typed. */
(function () {
  var GA_ID = 'G-GE26L4E1W5';
  var OPT_KEY = 'anpnp_analytics_off';
  function optedOut() {
    try { if (localStorage.getItem(OPT_KEY) === '1') return true; } catch (e) {}
    return navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1';
  }
  // Opt-out button on the Privacy Policy page
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('gaOptOut');
    if (!b) return;
    function paint() {
      var off = false; try { off = localStorage.getItem(OPT_KEY) === '1'; } catch (e) {}
      b.textContent = off ? b.getAttribute('data-off') : b.getAttribute('data-on');
      b.setAttribute('aria-pressed', off ? 'true' : 'false');
    }
    b.addEventListener('click', function () {
      try {
        if (localStorage.getItem(OPT_KEY) === '1') localStorage.removeItem(OPT_KEY);
        else localStorage.setItem(OPT_KEY, '1');
      } catch (e) {}
      if (GA_ID) window['ga-disable-' + GA_ID] = (function () { try { return localStorage.getItem(OPT_KEY) === '1'; } catch (e) { return false; } })();
      paint();
    });
    paint();
  });
  if (!GA_ID || optedOut()) return;
  var s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
})();
