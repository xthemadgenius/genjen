import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export const initSupabase = (): SupabaseClient | null => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found. Running in in-memory mode.');
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  }

  return supabase;
};

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabase;
};

export const isSupabaseEnabled = (): boolean => {
  return supabase !== null;
};