/* Shared Supabase client + auth helpers for AfterSlim customer account.
 *
 * The anon key is intentionally hardcoded here. Per Supabase docs the
 * anon key is safe to expose in client code as long as Row Level Security
 * policies are enforced on every public table (which they are: see
 * supabase-migrations.sql section 19 and supabase-migrations-002.sql
 * section C). The service_role key must NEVER appear here.
 *
 * Load order: this file must come AFTER the Supabase SDK script tag.
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="/js/supabase-client.js"></script>
 */

(function () {
  const SUPABASE_URL = 'https://qutpbtazoxlaegievmew.supabase.co';
  // TODO: replace this placeholder with the anon (public) key from
  // Supabase dashboard → Project Settings → API → anon public.
  // Until this is filled, every /account page will redirect to /account/login.
  const SUPABASE_ANON_KEY = '__SUPABASE_ANON_KEY_PLACEHOLDER__';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[supabase-client] Supabase SDK not loaded. Add <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> before this file.');
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,    // for email-link confirmations / resets
      storage: window.localStorage,
    },
  });

  window.afterslimSupabase = client;

  // Auth helpers
  window.afterslimAuth = {
    /** Resolve the current session (or null if unauthenticated). */
    async session() {
      const { data } = await client.auth.getSession();
      return data.session;
    },

    /** Resolve the current user (or null). */
    async user() {
      const { data } = await client.auth.getUser();
      return data.user;
    },

    /**
     * Redirect to /account/login if not signed in.
     * Call this near the top of every authenticated /account/* page.
     * Returns the user if authenticated, otherwise navigates away and
     * never resolves.
     */
    async requireAuth(redirectTo) {
      const user = await this.user();
      if (!user) {
        const back = redirectTo || (window.location.pathname + window.location.search);
        window.location.href = '/account/login?next=' + encodeURIComponent(back);
        return new Promise(() => {});           // never resolves
      }
      return user;
    },

    /** Bounce to dashboard if already signed in. Used on /login + /signup. */
    async redirectIfAuthed() {
      const user = await this.user();
      if (user) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || '/account';
        window.location.href = next;
        return true;
      }
      return false;
    },

    async signInWithPassword(email, password) {
      return client.auth.signInWithPassword({ email, password });
    },

    async signUp(email, password, fullName) {
      return client.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || '' },
          emailRedirectTo: window.location.origin + '/account/login',
        },
      });
    },

    async sendPasswordReset(email) {
      return client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/account/reset-password',
      });
    },

    async updatePassword(newPassword) {
      return client.auth.updateUser({ password: newPassword });
    },

    async signOut() {
      await client.auth.signOut();
      window.location.href = '/';
    },
  };

  // Utility: format cents as $XX.XX
  window.formatMoney = function (cents) {
    if (cents == null) return '$0.00';
    return '$' + (cents / 100).toFixed(2);
  };
})();
