import { supabase } from '@/lib/supabase';

export async function loginUsuario(email: string, password: string) {
  // En un sistema real esto usaría supabase.auth.signInWithPassword
  // Para el prototipo, consultamos directo a la tabla de usuarios simulada.
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    console.error('Error en login:', error);
    return null;
  }
  return data;
}

export async function registrarUsuario(nombre: string, email: string, password: string, rol: 'ciudadano' | 'casera' = 'ciudadano') {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, email, password, rol }])
    .select()
    .single();

  if (error || !data) {
    console.error('Error en registro:', error);
    return null;
  }
  
  // Si se registró como casera, le creamos su perfil en blanco en la tabla 'caseras'
  if (rol === 'casera') {
    const { error: caseraError } = await supabase
      .from('caseras')
      .insert([{ 
        nombre: nombre,
        puesto: 'Nuevo Puesto',
        especialidad: 'General',
        calificacion: 5.0
      }]);
      
    if (caseraError) {
      console.error('Error creando perfil de casera:', caseraError);
      // No bloqueamos el registro del usuario, pero logueamos el error
    }
  }
  
  return data;
}
