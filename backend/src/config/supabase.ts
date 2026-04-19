import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Public client — uses anon key, respects RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — uses service role key, bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export { supabaseUrl, supabaseAnonKey };
