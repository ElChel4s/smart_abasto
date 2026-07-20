import { supabase } from '@/shared/lib/supabase';

export interface AlertaWaze {
  id: string;
  tipo: 'agotado' | 'precio_alto';
  inventarioId: string;
  productoNombre: string;
  tiempo: string;
  activa: boolean;
}

export async function getAlertasActivas(caseraId: string): Promise<AlertaWaze[]> {
  // Join inventario -> productos_maestro to get the name
  const { data, error } = await supabase
    .from('alertas_waze')
    .select(`
      id,
      tipo_alerta,
      inventario_id,
      activa,
      creado_en,
      inventario (
        productos_maestro (
          nombre
        )
      )
    `)
    .eq('casera_id', caseraId)
    .eq('activa', true)
    .order('creado_en', { ascending: false });
    
  if (error || !data) {
    console.error("Error fetching alertas:", error);
    return [];
  }
  
  return data.map((alerta: any) => {
    const diffMin = Math.floor((new Date().getTime() - new Date(alerta.creado_en).getTime()) / 60000);
    const tiempoStr = diffMin < 60 ? `Hace ${diffMin} min` : `Hace ${Math.floor(diffMin / 60)} horas`;
    const prodNombre = alerta.inventario?.productos_maestro?.nombre || 'Producto';

    return {
      id: alerta.id,
      tipo: alerta.tipo_alerta as 'agotado' | 'precio_alto',
      inventarioId: alerta.inventario_id,
      productoNombre: prodNombre,
      tiempo: tiempoStr,
      activa: alerta.activa
    };
  });
}

export async function crearAlertaWaze(inventarioId: string, caseraId: string, ciudadanoId: string | undefined, tipo: 'agotado' | 'precio_alto'): Promise<boolean> {
  const { error } = await supabase
    .from('alertas_waze')
    .insert({
      inventario_id: inventarioId,
      casera_id: caseraId,
      ciudadano_id: ciudadanoId || null,
      tipo_alerta: tipo,
      activa: true
    });
  
  if (error) {
    console.error("Error creando alerta:", error);
    return false;
  }
  return true;
}

export async function resolverAlertaWaze(alertaId: string, accion: 'confirmar' | 'ignorar', inventarioId: string, tipoAlerta: 'agotado' | 'precio_alto'): Promise<boolean> {
  // 1. Desactivar la alerta
  const { error: errorAlerta } = await supabase
    .from('alertas_waze')
    .update({ activa: false })
    .eq('id', alertaId);

  if (errorAlerta) {
    console.error("Error resolviendo alerta:", errorAlerta);
    return false;
  }

  // 2. Si la acción es confirmar, actualizamos el inventario real
  if (accion === 'confirmar') {
    if (tipoAlerta === 'agotado') {
      const { error: errorInv } = await supabase
        .from('inventario')
        .update({ disponible: false })
        .eq('id', inventarioId);
        
      if (errorInv) console.error("Error actualizando disponibilidad:", errorInv);
    }
    // Si fuera precio_alto, la casera debería actualizar su precio manualmente o se podría mostrar un input.
    // Por ahora, solo desactivamos la alerta o marcamos agotado.
  }

  return true;
}

// Para compatibilidad temporal con componentes que la usaban
export function getAlertasIniciales(): AlertaWaze[] {
  return [];
}
