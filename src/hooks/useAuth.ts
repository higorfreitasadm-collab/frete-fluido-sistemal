import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { isSupabaseReady, supabase } from '@/lib/supabase';

type AuthState = {
  session: Session | null;
  loading: boolean;
};

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

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setState({ session: data.session, loading: false });
      })
      .catch(() => {
        if (!active) return;
        setState({ session: null, loading: false });
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setState({ session, loading: false });
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}
