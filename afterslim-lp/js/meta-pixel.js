/* Meta (Facebook) Pixel base loader.
 *
 * The Pixel ID lives HERE, in one place. Replace META_PIXEL_ID below with the
 * real id from Meta Events Manager (Events Manager > Data Sources > your pixel >
 * the ~15-16 digit ID). Use the SAME id for the server-side Conversions API
 * (env META_PIXEL_ID in the admin app).
 *
 * Until a real id is set, this file no-ops (no pixel, no console errors), so it
 * is safe to deploy before the id exists — it activates the moment the id is
 * filled in and redeployed.
 *
 * Events: PageView (here) + ViewContent (home), InitiateCheckout (checkout),
 * Purchase (success) fired inline on those pages. The Purchase event uses
 * eventID 'fb_purchase_<PaymentIntent id>', matching the server-side CAPI
 * event, so Meta dedups browser + server into one conversion.
 */
(function () {
  window.META_PIXEL_ID = '1566823108153985';
  // No-op until a real id is set (guards against shipping a broken pixel).
  if (!window.META_PIXEL_ID || window.META_PIXEL_ID.indexOf('REPLACE_') === 0) return;

  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', window.META_PIXEL_ID);
  fbq('track', 'PageView');
})();
