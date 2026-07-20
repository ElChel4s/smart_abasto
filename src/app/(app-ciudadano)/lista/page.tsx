'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, Plus, AlertTriangle, RefreshCcw, ListTodo, MapPin, Store } from 'lucide-react';
import { useCart } from '@/shared/context/CartContext';
import { useToast } from '@/shared/context/ToastContext';
import { getCaserasPorMercado } from '@/modules/inventario/repository';

export default function ListaPage() {
  const { cart, toggleCart } = useCart();
  const { showToast } = useToast();
  const [comprasHechas, setComprasHechas] = useState<string[]>([]);
  const [alertasAgotado, setAlertasAgotado] = useState<Record<string, boolean>>({});
  const [reemplazosDisponibles, setReemplazosDisponibles] = useState<Record<string, any[]>>({});

  const toggleCompra = (id: string) => {
    setComprasHechas(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const reportarAgotado = async (item: any) => {
    setAlertasAgotado(prev => ({ ...prev, [item.id]: true }));
    showToast(`${item.prod.nombre} reportado como agotado. Buscando reemplazos...`, 'warning');

    // Buscar otras caseras en el mismo mercado que vendan el mismo producto
    const caserasEnMercado = await getCaserasPorMercado(item.mercado.id);
    // Para simplificar, buscamos si hay reemplazos (simulado usando otras caseras del repositorio)
    const reemplazos = caserasEnMercado
      .filter((c: any) => c.id !== item.casera.id)
      .map((c: any) => ({
        id: `inv_alt_${c.id}`,
        casera: c,
        precio: item.precio * 1.1, // Simulado
        unidad: item.unidad
      }));

    setReemplazosDisponibles(prev => ({ ...prev, [item.id]: reemplazos }));
  };

  const aplicarReemplazo = (originalId: string, nuevoItem: any) => {
    // Reemplazar en el carrito
    showToast(`Producto reemplazado con la casera ${nuevoItem.casera.nombre}`, 'success');
    // Limpiar alertas
    setAlertasAgotado(prev => {
      const copy = { ...prev };
      delete copy[originalId];
      return copy;
    });
    setReemplazosDisponibles(prev => {
      const copy = { ...prev };
      delete copy[originalId];
      return copy;
    });
  };

  const total = cart.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-28 anim-stagger">
      {/* Cabecera */}
      <div className="pattern-rafia px-6 pt-12 pb-6 relative shadow-sm border-b border-[var(--dorado-gamlp)]/30 shrink-0">
        <Link href="/" className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tarjeta)] rounded-full mb-4 border border-[var(--borde)] hover:bg-white transition-colors">
          <ChevronLeft size={22} className="text-[var(--texto-fuerte)]" />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[var(--texto-fuerte)] flex items-center gap-2">
          <ListTodo size={24} className="text-[var(--rojo-carmesi)]" /> Ruta Inteligente
        </h1>
        <p className="text-[var(--texto-suave)] text-xs font-medium mt-1">Organiza tus compras eficientemente en el mercado.</p>
      </div>

      <div className="p-6 space-y-6">
        {cart.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-tarjeta)] rounded-2xl border border-[var(--borde)] p-6">
            <span className="text-4xl block mb-3">🛒</span>
            <h3 className="font-bold text-[var(--texto-fuerte)]">Tu lista está vacía</h3>
            <p className="text-xs text-[var(--texto-suave)] mt-1">Explora el catálogo y añade productos para armar tu ruta de compras.</p>
            <Link href="/catalogo" className="mt-4 inline-block bg-[var(--rojo-carmesi)] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-red-800 transition-colors">
              Ir al Catálogo
            </Link>
          </div>
        ) : (
          <>
            {/* Resumen de Ruta */}
            <div className="bg-gradient-to-r from-[var(--dorado-claro)] to-[var(--bg-tarjeta)] border border-[var(--dorado-gamlp)]/40 p-4 rounded-2xl shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-[var(--texto-suave)] uppercase tracking-wider block">Total Estimado</span>
                <span className="text-lg font-bold text-[var(--rojo-carmesi)]">Bs {total.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-[var(--texto-suave)] uppercase tracking-wider block">Progreso</span>
                <span className="text-sm font-bold text-[var(--verde-palta)]">
                  {comprasHechas.length} de {cart.length} comprados
                </span>
              </div>
            </div>

            {/* Listado de Compras agrupadas por Casera/Mercado */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[var(--texto-fuerte)] uppercase tracking-widest">Productos en tu Ruta</h2>
              
              {cart.map(item => {
                const comprado = comprasHechas.includes(item.id);
                const agotado = alertasAgotado[item.id];
                const reemplazos = reemplazosDisponibles[item.id] || [];

                return (
                  <div key={item.id} className={`card-organic p-4 transition-all ${comprado ? 'opacity-60 bg-gray-50' : 'bg-white'} ${agotado ? 'border-yellow-300' : ''}`}>
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <button 
                        onClick={() => toggleCompra(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                          ${comprado ? 'bg-[var(--verde-palta)] border-[var(--verde-palta)] text-white' : 'border-[var(--borde)] hover:border-[var(--dorado-gamlp)]'}`}
                      >
                        {comprado && <Check size={14} />}
                      </button>

                      {/* Info Producto */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-[var(--texto-fuerte)] text-sm ${comprado ? 'line-through text-[var(--texto-suave)]' : ''}`}>
                          {item.prod.nombre}
                        </h3>
                        <p className="text-[10px] text-[var(--texto-suave)] flex items-center gap-1 mt-0.5">
                          <Store size={10} /> {item.casera.nombre} • Puesto {item.casera.puesto}
                        </p>
                        <p className="text-[9px] text-[var(--texto-suave)] flex items-center gap-1">
                          <MapPin size={9} /> {item.mercado.nombre}
                        </p>
                      </div>

                      {/* Precio */}
                      <div className="text-right shrink-0">
                        <span className="block text-sm font-bold text-[var(--texto-fuerte)]">Bs {item.precio.toFixed(2)}</span>
                        <span className="block text-[9px] text-[var(--texto-suave)]">/ {item.unidad}</span>
                      </div>
                    </div>

                    {/* Flujo de stock agotado y reemplazo */}
                    {!comprado && (
                      <div className="mt-3 pt-3 border-t border-dashed border-[var(--borde)] flex justify-between items-center">
                        {agotado ? (
                          <div className="text-[10px] text-yellow-600 font-bold flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <AlertTriangle size={12} /> Agotado reportado
                          </div>
                        ) : (
                          <button 
                            onClick={() => reportarAgotado(item)}
                            className="text-[10px] text-[var(--texto-suave)] hover:text-yellow-600 font-medium flex items-center gap-1"
                          >
                            <AlertTriangle size={12} /> ¿No tiene stock?
                          </button>
                        )}

                        <button 
                          onClick={() => toggleCart(item)}
                          className="text-[10px] text-red-600 hover:underline font-bold"
                        >
                          Quitar
                        </button>
                      </div>
                    )}

                    {/* Reemplazos Sugeridos */}
                    {agotado && reemplazos.length > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50/50 rounded-xl border border-yellow-200/50 space-y-2">
                        <p className="text-[10px] font-bold text-yellow-800 flex items-center gap-1">
                          <RefreshCcw size={10} className="animate-spin" /> Alternativas recomendadas:
                        </p>
                        <div className="space-y-2">
                          {reemplazos.map((alt: any) => (
                            <div key={alt.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100 text-xs">
                              <div>
                                <span className="font-bold block text-[var(--texto-fuerte)]">{alt.casera.nombre}</span>
                                <span className="text-[9px] text-[var(--texto-suave)]">Puesto {alt.casera.puesto}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[var(--rojo-carmesi)]">Bs {alt.precio.toFixed(2)}</span>
                                <button 
                                  onClick={() => aplicarReemplazo(item.id, alt)}
                                  className="bg-[var(--verde-palta)] text-white px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1"
                                >
                                  <Plus size={8} /> Cambiar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
