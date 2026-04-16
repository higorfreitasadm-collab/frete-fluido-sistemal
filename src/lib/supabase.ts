import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { appEnv, hasSupabaseConfig } from '@/config/env';

const createDisabledClient = (): SupabaseClient =>
  new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(
        'Supabase ainda nao foi configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.',
      );
    },
  });

export const isSupabaseReady = hasSupabaseConfig;

export const supabase: SupabaseClient = hasSupabaseConfig
  ? createClient(appEnv.supabaseUrl, appEnv.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : createDisabledClient();
