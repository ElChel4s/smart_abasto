import { getCaseraById, getInventarioByCasera } from '@/modules/inventario/repository';
import { getMercadoById } from '@/modules/mercados/repository';
import Link from 'next/link';
import { ChevronLeft, Star, Store, MapPin, Clock, CreditCard, QrCode, HandHeart, Info } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CaseraDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const casera = await getCaseraById(id);
  
  if (!casera) {
    notFound();
  }

  const market = await getMercadoById(casera.mercado_id);
  const inventario = await getInventarioByCasera(casera.id);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[var(--bg-maiz)] z-40 absolute inset-0 md:overflow-hidden overflow-y-auto hide-scroll anim-stagger">
      
      {/* Sidebar (Casera Info) */}
      <div className="md:w-1/3 md:h-full md:overflow-y-auto pattern-rafia px-6 pt-12 pb-6 relative shadow-sm md:border-r border-b md:border-b-0 border-[var(--dorado-gamlp)]/30 shrink-0">
        <Link href={`/mercado/${market?.id}`} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tarjeta)] rounded-full mb-6 border border-[var(--borde)] hover:bg-white transition-colors">
          <ChevronLeft size={22} className="text-[var(--texto-fuerte)]" />
        </Link>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="w-24 h-24 bg-[var(--rojo-carmesi)] rounded-3xl flex flex-col items-center justify-center text-[var(--bg-tarjeta)] font-display text-4xl font-bold shadow-lg border-4 border-[var(--bg-tarjeta)] relative shrink-0">
            {casera.nombre.charAt(0)}
            <div className="absolute -bottom-3 bg-[var(--verde-palta)] text-[var(--bg-tarjeta)] text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1 border-2 border-[var(--bg-tarjeta)]">
              <Star size={10} fill="currentColor"/> {casera.calificacion}
            </div>
          </div>
          <div className="flex-1 mt-1">
            <h1 className="font-display text-2xl font-bold text-[var(--texto-fuerte)] leading-tight flex items-center gap-2">
              {casera.nombre}
            </h1>
            <p className="text-[var(--texto-suave)] text-xs font-medium flex items-center gap-1 mt-1"><Store size={12}/> {market?.nombre}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-[var(--verde-claro)] text-[var(--verde-palta)] text-[10px] font-bold px-2 py-1 rounded-full border border-[var(--verde-palta)]/30 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--verde-palta)] animate-pulse"></div> Abierto Ahora
            </div>
          </div>
        </div>

        {/* Bloque de Información General Casera */}
        <div className="bg-[var(--bg-tarjeta)] rounded-xl p-4 border border-[var(--borde)] shadow-sm grid grid-cols-2 gap-3 mt-4">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--texto-suave)] flex items-center gap-1 mb-1"><Clock size={10}/> Horario</p>
            <p className="text-xs font-bold text-[var(--texto-fuerte)]">{casera.horario}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--texto-suave)] flex items-center gap-1 mb-1"><MapPin size={10}/> Ubicación Exacta</p>
            <p className="text-xs font-bold text-[var(--texto-fuerte)]">{casera.sector}</p>
            <p className="text-[10px] text-[var(--texto-suave)]">Puesto {casera.puesto}</p>
          </div>
          <div className="col-span-2 pt-2 border-t border-[var(--borde)] flex items-center justify-between">
             <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--texto-suave)] flex items-center gap-1 mb-1"><CreditCard size={10}/> Medios de Pago</p>
                <div className="flex gap-1">
                  {casera.metodos_pago.map((pago: string, idx: number) => (
                    <span key={idx} className="bg-[var(--bg-maiz)] border border-[var(--borde)] px-2 py-0.5 rounded text-[10px] font-bold text-[var(--texto-fuerte)] flex items-center gap-1">
                      {pago.includes('QR') ? <QrCode size={10}/> : null} {pago}
                    </span>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {casera.apadrinada && (
          <div className="mt-4 bg-gradient-to-r from-[var(--dorado-claro)] to-[var(--bg-tarjeta)] border border-[var(--dorado-gamlp)]/40 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
            <Info size={18} className="text-[var(--dorado-gamlp)] shrink-0 mt-0.5" />
            <div>
               <p className="text-xs font-bold text-[var(--texto-fuerte)]">Iniciativa Casera Madrina</p>
               <p className="text-[10px] text-[var(--texto-suave)] mt-0.5 leading-tight">Los precios de esta casera son dictados solidariamente por una casera madrina (validada por la comunidad).</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Products) */}
      <div className="md:w-2/3 md:h-full md:overflow-y-auto p-6 pb-28">
        <h3 className="font-display font-bold text-lg mb-4 text-[var(--texto-fuerte)]">Productos Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventario.map(inv => (
            <div key={inv.id} className="bg-[var(--bg-tarjeta)] p-3 rounded-xl border border-[var(--borde)] flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--bg-maiz)] rounded-lg flex items-center justify-center text-2xl">
                {inv.producto?.icono}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--texto-fuerte)] text-sm">{inv.producto?.nombre}</p>
                <p className="text-[10px] text-[var(--texto-suave)]">{inv.producto?.categoria}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[var(--rojo-carmesi)]">Bs {inv.precio.toFixed(2)}</p>
                <p className="text-[9px] text-[var(--texto-suave)]">/ {inv.unidad}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
