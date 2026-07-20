'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, TrendingDown, Star, AlertCircle, AlertTriangle, Check, Plus, Store } from 'lucide-react';
import { getCatalogoOfertas, bdCategorias } from '@/modules/inventario/repository';
import { useCart } from '@/shared/context/CartContext';
import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const initCategoria = searchParams.get('categoria') || 'cat_todas';

  const [listaOfertas, setListaOfertas] = useState<any[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState(initCategoria);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recomendado');
  const [showFilters, setShowFilters] = useState(false);

  const { cart, toggleCart } = useCart();
  const { isLoggedIn, setShowLoginModal } = useAuth();
  const { showToast } = useToast();
  const [alertas, setAlertas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      const ofertas = await getCatalogoOfertas();
      setListaOfertas(ofertas);
    }
    loadData();
  }, []);

  const reportarFalta = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setAlertas(prev => ({ ...prev, [id]: true }));
    showToast("¡Gracias! Tu alerta ayuda a la comunidad.", "warning");
  };

  let filtered = listaOfertas;
  if (filtroCategoria !== 'cat_todas') {
    const cat = bdCategorias.find(c => c.id === filtroCategoria);
    if (cat) filtered = filtered.filter(o => o.prod.categoria === cat.nombre);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(o => 
      o.prod.nombre.toLowerCase().includes(q) || 
      o.prod.categoria.toLowerCase().includes(q) ||
      o.casera.nombre.toLowerCase().includes(q)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'precio_asc') return a.precio - b.precio;
    if (sortBy === 'precio_desc') return b.precio - a.precio;
    if (sortBy === 'calificacion_desc') return b.casera.calificacion - a.casera.calificacion;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-28">
      {/* Header y Búsqueda */}
      <div className="pattern-rafia px-6 pt-12 pb-4 relative shadow-sm border-b border-[var(--dorado-gamlp)]/30 shrink-0 sticky top-0 z-30">
        <Link href="/" className="absolute top-4 left-4 text-[var(--texto-suave)] hover:text-black font-bold text-sm">← Volver</Link>
        <h1 className="font-display text-2xl font-bold text-[var(--texto-fuerte)] flex items-center gap-2 mb-4 mt-6">
          <Search size={24} className="text-[var(--rojo-carmesi)]"/> Catálogo Abasto
        </h1>
        
        <div className="flex gap-2 mb-4 relative">
          <div className="flex-1 bg-[var(--bg-tarjeta)] border border-[var(--dorado-gamlp)]/40 rounded-xl flex items-center px-3 shadow-sm focus-within:border-[var(--dorado-gamlp)] transition-all">
            <Search size={16} className="text-[var(--texto-suave)] mr-2" />
            <input 
              type="text" 
              placeholder="Busca carne, tomate..."
              className="w-full bg-transparent border-none outline-none py-3 text-sm text-[var(--texto-fuerte)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-colors shadow-sm
              ${showFilters ? 'bg-[var(--dorado-claro)] border-[var(--dorado-gamlp)] text-[var(--dorado-gamlp)]' : 'bg-[var(--bg-tarjeta)] border-[var(--borde)] text-[var(--texto-suave)]'}`}
          >
            <SlidersHorizontal size={18}/>
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mb-4 bg-[var(--bg-tarjeta)] p-3.5 rounded-xl border border-[var(--dorado-gamlp)]/30 shadow-md anim-stagger">
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <button onClick={() => setSortBy('recomendado')} className={`px-3 py-2 rounded-lg border ${sortBy === 'recomendado' ? 'bg-[var(--texto-fuerte)] text-[var(--bg-tarjeta)]' : 'bg-transparent text-[var(--texto-suave)]'}`}>📍 Recomendados</button>
              <button onClick={() => setSortBy('precio_asc')} className={`px-3 py-2 rounded-lg border ${sortBy === 'precio_asc' ? 'bg-[var(--verde-claro)] border-[var(--verde-palta)] text-[var(--verde-palta)]' : 'bg-transparent text-[var(--texto-suave)]'}`}>Menor Precio</button>
            </div>
          </div>
        )}

        {/* Chips de Categoría */}
        <div className="flex gap-2 overflow-x-auto hide-scroll pb-2">
          {bdCategorias.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFiltroCategoria(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border flex items-center gap-1.5
                ${filtroCategoria === cat.id 
                  ? 'bg-[var(--rojo-carmesi)] text-[var(--bg-tarjeta)] border-[var(--rojo-carmesi)]' 
                  : 'bg-[var(--bg-tarjeta)] text-[var(--texto-suave)]'}`}
            >
              <span>{cat.icono}</span> {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sorted.map((oferta) => {
          const inCart = cart.some(c => c.id === oferta.id);
          const isAlertado = alertas[oferta.id];

          return (
            <div key={oferta.id} className={`card-organic p-4 transition-all ${isAlertado ? 'border-yellow-300 bg-yellow-50/50' : 'bg-[var(--bg-tarjeta)]'}`}>
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-xl bg-[var(--bg-maiz)] border border-[var(--borde)] flex items-center justify-center text-3xl shrink-0">
                  {oferta.prod.icono}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-display font-bold text-[var(--texto-fuerte)] text-sm">{oferta.prod.nombre}</h3>
                    <div className="text-right shrink-0">
                      <span className="block text-sm font-bold text-[var(--rojo-carmesi)]">Bs {oferta.precio.toFixed(2)}</span>
                      <span className="block text-[9px] text-[var(--texto-suave)]">/ {oferta.unidad}</span>
                    </div>
                  </div>
                  
                  <Link href={`/casera/${oferta.casera.id}`} className="block mt-1 bg-white px-2 py-1.5 rounded-lg border border-[var(--borde)]">
                    <p className="text-[11px] font-bold text-[var(--texto-fuerte)] flex items-center gap-1">
                      {oferta.casera.nombre} 
                      <span className="text-[9px] flex items-center bg-[var(--dorado-claro)] text-[var(--dorado-gamlp)] px-1 rounded">
                         <Star size={8} fill="currentColor" className="mr-0.5"/> {oferta.casera.calificacion}
                      </span>
                    </p>
                  </Link>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--borde)] flex justify-between items-center">
                {isAlertado ? (
                   <div className="text-[10px] font-bold text-yellow-600 flex items-center gap-1 bg-yellow-100/80 px-2 py-1 rounded">
                     <AlertCircle size={12}/> Reportado Agotado
                   </div>
                ) : (
                  <button onClick={() => reportarFalta(oferta.id)} className="text-[10px] font-medium text-[var(--texto-suave)] hover:text-yellow-600 flex items-center gap-1">
                    <AlertTriangle size={12} /> Informar problema
                  </button>
                )}
                
                <button 
                  onClick={() => toggleCart(oferta)}
                  className={`h-8 px-4 rounded-lg flex items-center justify-center transition-all shadow-sm border text-xs font-bold gap-1.5
                    ${inCart ? 'bg-[var(--verde-palta)] text-[var(--bg-tarjeta)] border-[var(--verde-palta)]' : 'bg-white text-[var(--texto-fuerte)]'}`}
                >
                  {inCart ? <><Check size={14} /> En Ruta</> : <><Plus size={14} /> Añadir a lista</>}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
