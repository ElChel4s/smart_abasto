import { getMercadoById } from '@/modules/mercados/repository';
import { getCaserasPorMercado } from '@/modules/inventario/repository';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, Clock, Car, AlertCircle, Coffee, Star, HandHeart, Filter } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function MercadoDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const market = await getMercadoById(id);
  
  if (!market) {
    notFound();
  }

  const caserasDelMercado = await getCaserasPorMercado(id);
  caserasDelMercado.sort((a,b) => b.calificacion - a.calificacion);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[var(--bg-maiz)] z-30 absolute inset-0 md:overflow-hidden overflow-y-auto hide-scroll anim-stagger">
      
      {/* Sidebar (Market Info) */}
      <div className="md:w-1/3 md:h-full md:overflow-y-auto pattern-rafia px-6 pt-12 pb-6 relative shadow-sm md:border-r border-b md:border-b-0 border-[var(--dorado-gamlp)]/30 shrink-0">
        <Link href="/" className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tarjeta)]/90 backdrop-blur rounded-full mb-4 shadow-sm hover:bg-white transition-colors border border-[var(--borde)]">
          <ChevronLeft size={22} className="text-[var(--texto-fuerte)]" />
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[var(--bg-tarjeta)] rounded-2xl flex items-center justify-center text-4xl shadow-md border border-[var(--borde)]">
            {market.img}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--texto-fuerte)] leading-tight">{market.nombre}</h1>
            <p className="text-[11px] font-bold text-[var(--rojo-carmesi)] uppercase tracking-wider flex items-center gap-1 mt-1">
              <MapPin size={10}/> {market.zona}
            </p>
          </div>
        </div>

        {/* Bloque de Información General del Mercado */}
        <div className="bg-[var(--bg-tarjeta)] rounded-xl p-4 border border-[var(--borde)] shadow-sm text-xs space-y-2 mt-4">
          <div className="flex items-start gap-2">
            <Calendar size={14} className="text-[var(--texto-suave)] shrink-0 mt-0.5"/>
            <div>
              <span className="font-bold text-[var(--texto-fuerte)] block">Días de Atención:</span>
              <span className="text-[var(--texto-suave)]">{market.dias}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-[var(--texto-suave)] shrink-0 mt-0.5"/>
            <div>
              <span className="font-bold text-[var(--texto-fuerte)] block">Horarios:</span>
              <span className="text-[var(--texto-suave)]">{market.horario}</span>
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-[var(--borde)] flex flex-wrap gap-1.5">
            {market.servicios.map((srv: string, idx: number) => (
              <span key={idx} className="bg-[var(--bg-maiz)] border border-[var(--borde)] px-2 py-1 rounded-md text-[10px] font-bold text-[var(--texto-suave)] flex items-center gap-1">
                {srv.includes('Parqueo') && <Car size={10}/>}
                {srv.includes('Baño') && <AlertCircle size={10}/>}
                {srv.includes('Comedor') && <Coffee size={10}/>}
                {srv}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content (Caseras Directory) */}
      <div className="md:w-2/3 md:h-full md:overflow-y-auto px-6 py-6 pb-28">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-[var(--texto-fuerte)] uppercase tracking-widest">Directorio de Caseras</h2>
          <div className="text-[10px] text-[var(--texto-suave)] flex items-center gap-1 bg-[var(--bg-tarjeta)] px-2 py-1 rounded border border-[var(--borde)]">
            <Filter size={10}/> Mejor Calificadas
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caserasDelMercado.map((casera) => (
            <Link href={`/casera/${casera.id}`} key={casera.id} className="block card-organic interactive p-4 relative overflow-hidden bg-[var(--bg-tarjeta)]">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-[var(--dorado-claro)] rounded-full flex items-center justify-center font-display text-xl text-[var(--dorado-gamlp)] font-bold border border-[var(--dorado-gamlp)]/30 shrink-0">
                  {casera.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-[var(--texto-fuerte)]">{casera.nombre}</h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--texto-fuerte)]">
                      <Star size={12} className="text-[var(--verde-palta)]" fill="currentColor"/> {casera.calificacion}
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--texto-suave)] mb-1">Puesto {casera.puesto} • {casera.especialidad}</p>
                  
                  <div className="flex gap-1 flex-wrap mt-1">
                    {casera.apadrinada && (
                      <span className="text-[9px] font-bold bg-[var(--rojo-claro)] text-[var(--rojo-carmesi)] px-2 py-1 rounded border border-[var(--rojo-carmesi)]/20 flex items-center gap-1">
                        <HandHeart size={10}/> Validada
                      </span>
                    )}
                    <span className="text-[9px] font-bold bg-[var(--verde-claro)] text-[var(--verde-palta)] px-2 py-1 rounded border border-[var(--verde-palta)]/20 flex items-center gap-1">
                      Abierto
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
