'use client';

import React from 'react';
import { Store, ShieldCheck, MessageSquare, Award, FileText, PackagePlus, HeartHandshake, Star } from 'lucide-react';

interface CaseraHomeProps {
  miPerfil: any;
  comentarios: any[];
  onEditarPuesto: () => void;
  onNavigateToSolidaria: () => void;
}

export default function CaseraHome({ miPerfil, comentarios, onEditarPuesto, onNavigateToSolidaria }: CaseraHomeProps) {

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-28 relative">
      <div className="px-6 pt-12 pb-8 relative z-10 pattern-rafia border-b border-[var(--dorado-gamlp)]/20 rounded-b-[2.5rem] shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-[var(--dorado-claro)] text-[var(--dorado-gamlp)] px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase border border-[var(--dorado-gamlp)]/50 flex items-center gap-1 mb-2 w-max shadow-sm">
              <ShieldCheck size={10}/> Vendedora Verificada
            </span>
            <h1 className="font-display text-3xl text-[var(--texto-fuerte)] font-extrabold leading-tight">
              Hola, <span className="text-[var(--rojo-carmesi)]">{miPerfil.nombre}</span>
            </h1>
            <p className="text-[var(--texto-suave)] text-[11px] font-medium mt-1 flex items-center gap-1">
              <Store size={12}/> {miPerfil.mercado} • {miPerfil.puesto}
            </p>
          </div>
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-[var(--dorado-gamlp)] shadow-md relative overflow-hidden shrink-0">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Maria&backgroundColor=ffffff" alt="avatar" className="w-full h-full object-cover"/>
          </div>
        </div>
      </div>

      <div className="p-6 pt-6 anim-stagger space-y-5">
        
        {/* Accesos Rápidos */}
        <div>
          <h3 className="text-[12px] font-bold text-[var(--texto-suave)] uppercase tracking-widest mb-3">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={onEditarPuesto} className="bg-white border border-[var(--borde)] p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-sm hover:border-[var(--verde-palta)] hover:shadow-md group">
              <div className="w-12 h-12 rounded-full bg-[var(--verde-claro)] flex items-center justify-center text-[var(--verde-palta)] group-hover:bg-[#C8E6C9] transition-colors">
                <PackagePlus size={24} />
              </div>
              <span className="text-sm font-bold text-[var(--texto-fuerte)] text-center">Editar Puesto<br/><span className="text-[10px] font-normal text-[var(--texto-suave)]">Añadir mercadería</span></span>
            </button>
            
            <button onClick={onNavigateToSolidaria} className="bg-white border border-[var(--borde)] p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-sm hover:border-[var(--rojo-carmesi)] hover:shadow-md group">
              <div className="w-12 h-12 rounded-full bg-[var(--rojo-claro)] flex items-center justify-center text-[var(--rojo-carmesi)] group-hover:scale-110 transition-transform">
                <HeartHandshake size={24} />
              </div>
              <span className="text-sm font-bold text-[var(--texto-fuerte)] text-center">Mis Ahijadas<br/><span className="text-[10px] font-normal text-[var(--texto-suave)]">Apoyo solidario</span></span>
            </button>
          </div>
        </div>

        {/* Retroalimentación Amable (Reemplaza los comentarios públicos) */}
        <div>
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-[12px] font-bold text-[var(--texto-suave)] uppercase tracking-widest">Buzón de Sugerencias</h3>
             <span className="bg-[var(--dorado-claro)] text-[var(--dorado-gamlp)] text-[9px] font-bold px-2 py-1 rounded border border-[var(--dorado-gamlp)]/30">Privado</span>
          </div>
          
          <div className="space-y-3">
            {comentarios.length === 0 ? (
              <p className="text-xs text-[var(--texto-suave)] text-center my-4">Aún no hay mensajes de clientes.</p>
            ) : (
              comentarios.slice(0, 3).map(fb => (
                <div key={fb.id} className="bg-white p-4 rounded-2xl border border-[var(--dorado-gamlp)]/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[var(--dorado-gamlp)]"></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--dorado-claro)] flex items-center justify-center text-[var(--dorado-gamlp)] shrink-0">
                        <MessageSquare size={14}/>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-[var(--texto-fuerte)]">{fb.autor || 'Mensaje de un cliente'}</h4>
                        <p className="text-[9px] text-[var(--texto-suave)]">{fb.fecha}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < fb.estrellas ? 'text-[var(--dorado-gamlp)]' : 'text-gray-200'} fill={i < fb.estrellas ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-xs text-[var(--texto-suave)] leading-relaxed font-medium pl-10">
                    &quot;{fb.texto}&quot;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Incentivos Tributarios */}
        <div className="bg-[#1B3624] p-6 rounded-[2rem] shadow-xl relative overflow-hidden text-white border border-[#2E5A3C] mt-2">
          <Award className="absolute -right-4 -bottom-4 text-[var(--dorado-gamlp)]/10" size={120}/>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--dorado-gamlp)]/20 flex items-center justify-center border border-[var(--dorado-gamlp)]/50">
              <FileText size={16} className="text-[var(--dorado-gamlp)]"/>
            </div>
            <h3 className="font-display font-bold text-sm tracking-wide">Patente Municipal de Sitios</h3>
          </div>
          <p className="text-xs text-gray-300 mb-5 pr-4 leading-relaxed font-medium">Mantenga sus precios actualizados y escuche las sugerencias de sus clientes para obtener su <span className="font-bold text-[var(--dorado-gamlp)]">Certificado de Abasto Municipal (-15% en Patente)</span>.</p>
          
          <div className="mb-2 flex justify-between items-end">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Progreso Anual</span>
            <span className="text-sm font-bold text-[var(--dorado-gamlp)]">{miPerfil.progreso_patente}%</span>
          </div>
          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div className="bg-gradient-to-r from-[var(--dorado-gamlp)] to-[#FFF5D1] h-full rounded-full transition-all duration-1000 relative" style={{width: `${miPerfil.progreso_patente}%`}}>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-30"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
