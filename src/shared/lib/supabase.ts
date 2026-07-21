import { createClient } from '@supabase/supabase-js';

// Usamos placeholders para evitar que "npm run build" falle (Exit Code 1) en Docker
// si las variables de entorno aún no han sido inyectadas durante el "build time".
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
