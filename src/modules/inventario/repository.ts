// src/modules/inventario/repository.ts
// Repositorio central conectado a Supabase

import { supabase } from '@/shared/lib/supabase';
import { getMercadoById } from '@/modules/mercados/repository';

// ==========================================
// TIPOS
// ==========================================

export interface Producto {
  id: string;
  producto: string;
  icono: string;
  precio: number;
  unidad: string;
  disponible: boolean;
  tendencia: 'estable' | 'sube' | 'baja';
  producto_id?: string;
}

export interface Ahijada {
  id: string;
  nombre: string;
  puesto: string;
  especialidad: string;
  inventario: Producto[];
}

export interface CaseraData {
  id: string;
  mercado_id: string;
  nombre: string;
  puesto: string;
  especialidad: string;
  calificacion: number;
  horario: string;
  metodos_pago: string[];
  sector: string;
  apadrinada?: boolean;
  madrina_id?: string;
  madrina_de?: string;
}

export interface ProductoBase {
  id: string;
  nombre: string;
  categoria: string;
  icono: string;
}

export interface InventarioItem {
  id: string;
  casera_id: string;
  producto_id: string;
  precio: number;
  unidad: string;
}

export interface Comentario {
  id: string;
  casera_id: string;
  autor: string;
  texto: string;
  fecha: string;
  estrellas: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
  bg: string;
  color: string;
}

// ==========================================
// CATEGORIAS MOCK (Esto se mantiene visual)
// ==========================================

export const bdCategorias: Categoria[] = [
  { id: 'cat_todas', nombre: 'Todo', icono: '🛒', bg: '#F0EAE1', color: '#796661' },
  { id: 'cat1', nombre: 'Verduras', icono: '🥬', bg: '#E8F5E9', color: '#388E3C' },
  { id: 'cat2', nombre: 'Frutas', icono: '🍎', bg: '#FFEBEE', color: '#D32F2F' },
  { id: 'cat3', nombre: 'Carnes', icono: '🥩', bg: '#FFF5D1', color: '#D4AF37' },
  { id: 'cat4', nombre: 'Lácteos', icono: '🧀', bg: '#FFF3E0', color: '#E65100' },
];

// ==========================================
// FUNCIONES — App Casera
// ==========================================

export async function getInventario(caseraId: string): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('inventario')
    .select('*, productos_maestro(*)')
    .eq('casera_id', caseraId);
    
  if (error || !data) return [];
  
  return data.map(inv => ({
    id: inv.id,
    producto_id: inv.producto_id,
    producto: inv.productos_maestro?.nombre || 'Producto Desconocido',
    icono: inv.productos_maestro?.icono_generico || '📦',
    precio: Number(inv.precio),
    unidad: inv.unidad_medida,
    disponible: inv.disponible,
    tendencia: 'estable'
  }));
}

export async function getProductosMaestro(): Promise<ProductoBase[]> {
  const { data, error } = await supabase.from('productos_maestro').select('*');
  if (error || !data) return [];
  return data.map(p => ({
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    icono: p.icono_generico
  }));
}

export async function createProductoMaestro(nombre: string, categoria: string, icono: string): Promise<ProductoBase | null> {
  const newProduct = {
    nombre,
    categoria,
    icono_generico: icono,
    peso_estandar_kg: 1.0
  };
  const { data, error } = await supabase.from('productos_maestro').insert([newProduct]).select().single();
  if (error) {
    console.error("Error creating producto maestro:", error);
    return null;
  }
  return {
    id: data.id,
    nombre: data.nombre,
    categoria: data.categoria,
    icono: data.icono_generico
  };
}

export async function updateInventario(caseraId: string, inventario: Producto[]): Promise<boolean> {
  try {
    const upserts = inventario.map(p => ({
      casera_id: caseraId,
      producto_id: p.producto_id || '', // Requiere que p tenga producto_id
      precio: p.precio,
      unidad_medida: p.unidad,
      disponible: p.disponible,
      precio_estandar_kilo: p.precio, // Idealmente calculado según unidad
    })).filter(u => u.producto_id !== '');
    
    // Primero, eliminar los productos que ya no están en la lista final
    const keepIds = upserts.map(u => u.producto_id);
    if (keepIds.length > 0) {
      await supabase.from('inventario').delete().eq('casera_id', caseraId).not('producto_id', 'in', `(${keepIds.join(',')})`);
    } else {
      await supabase.from('inventario').delete().eq('casera_id', caseraId);
    }

    // Luego, insertar o actualizar los que sí están
    if (upserts.length > 0) {
      const { error } = await supabase.from('inventario').upsert(upserts, { onConflict: 'casera_id, producto_id' });
      if (error) throw error;
    }
    
    return true;
  } catch (err) {
    console.error("Error updating inventario:", err);
    return false;
  }
}

export async function getAhijada(madrinaId: string): Promise<Ahijada | null> {
  const { data: ahijada, error } = await supabase.from('caseras').select('*').eq('madrina_id', madrinaId).maybeSingle();
    
  if (error || !ahijada) return null;
  
  const inventario = await getInventario(ahijada.id);
  
  return {
    id: ahijada.id,
    nombre: ahijada.nombre,
    puesto: ahijada.nro_puesto,
    especialidad: ahijada.especialidad,
    inventario
  };
}

export async function updateInventarioAhijada(ahijadaId: string, inventario: Producto[]): Promise<boolean> {
  return updateInventario(ahijadaId, inventario);
}

export async function updateDisponibilidadProducto(inventarioId: string, disponible: boolean): Promise<boolean> {
  const { error } = await supabase.from('inventario').update({ disponible }).eq('id', inventarioId);
  if (error) {
    console.error("Error updating disponibilidad:", error);
    return false;
  }
  return true;
}

// ==========================================
// FUNCIONES — App Ciudadano
// ==========================================

function formatCasera(c: any): CaseraData {
  return {
    id: c.id,
    mercado_id: c.mercado_id,
    nombre: c.nombre,
    puesto: c.nro_puesto || 'S/N',
    especialidad: c.especialidad || 'Varios',
    calificacion: Number(c.reputacion_score),
    horario: c.horario || 'Horario de mercado',
    metodos_pago: ['Efectivo', 'QR Yape'], // Hardcodeado por ahora
    sector: c.sector || 'General',
    apadrinada: c.apadrinada,
    madrina_id: c.madrina_id
  };
}

export async function getCaseraById(id: string): Promise<CaseraData | undefined> {
  const { data, error } = await supabase.from('caseras').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return formatCasera(data);
}

export async function getCaserasPorMercado(mercadoId: string): Promise<CaseraData[]> {
  const { data, error } = await supabase.from('caseras').select('*').eq('mercado_id', mercadoId);
  if (error || !data) return [];
  return data.map(formatCasera);
}

export async function getInventarioByCasera(caseraId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('inventario')
    .select('*, productos_maestro(*)')
    .eq('casera_id', caseraId);
    
  if (error || !data) return [];
  return data.map(inv => ({
    ...inv,
    producto: {
      id: inv.productos_maestro?.id,
      nombre: inv.productos_maestro?.nombre,
      categoria: inv.productos_maestro?.categoria,
      icono: inv.productos_maestro?.icono_generico
    }
  }));
}

export async function getComentariosByCasera(caseraId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('evaluacion_caseras')
    .select('*, perfiles(nombre_completo)')
    .eq('casera_id', caseraId)
    .order('creado_en', { ascending: false });
    
  if (error || !data) return [];
  
  return data.map(c => ({
    id: c.id,
    casera_id: c.casera_id,
    autor: c.perfiles?.nombre_completo || 'Ciudadano',
    texto: c.comentario || '',
    fecha: new Date(c.creado_en).toLocaleDateString(),
    estrellas: c.calificacion_estrellas,
    pesoJusto: c.peso_fiel,
    etiquetas: c.etiquetas_rapidas || []
  }));
}

export async function submitResenaCasera(resena: any): Promise<boolean> {
  const { error } = await supabase.from('evaluacion_caseras').insert([resena]);
  if (error) {
    console.error("Error submitting review:", error);
    return false;
  }
  return true;
}

export async function getCatalogoOfertas(): Promise<any[]> {
  // Solución al problema N+1: Hacemos un JOIN anidado para traer el mercado en la misma consulta
  const { data, error } = await supabase
    .from('inventario')
    .select('*, productos_maestro(*), caseras(*, mercados(*))');
    
  if (error || !data) return [];
  
  return data.map(inv => {
    if (!inv.productos_maestro || !inv.caseras) return null; // Skip invalid entries
    
    // Transformar el mercado al formato esperado por la UI usando los datos del JOIN
    const m = inv.caseras.mercados;
    const mercadoFormateado = m ? {
      id: m.id,
      nombre: m.nombre,
      zona: m.zona,
      distancia: '1.2 km',
      distanciaNum: 1.2,
      img: m.nombre.includes('Rodríguez') ? '🏠' : m.nombre.includes('Sopocachi') ? '🏘️' : '🏢',
      lat: Number(m.latitud),
      lng: Number(m.longitud),
      calificacion: Number(m.reputacion_infraestructura),
      horario: `${m.horario_apertura?.substring(0, 5)} - ${m.horario_cierre?.substring(0, 5)}`,
      dias: m.dias_feria_ampliada ? `${m.dias_atencion_normal} (${m.dias_feria_ampliada})` : m.dias_atencion_normal,
      servicios: ['Baños Públicos']
    } : null;

    return {
      ...inv,
      prod: {
        id: inv.productos_maestro.id,
        nombre: inv.productos_maestro.nombre,
        categoria: inv.productos_maestro.categoria,
        icono: inv.productos_maestro.icono_generico
      },
      casera: formatCasera(inv.caseras),
      mercado: mercadoFormateado
    };
  }).filter(Boolean); // Remove nulls
}
