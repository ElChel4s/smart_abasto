'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Map as MapIcon, ChevronLeft } from 'lucide-react';
import { getMercados } from '@/modules/mercados/repository';

export default function MapaPage() {
  const [mercados, setMercados] = useState<any[]>([]);

  useEffect(() => {
    getMercados().then(setMercados);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#E6E1D6] relative overflow-hidden pb-24 h-full">
      <div className="absolute top-0 inset-x-0 p-6 pt-12 z-20 bg-gradient-to-b from-black/60 to-transparent flex items-center gap-3">
        <Link href="/" className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl text-[var(--bg-tarjeta)] font-bold flex items-center gap-2 drop-shadow-md">
            <MapIcon size={24} /> Red de Mercados
          </h1>
          <p className="text-[var(--bg-tarjeta)]/80 text-[11px] font-medium mt-1 drop-shadow">Encuentra los mercados cívicos cerca de ti.</p>
        </div>
      </div>

      <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] bg-[#D0C9B4] min-h-screen">
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
          <path d="M 50 150 Q 150 200 250 100 T 350 300" stroke="#D32F2F" strokeWidth="4" fill="none" strokeDasharray="8 8" />
        </svg>

        {mercados.map((m, idx) => (
          <Link 
            href={`/mercado/${m.id}`}
            key={m.id} 
            className="absolute flex flex-col items-center cursor-pointer group z-10"
            style={{ top: `${30 + (idx * 25)}%`, left: `${25 + (idx * 30)}%` }}
          >
            <div className="bg-[var(--bg-tarjeta)] px-3 py-1.5 rounded-lg shadow-xl font-bold text-xs text-[var(--texto-fuerte)] mb-2 whitespace-nowrap transform group-hover:-translate-y-1 transition-transform border border-[var(--dorado-gamlp)]">
              {m.nombre}
            </div>
            <div className="w-12 h-12 bg-[var(--rojo-carmesi)] rounded-full flex items-center justify-center text-[var(--bg-tarjeta)] shadow-xl border-2 border-[var(--bg-tarjeta)] group-hover:scale-110 transition-transform">
              <span className="text-2xl">{m.img}</span>
            </div>
            <div className="w-6 h-2 bg-black/20 rounded-[50%] mt-1 blur-[1px]"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
