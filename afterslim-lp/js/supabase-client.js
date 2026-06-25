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
  // Supabase "publishable key" (new format, equivalent to the legacy anon
  // key). Safe to commit because RLS policies on every public table
  // restrict reads/writes to the row owner — see supabase-migrations.sql
  // section 19 and supabase-migrations-002.sql section C.
  const SUPABASE_ANON_KEY = 'sb_publishable_JE-1QqBN36VLorfgIRq5_Q_CZYe0JDG';

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

  // PostHog identification.
  // Vincula o distinct_id anônimo do PostHog ao user real do Supabase
  // assim que a sessão existe (initial load, login, password recovery).
  // Reset no logout pra o próximo visitante não herdar a identidade.
  function identifyPostHog(user) {
    if (!user || !window.posthog || typeof window.posthog.identify !== 'function') return;
    try {
      window.posthog.identify(user.id, {
        email: user.email,
        supabase_id: user.id,
        full_name: (user.user_metadata && user.user_metadata.full_name) || null,
      });
    } catch (e) { /* swallow */ }
  }
  function resetPostHog() {
    if (!window.posthog || typeof window.posthog.reset !== 'function') return;
    try { window.posthog.reset(); } catch (e) { /* swallow */ }
  }
  // Initial session check (covers reload of an already-logged-in tab).
  client.auth.getSession().then(function (res) {
    if (res && res.data && res.data.session && res.data.session.user) {
      identifyPostHog(res.data.session.user);
    }
  });
  client.auth.onAuthStateChange(function (event, session) {
    if (event === 'SIGNED_IN' && session && session.user) {
      identifyPostHog(session.user);
    } else if (event === 'SIGNED_OUT') {
      resetPostHog();
    } else if (event === 'TOKEN_REFRESHED' && session && session.user) {
      identifyPostHog(session.user);
    }
  });

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
        // Use replace() so the unauthed page doesn't sit in browser history.
        // The page stays hidden via html[data-auth="pending"] until nav.
        window.location.replace('/account/login?next=' + encodeURIComponent(back));
        return new Promise(() => {});           // never resolves
      }
      // Auth confirmed — reveal the page if it was being held hidden.
      if (document.documentElement.dataset.auth === 'pending') {
        document.documentElement.dataset.auth = 'ok';
      }
      return user;
    },

    /** Bounce to home (or next) if already signed in. Used on /login + /signup. */
    async redirectIfAuthed() {
      const user = await this.user();
      if (user) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || '/';
        window.location.href = next;
        return true;
      }
      return false;
    },

    async signInWithGoogle(redirectTo) {
      return client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || (window.location.origin + '/'),
        },
      });
    },

    /**
     * First-name greeting for the nav. Order of preference:
     *   profiles.first_name -> user_metadata.first_name
     *   -> user_metadata.full_name (first word) -> Google "name" (first word)
     *   -> "Usuário NNNNNN" deterministic fallback so legacy customers
     *      who signed up before we collected names still see a
     *      personalised label instead of "Account".
     */
    async displayName() {
      const user = await this.user();
      if (!user) return null;
      const meta = user.user_metadata || {};
      if (meta.first_name) return String(meta.first_name).trim().split(' ')[0];
      if (meta.full_name)  return String(meta.full_name).trim().split(' ')[0];
      if (meta.name)       return String(meta.name).trim().split(' ')[0];
      try {
        const { data } = await client
          .from('profiles')
          .select('first_name, full_name')
          .eq('id', user.id)
          .maybeSingle();
        if (data) {
          if (data.first_name) return String(data.first_name).trim().split(' ')[0];
          if (data.full_name)  return String(data.full_name).trim().split(' ')[0];
        }
      } catch (e) { /* fall through */ }
      const tail = (user.id || '').replace(/[^0-9]/g, '').slice(-6) || '000000';
      return 'Usuário ' + tail;
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
