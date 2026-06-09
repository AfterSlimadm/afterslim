/* Referral attribution capture.
 *
 * Drops the `?ref=CODE` query param into a 90-day cookie (afterslim_ref)
 * the first time a visitor lands with one. Exposes a helper that the
 * checkout reads when building the POST body for /api/checkout. Cookie
 * window matches the 90-day satisfaction guarantee.
 */
(function () {
  var COOKIE = 'afterslim_ref';
  var DAYS = 90;

  function readCookie(name) {
    var match = ('; ' + document.cookie).match(new RegExp('; ' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function writeCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      name + '=' + encodeURIComponent(value) +
      '; Expires=' + d.toUTCString() +
      '; Path=/' +
      '; SameSite=Lax' + secure;
  }

  function clearCookie(name) {
    document.cookie = name + '=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax';
  }

  try {
    var fromUrl = new URLSearchParams(location.search).get('ref');
    if (fromUrl) {
      var clean = fromUrl.trim().slice(0, 64);
      if (/^[A-Za-z0-9_\-]+$/.test(clean)) {
        writeCookie(COOKIE, clean, DAYS);
      }
    }
  } catch (e) { /* swallow */ }

  window.afterslimReferral = {
    code: function () { return readCookie(COOKIE); },
    clear: function () { clearCookie(COOKIE); }
  };
})();
