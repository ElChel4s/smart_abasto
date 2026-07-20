import { supabase } from '@/shared/lib/supabase';

export async function getMercados() {
  const { data, error } = await supabase.from('mercados').select('*');
  console.log('DEBUG getMercados => data:', data, 'error:', error);
  if (error) {
    console.error('Error fetching mercados:', error);
    return [];
  }
  
  // Mapeamos a la estructura que espera la UI
  return data.map(m => ({
    id: m.id,
    nombre: m.nombre,
    zona: m.zona,
    distancia: '1.2 km', // Mockeado temporalmente por falta de geolocalización real
    distanciaNum: 1.2,
    img: m.nombre.includes('Rodríguez') ? '🏠' : m.nombre.includes('Sopocachi') ? '🏘️' : '🏢', // Fallback emoji
    lat: Number(m.latitud),
    lng: Number(m.longitud),
    calificacion: Number(m.reputacion_infraestructura),
    horario: `${m.horario_apertura.substring(0, 5)} - ${m.horario_cierre.substring(0, 5)}`,
    dias: m.dias_feria_ampliada ? `${m.dias_atencion_normal} (${m.dias_feria_ampliada})` : m.dias_atencion_normal,
    servicios: ['Baños Públicos'] // Placeholder
  }));
}

export async function getMercadoById(id: string) {
  const { data, error } = await supabase.from('mercados').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;

  return {
    id: data.id,
    nombre: data.nombre,
    zona: data.zona,
    distancia: '1.2 km',
    distanciaNum: 1.2,
    img: data.nombre.includes('Rodríguez') ? '🏠' : data.nombre.includes('Sopocachi') ? '🏘️' : '🏢',
    lat: Number(data.latitud),
    lng: Number(data.longitud),
    calificacion: Number(data.reputacion_infraestructura),
    horario: `${data.horario_apertura.substring(0, 5)} - ${data.horario_cierre.substring(0, 5)}`,
    dias: data.dias_feria_ampliada ? `${data.dias_atencion_normal} (${data.dias_feria_ampliada})` : data.dias_atencion_normal,
    servicios: ['Baños Públicos']
  };
}
