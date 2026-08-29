import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if valid configuration is present
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('jharkhand-sicp-demo') &&
  !supabaseAnonKey.includes('demo_key_placeholder')
);

// Create Supabase client with safe fallback
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Health check to verify live connectivity to Supabase backend
 */
export const checkSupabaseConnection = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { connected: false, reason: 'Configured with local resilient cache (demo keys)' };
  }

  try {
    const { data, error } = await supabase.from('universities').select('id').limit(1);
    if (error) throw error;
    return { connected: true, data };
  } catch (err) {
    console.warn('Supabase ping fallback:', err.message);
    return { connected: false, reason: err.message };
  }
};
