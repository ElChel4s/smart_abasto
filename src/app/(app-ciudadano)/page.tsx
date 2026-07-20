'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, ArrowRight, HandHeart, Store, Star, Navigation, Clock } from 'lucide-react';
import { getMercados } from '@/modules/mercados/repository';
import { getCaseraById } from '@/modules/inventario/repository';
import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';
import { bdCategorias } from '@/modules/inventario/repository'; // We can just use the exported array or function

export default function HomePage() {
  const { isLoggedIn, setShowLoginModal } = useAuth();
  const { showToast } = useToast();
  const [mercados, setMercados] = useState<any[]>([]);
  const [caseraMadrina, setCaseraMadrina] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const mercs = await getMercados();
      setMercados(mercs);
      const casera = await getCaseraById('c2222222-2222-2222-2222-222222222222');
      setCaseraMadrina(casera);
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-28">
      {/* Header con Patrón de Rafia Boliviana */}
      <div className="px-6 pt-12 pb-8 relative z-10 pattern-rafia border-b border-[var(--dorado-gamlp)]/30 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[var(--dorado-claro)] text-[var(--dorado-gamlp)] px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase border border-[var(--dorado-gamlp)]/50 flex items-center gap-1 shadow-sm">
                <ShieldCheck size={10}/> Ciudad Inteligente
              </span>
            </div>
            <h1 className="font-display text-4xl text-[var(--texto-fuerte)] font-extrabold leading-none tracking-tight">
              Abasto <br/> 
              <span className="text-[var(--rojo-carmesi)]">GAMLP.</span>
            </h1>
            <p className="text-[var(--texto-suave)] text-xs font-medium mt-3 max-w-[200px]">
              Descubre precios justos y apoya a nuestras caseras.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3 shrink-0">
            <Link href="/login" className="flex items-center gap-1.5 bg-[var(--dorado-gamlp)] text-white px-3 py-1.5 rounded-full shadow-sm hover:bg-[#9B7A1C] transition-colors">
              <Store size={14} />
              <span className="text-[10px] font-bold">Soy Casera</span>
            </Link>
            <button onClick={() => isLoggedIn ? showToast("Perfil ciudadano activo", "success") : setShowLoginModal(true)} className="flex items-center gap-1.5 bg-[var(--bg-tarjeta)] px-3 py-1.5 rounded-full border border-[var(--dorado-gamlp)]/50 shadow-sm hover:bg-[var(--dorado-claro)] transition-colors">
              <Users size={14} className={isLoggedIn ? "text-[var(--verde-palta)]" : "text-[var(--dorado-gamlp)]"} />
              <span className="text-[10px] font-bold text-[var(--texto-fuerte)]">
                {isLoggedIn ? 'Mi Cuenta' : 'Ingresar'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 pt-6 anim-stagger relative z-20 space-y-8">
        {/* Categorías (Catálogo rápido) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[var(--texto-fuerte)] uppercase tracking-widest">Explorar Catálogo</h2>
            <Link href="/catalogo" className="text-[10px] font-bold text-[var(--dorado-gamlp)] hover:underline flex items-center gap-1">Ver todo <ArrowRight size={10}/></Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {bdCategorias.filter(c => c.id !== 'cat_todas').map(cat => (
              <Link href={`/catalogo?categoria=${cat.id}`} key={cat.id} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-[var(--borde)] transition-transform group-hover:-translate-y-1 group-active:scale-95" style={{ backgroundColor: cat.bg }}>
                  {cat.icono}
                </div>
                <span className="text-[10px] font-bold text-[var(--texto-fuerte)] text-center leading-tight">{cat.nombre}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Casera de la semana (Madrina Flow) */}
        {caseraMadrina ? (
          <Link href={`/casera/${caseraMadrina.id}`} className="block">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HandHeart size={18} className="text-[var(--rojo-carmesi)]" />
                <h2 className="text-xs font-bold text-[var(--rojo-carmesi)] uppercase tracking-widest">Apoya a nuestras mayores</h2>
              </div>
            </div>
            
            <div className="card-organic interactive relative overflow-hidden p-5 bg-gradient-to-br from-[var(--dorado-claro)] to-[var(--bg-tarjeta)] border-[var(--dorado-gamlp)]/40 border-2">
              <div className="flex items-start gap-4 relative z-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-[var(--rojo-carmesi)] text-white flex items-center justify-center font-display text-2xl font-bold shadow-md border-2 border-[var(--bg-tarjeta)]">
                    {caseraMadrina.nombre.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[var(--verde-palta)] text-white flex items-center justify-center border-2 border-[var(--bg-tarjeta)] shadow-sm">
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-[var(--texto-fuerte)]">{caseraMadrina.nombre}</h3>
                  <p className="text-[11px] text-[var(--texto-suave)] flex items-center gap-1 mb-2">
                    <Store size={10}/> Puesto {caseraMadrina.puesto}
                  </p>
                  <p className="text-[10px] font-bold text-[var(--texto-fuerte)] bg-[var(--bg-tarjeta)]/80 px-2 py-1.5 rounded-md inline-block border border-[var(--borde)] shadow-sm leading-tight">
                    <span className="text-[var(--verde-palta)] block mb-0.5">Madrina Asignada</span>
                    Precios gestionados por comunidad.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-xs">
            ¡Por favor, corre el script SQL actualizado en Supabase para ver a las caseras!
          </div>
        )}

        {/* Mercados Cercanos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[var(--texto-fuerte)] uppercase tracking-widest">Mercados Cercanos</h2>
            <Link href="/mapa" className="text-[10px] font-bold text-[var(--dorado-gamlp)] flex items-center gap-1 hover:underline bg-[var(--dorado-claro)] px-2 py-1 rounded-md border border-[var(--dorado-gamlp)]/30">
              Ver mapa <ArrowRight size={10}/>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mercados.slice(0, 2).map(m => (
              <Link href={`/mercado/${m.id}`} key={m.id} className="card-organic interactive p-4 flex items-center gap-4 bg-[var(--bg-tarjeta)]">
                <div className="text-3xl w-12 h-12 bg-[var(--bg-maiz)] rounded-xl flex items-center justify-center border border-[var(--borde)]">
                  {m.img}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-[15px] font-bold text-[var(--texto-fuerte)] mb-0.5">{m.nombre}</h3>
                  <p className="text-[11px] text-[var(--texto-suave)] flex items-center gap-1 mb-1"><Navigation size={10} className="text-[var(--rojo-carmesi)]"/> A {m.distancia} de ti</p>
                  <p className="text-[9px] font-bold text-[var(--verde-palta)] flex items-center gap-1"><Clock size={9}/> {m.horario}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
