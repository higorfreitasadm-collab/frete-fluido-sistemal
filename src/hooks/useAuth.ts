import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { isSupabaseReady, supabase } from '@/lib/supabase';

type AuthState = {
  session: Session | null;
  loading: boolean;
};

const AUTH_BOOTSTRAP_TIMEOUT_MS = 3000;

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: isSupabaseReady,
  });

  useEffect(() => {
    if (!isSupabaseReady) {
      return;
    }

    let active = true;
    const timeoutId = window.setTimeout(() => {
      if (!active) return;
      setState({ session: null, loading: false });
    }, AUTH_BOOTSTRAP_TIMEOUT_MS);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        window.clearTimeout(timeoutId);
        setState({ session: data.session, loading: false });
      })
      .catch(() => {
        if (!active) return;
        window.clearTimeout(timeoutId);
        setState({ session: null, loading: false });
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      window.clearTimeout(timeoutId);
      setState({ session, loading: false });
    });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}
