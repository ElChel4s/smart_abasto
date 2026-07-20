// src/modules/inventario/repository.ts
import { supabase } from '@/lib/supabase';

export interface Producto {
  id: string;
  producto: string;
  icono: string;
  precio: number;
  unidad: string;
  disponible: boolean;
  tendencia: 'estable' | 'sube' | 'baja';
}

export interface Ahijada {
  id: string;
  nombre: string;
  puesto: string;
  especialidad: string;
  inventario: Producto[];
}

// Datos quemados iniciales (para mock mientras conectas Supabase)
const inventarioInicial: Producto[] = [
  { id: 'inv1', producto: 'Papa Imilla', icono: '🥔', precio: 55.00, unidad: 'arroba', disponible: true, tendencia: 'estable' },
  { id: 'inv2', producto: 'Tomate Perita', icono: '🍅', precio: 5.00, unidad: 'cuarta', disponible: true, tendencia: 'estable' }, 
  { id: 'inv3', producto: 'Choclo Tierno', icono: '🌽', precio: 12.00, unidad: 'docena', disponible: true, tendencia: 'estable' },
  { id: 'inv4', producto: 'Zanahoria', icono: '🥕', precio: 3.00, unidad: 'cuartilla', disponible: true, tendencia: 'estable' },
];

const ahijadaInicial: Ahijada = {
  id: 'a1',
  nombre: 'Doña Rosita',
  puesto: 'N° 14 - Lácteos',
  especialidad: 'Quesos y Lácteos',
  inventario: [
    { id: 'ainv1', producto: 'Queso Criollo', icono: '🧀', precio: 15.00, unidad: 'kilo', disponible: true, tendencia: 'estable' },
    { id: 'ainv2', producto: 'Leche Fresca', icono: '🥛', precio: 6.00, unidad: 'litro', disponible: true, tendencia: 'estable' },
  ]
};

/**
 * Obtiene el inventario de la casera logueada.
 * Reemplazar con: supabase.from('inventario').select('*').eq('casera_id', caseraId)
 */
export async function getInventario(caseraId: string): Promise<Producto[]> {
  // Simulando retardo de red
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...inventarioInicial]); // Devuelve una copia
    }, 500);
  });
}

/**
 * Actualiza el inventario completo.
 * Reemplazar con operaciones upsert en Supabase.
 */
export async function updateInventario(caseraId: string, inventario: Producto[]): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Inventario de ${caseraId} actualizado en BD:`, inventario);
      resolve(true);
    }, 500);
  });
}

/**
 * Obtiene los datos de la ahijada apadrinada.
 */
export async function getAhijada(madrinaId: string): Promise<Ahijada | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...ahijadaInicial });
    }, 500);
  });
}

/**
 * Actualiza el inventario de la ahijada.
 */
export async function updateInventarioAhijada(ahijadaId: string, inventario: Producto[]): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Inventario de ahijada ${ahijadaId} actualizado en BD:`, inventario);
      resolve(true);
    }, 500);
  });
}

// --- Restored Exports for Citizen App ---
export const bdCategorias = [
  { id: 'cat_todas', nombre: 'Todas', bg: 'var(--verde-claro)', icono: '🧺' },
  { id: 'cat_tuberculos', nombre: 'Tubérculos', bg: 'var(--dorado-claro)', icono: '🥔' },
  { id: 'cat_verduras', nombre: 'Verduras', bg: 'var(--verde-claro)', icono: '🍅' },
  { id: 'cat_carnes', nombre: 'Carnes', bg: 'var(--rojo-claro)', icono: '🍗' },
  { id: 'cat_lacteos', nombre: 'Lácteos', bg: 'var(--bg-maiz)', icono: '🧀' },
  { id: 'cat_frutas', nombre: 'Frutas', bg: 'var(--dorado-claro)', icono: '🍎' },
];

export async function getCaseraById(id: string): Promise<any> {
  const { data, error } = await supabase
    .from('caseras')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !data) {
    console.error('Error fetching casera:', error);
    return null;
  }
  
  // Si no tiene metodos_pago por alguna razon (ej: datos viejos), ponemos un default
  if (!data.metodos_pago) {
    data.metodos_pago = ['Efectivo'];
  }
  
  return data;
}

const ofertasIniciales = [
  {
    id: 'o1',
    precio: 55.00,
    unidad: 'arroba',
    prod: { nombre: 'Papa Imilla', icono: '🥔', categoria: 'Tubérculos' },
    casera: { id: 'c1', nombre: 'Doña Rosita', calificacion: 4.8 }
  },
  {
    id: 'o2',
    precio: 5.00,
    unidad: 'cuarta',
    prod: { nombre: 'Tomate Perita', icono: '🍅', categoria: 'Verduras' },
    casera: { id: 'c1', nombre: 'Doña Rosita', calificacion: 4.8 }
  },
  {
    id: 'o3',
    precio: 12.00,
    unidad: 'docena',
    prod: { nombre: 'Choclo Tierno', icono: '🌽', categoria: 'Verduras' },
    casera: { id: 'c2', nombre: 'Doña Carmen', calificacion: 4.5 }
  },
  {
    id: 'o4',
    precio: 3.00,
    unidad: 'cuartilla',
    prod: { nombre: 'Zanahoria', icono: '🥕', categoria: 'Verduras' },
    casera: { id: 'c2', nombre: 'Doña Carmen', calificacion: 4.5 }
  }
];

export async function getCatalogoOfertas(): Promise<any[]> {
  const { data, error } = await supabase
    .from('ofertas')
    .select('*, productos(*), caseras(*, mercados(*))');

  if (error) {
    console.error('Error fetching ofertas:', error);
    return [];
  }

  // Mapeamos para que coincida con lo que espera el Frontend
  return (data || []).map(o => ({
    ...o,
    prod: o.productos,
    casera: o.caseras,
    mercado: o.caseras?.mercados
  }));
}

export async function getCaserasPorMercado(mercadoId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('caseras')
    .select('*')
    .eq('mercado_id', mercadoId);

  if (error) {
    console.error('Error fetching caseras:', error);
    return [];
  }

  return data || [];
}

export async function getInventarioByCasera(caseraId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('ofertas')
    .select('*, productos(*)')
    .eq('casera_id', caseraId);

  if (error) {
    console.error('Error fetching inventario casera:', error);
    return [];
  }

  // Mapeamos el producto_id a producto para que el frontend lo lea
  return (data || []).map(o => ({
    ...o,
    producto: o.productos
  }));
}

