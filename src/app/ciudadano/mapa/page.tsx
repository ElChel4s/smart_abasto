'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Map as MapIcon, Search, Navigation, Star, SlidersHorizontal, List, Clock, ChevronRight } from 'lucide-react';
import { getMercados } from '@/modules/mercados/repository';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/ui/LeafletMap'), { ssr: false });

export default function MapaPage() {
  const [mercados, setMercados] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'mapa' | 'lista'>('mapa');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'cercano' | 'puntuacion'>('cercano');
  const router = useRouter();

  useEffect(() => {
    getMercados().then(setMercados);
  }, []);

  // Filter and Sort logic
  const filteredMercados = mercados.filter(m => 
    m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.zona.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMercados = [...filteredMercados].sort((a, b) => {
    if (sortBy === 'cercano') {
      return a.distanciaNum - b.distanciaNum;
    } else {
      return b.calificacion - a.calificacion;
    }
  });

  return (
    <div className="flex-1 flex flex-col bg-[#E6E1D6] relative overflow-hidden pb-24">
      {/* Header Fijo con Selector de Vista */}
      <div className="pattern-rafia px-6 pt-12 pb-4 relative z-20 border-b border-[var(--dorado-gamlp)]/30 shadow-sm shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-display text-2xl text-[var(--texto-fuerte)] font-bold flex items-center gap-2">
              <MapIcon size={24} className="text-[var(--rojo-carmesi)]" /> Red de Mercados
            </h1>
            <p className="text-[var(--texto-suave)] text-[11px] font-medium mt-0.5">Encuentra los mercados cívicos autorizados.</p>
          </div>
        </div>

        {/* Tab deslizante Mapa vs Lista */}
        <div className="tab-slider-bg w-full">
          <button 
            onClick={() => setActiveTab('mapa')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 flex justify-center items-center gap-1.5
              ${activeTab === 'mapa' ? 'bg-[var(--bg-tarjeta)] text-[var(--texto-fuerte)] shadow-sm' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'}`}
          >
            <MapIcon size={14}/> Mapa Interactivo
          </button>
          <button 
            onClick={() => setActiveTab('lista')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 flex justify-center items-center gap-1.5
              ${activeTab === 'lista' ? 'bg-[var(--bg-tarjeta)] text-[var(--texto-fuerte)] shadow-sm' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'}`}
          >
            <List size={14}/> Lista de Mercados
          </button>
        </div>
      </div>

      {/* VISTA 1: MAPA INTERACTIVO */}
      {activeTab === 'mapa' && (
        <div className="flex-1 relative anim-stagger min-h-[500px]">
          <MapComponent 
            markers={mercados.map(m => ({
              id: m.id,
              lat: m.lat,
              lng: m.lng,
              title: m.nombre,
              subtitle: m.calificacion.toString(),
              icon: m.img
            }))}
            onMarkerClick={(id) => router.push(`/ciudadano/mercado/${id}`)}
          />
        </div>
      )}

      {/* VISTA 2: LISTA DE MERCADOS */}
      {activeTab === 'lista' && (
        <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll p-6 space-y-4 anim-stagger">
          
          {/* Barra de búsqueda y ordenación */}
          <div className="flex gap-2 shrink-0">
            <div className="flex-1 bg-[var(--bg-tarjeta)] border border-[var(--dorado-gamlp)]/40 rounded-xl flex items-center px-3 shadow-sm focus-within:border-[var(--dorado-gamlp)] transition-all">
              <Search size={16} className="text-[var(--texto-suave)] mr-2" />
              <input 
                type="text" 
                placeholder="Busca mercado Rodríguez, Sopocachi..."
                className="w-full bg-transparent border-none outline-none py-3 text-sm text-[var(--texto-fuerte)] placeholder:text-[var(--texto-suave)]/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filtros de ordenamiento */}
          <div className="flex gap-2 text-xs font-bold items-center shrink-0">
            <span className="text-[9px] uppercase tracking-wider text-[var(--texto-suave)] flex items-center gap-1"><SlidersHorizontal size={10}/> Ordenar por:</span>
            <button 
              onClick={() => setSortBy('cercano')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${sortBy === 'cercano' ? 'bg-[var(--rojo-carmesi)] border-[var(--rojo-carmesi)] text-white shadow-sm' : 'bg-white border-[var(--borde)] text-[var(--texto-suave)]'}`}
            >
              📍 Más Cercanos
            </button>
            <button 
              onClick={() => setSortBy('puntuacion')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${sortBy === 'puntuacion' ? 'bg-[var(--dorado-gamlp)] border-[var(--dorado-gamlp)] text-white shadow-sm' : 'bg-white border-[var(--borde)] text-[var(--texto-suave)]'}`}
            >
              ⭐ Mejor Puntuación
            </button>
          </div>

          {/* Listado */}
          <div className="space-y-4 flex-1">
            {sortedMercados.map((m) => (
              <Link href={`/ciudadano/mercado/${m.id}`} key={m.id} className="block card-organic interactive p-4 bg-[var(--bg-tarjeta)] cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[var(--bg-maiz)] rounded-2xl flex items-center justify-center text-3xl border border-[var(--borde)] shadow-sm shrink-0">
                    {m.img}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-display font-bold text-[var(--texto-fuerte)] text-[15px] leading-tight truncate">{m.nombre}</h3>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-[var(--texto-fuerte)] shrink-0 bg-[var(--dorado-claro)] text-[var(--dorado-gamlp)] px-1.5 py-0.5 rounded border border-[var(--dorado-gamlp)]/30">
                        <Star size={10} fill="currentColor"/> {m.calificacion}
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--texto-suave)] flex items-center gap-1 font-medium mb-1">
                      <Navigation size={10} className="text-[var(--rojo-carmesi)]" /> A {m.distancia} de ti • {m.zona}
                    </p>
                    <p className="text-[10px] text-[var(--verde-palta)] font-bold flex items-center gap-1">
                      <Clock size={10}/> {m.horario}
                    </p>

                    {/* Chips de servicios */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {m.servicios.slice(0, 2).map((srv: string, i: number) => (
                        <span key={i} className="text-[9px] font-bold bg-[var(--bg-maiz)] text-[var(--texto-suave)] px-2 py-0.5 rounded border border-[var(--borde)]">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <ChevronRight size={18} className="text-gray-300 shrink-0" />
                </div>
              </Link>
            ))}

            {sortedMercados.length === 0 && (
              <div className="text-center py-10">
                <span className="text-4xl opacity-50 block mb-2">🔍</span>
                <p className="text-sm text-[var(--texto-suave)] font-bold">No encontramos mercados.</p>
                <p className="text-xs text-[var(--texto-suave)] mt-1">Prueba escribiendo otra zona o palabra.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
