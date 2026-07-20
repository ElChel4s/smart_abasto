// src/modules/compras/waze-alerts.ts
// Lógica de alertas comunitarias ("Waze de los mercados")
// TODO: Reemplazar con Supabase: supabase.from('alertas_waze').select('*')

export interface AlertaWaze {
  id: string;
  tipo: 'agotado' | 'precio_alto';
  productoId: string;
  productoNombre: string;
  reportes: number;
  tiempo: string;
  sugerencia?: number;
}

// Mock data - Reemplazar con consultas a Supabase
const alertasIniciales: AlertaWaze[] = [
  { id: 'al1', tipo: 'agotado', productoId: 'inv3', productoNombre: 'Choclo Tierno', reportes: 3, tiempo: 'Hace 15 min' },
  { id: 'al2', tipo: 'precio_alto', productoId: 'inv1', productoNombre: 'Papa Imilla', reportes: 2, tiempo: 'Hace 2 horas', sugerencia: 50.00 }
];

export async function getAlertas(caseraId: string): Promise<AlertaWaze[]> {
  // TODO: supabase.from('alertas_waze').select('*').eq('comerciante_id', caseraId)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...alertasIniciales]);
    }, 300);
  });
}

export function getAlertasIniciales(): AlertaWaze[] {
  return [...alertasIniciales];
}
