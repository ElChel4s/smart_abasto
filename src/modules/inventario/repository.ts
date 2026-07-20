// src/modules/inventario/repository.ts
// Este archivo está preparado para conectarse a Supabase de manera fácil.

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
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...ahijadaInicial, mercado_id: '11111111-1111-1111-1111-111111111111' });
    }, 500);
  });
}

export async function getCatalogoOfertas(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...inventarioInicial]);
    }, 500);
  });
}

export async function getCaserasPorMercado(mercadoId: string): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([ahijadaInicial]);
    }, 500);
  });
}

export async function getInventarioByCasera(caseraId: string): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...inventarioInicial]);
    }, 500);
  });
}

