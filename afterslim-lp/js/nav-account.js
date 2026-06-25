/* Logged-in nav account dropdown.
 *
 * Public pages render a static <a class="nav-account" href="/account">Account</a>
 * link by default. When a Supabase session exists, this script swaps that
 * link for a "Welcome, {firstName}" trigger that opens a dropdown menu of
 * account shortcuts.
 *
 * Load order on every page that has .nav-account:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="/js/supabase-client.js"></script>
 *   <script src="/js/nav-account.js" defer></script>
 *
 * The script is no-op if window.afterslimAuth is missing, so pages that
 * load it without Supabase just keep the static link.
 */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    if (!window.afterslimAuth || !window.afterslimSupabase) return;
    var link = document.querySelector('.nav-account');
    if (!link) return;

    window.afterslimAuth.session().then(function (session) {
      if (!session || !session.user) return; // logged out: keep the link
      window.afterslimAuth.displayName().then(function (name) {
        mount(link, session.user, name);
      });
    });
  });

  function mount(originalLink, user, firstName) {
    var wrap = document.createElement('div');
    wrap.className = 'nav-account-wrap';

    // Trigger button replaces the <a>.
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-account nav-account-trigger';
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Open account menu');
    trigger.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
      '<span class="nav-account-label">Welcome, ' + escapeHtml(firstName) + '</span>' +
      '<svg class="nav-account-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="m6 9 6 6 6-6"/></svg>';

    // Dropdown.
    var dropdown = document.createElement('div');
    dropdown.className = 'nav-account-dropdown';
    dropdown.setAttribute('role', 'menu');
    dropdown.hidden = true;
    dropdown.innerHTML =
      '<div class="nav-account-menu-head">' +
        '<span class="nav-account-menu-eyebrow">Signed in as</span>' +
        '<span class="nav-account-menu-email">' + escapeHtml(user.email || '') + '</span>' +
      '</div>' +
      '<a class="nav-account-menu-item nav-account-menu-overview" href="/account">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' +
        '<span>Account overview</span>' +
      '</a>' +
      '<div class="nav-account-menu-sep"></div>' +
      '<a class="nav-account-menu-item" href="/account/orders">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
        '<span>Orders</span>' +
      '</a>' +
      '<a class="nav-account-menu-item" href="/account/subscriptions">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>' +
        '<span>Subscriptions</span>' +
      '</a>' +
      '<a class="nav-account-menu-item" href="/account/store-credit">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>' +
        '<span>Store credit</span>' +
      '</a>' +
      '<div class="nav-account-menu-sep"></div>' +
      '<a class="nav-account-menu-item" href="/account/addresses">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
        '<span>Shipping addresses</span>' +
      '</a>' +
      '<a class="nav-account-menu-item" href="/account/payment">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/></svg>' +
        '<span>Payment methods</span>' +
      '</a>' +
      '<a class="nav-account-menu-item" href="/account/tickets">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
        '<span>Support</span>' +
      '</a>' +
      '<a class="nav-account-menu-item" href="/account/settings">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
        '<span>Login &amp; security</span>' +
      '</a>' +
      '<div class="nav-account-menu-sep"></div>' +
      '<button type="button" class="nav-account-menu-item nav-account-menu-signout">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
        '<span>Sign out</span>' +
      '</button>';

    wrap.appendChild(trigger);
    wrap.appendChild(dropdown);
    originalLink.parentNode.replaceChild(wrap, originalLink);

    function open() {
      dropdown.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      wrap.classList.add('nav-account-wrap--open');
    }
    function close() {
      dropdown.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('nav-account-wrap--open');
    }

    trigger.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (dropdown.hidden) open(); else close();
    });
    document.addEventListener('click', function (ev) {
      if (!wrap.contains(ev.target)) close();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') close();
    });

    dropdown.querySelector('.nav-account-menu-signout').addEventListener('click', function () {
      close();
      window.afterslimAuth.signOut();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
