const readEnv = (key: string): string => {
  const viteEnv = import.meta.env as Record<string, string | boolean | undefined>;
  if (viteEnv?.[key]) return viteEnv[key] as string;

  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key] as string;
  }

  return "";
};

export const API_URL = readEnv("VITE_ADMIN_API_URL") || readEnv("NEXT_PUBLIC_ADMIN_API_URL");
export const WEB_API_URL = readEnv("VITE_WEB_API_URL") || readEnv("NEXT_PUBLIC_WEB_API_URL");
export const FAST_SONG_SHEET_ID = readEnv("VITE_FAST_SONG_SHEET_ID") || readEnv("NEXT_PUBLIC_FAST_SONG_SHEET_ID");
export const SLOW_SONG_SHEET_ID = readEnv("VITE_SLOW_SONG_SHEET_ID") || readEnv("NEXT_PUBLIC_SLOW_SONG_SHEET_ID");
export const CONFERENCE_SONG_SHEET_ID =
  readEnv("VITE_CONFERENCE_SONG_SHEET_ID") || readEnv("NEXT_PUBLIC_CONFERENCE_SONG_SHEET_ID");
export const SUPABASE_URL = readEnv("VITE_SUPABASE_URL") || readEnv("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = readEnv("VITE_SUPABASE_ANON_KEY") || readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
