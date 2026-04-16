const getEnv = (key: string, fallback = "") => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const appEnv = {
  supabaseUrl: getEnv("VITE_SUPABASE_URL"),
  supabaseAnonKey: getEnv("VITE_SUPABASE_ANON_KEY"),
  apiBaseUrl: getEnv("VITE_API_BASE_URL", ""),
};

export const hasSupabaseConfig = Boolean(
  appEnv.supabaseAnonKey && isValidHttpUrl(appEnv.supabaseUrl),
);
