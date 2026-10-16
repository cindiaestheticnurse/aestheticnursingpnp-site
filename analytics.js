/* Google Analytics 4 for aestheticnursingpnp.com.
   To turn tracking on, paste the GA4 Measurement ID (looks like G-XXXXXXXXXX) between the quotes below.
   Until then this file does nothing. Form events are sent by site.js (generate_lead, click_phone,
   click_calendar, click_email, click_google_review, file_download, form_error). */
(function () {
  var GA_ID = '';
  if (!GA_ID) return;
  var s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
})();
