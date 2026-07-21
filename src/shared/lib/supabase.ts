import { createClient } from '@supabase/supabase-js';

// Las variables deben inyectarse en el build (ARG en Dockerfile) para que Next.js las exponga al cliente.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
