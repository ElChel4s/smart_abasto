import { supabase } from '@/lib/supabase';

export async function getMercados() {
  const { data, error } = await supabase.from('mercados').select('*');
  if (error) {
    console.error('Error fetching mercados:', error);
    return [];
  }
  return data || [];
}

export async function getMercadoById(id: string) {
  const { data, error } = await supabase.from('mercados').select('*').eq('id', id).single();
  if (error || !data) {
    console.error('Error fetching mercado:', error);
    return null;
  }
  return data;
}
