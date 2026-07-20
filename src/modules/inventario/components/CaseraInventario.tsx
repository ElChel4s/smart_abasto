'use client';

import React from 'react';
import { Store, HeartHandshake, PackagePlus, ChevronRight } from 'lucide-react';

interface CaseraInventarioProps {
  vendor: any;
  isAhijada: boolean;
  listado: any[];
  onAbrirEditor: (vendor: any) => void;
  onToggleDisponibilidad: (id: string, isAhijada: boolean) => void;
}

export default function CaseraInventario({ vendor, isAhijada, listado, onAbrirEditor, onToggleDisponibilidad }: CaseraInventarioProps) {
  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-32">
      <div className="px-6 pt-12 pb-4 sticky top-0 z-10 bg-[var(--bg-maiz)]/95 backdrop-blur-md border-b border-[var(--dorado-gamlp)]/20 pattern-rafia shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="font-display text-2xl text-[var(--texto-fuerte)] font-bold flex items-center gap-2">
              {isAhijada ? <><HeartHandshake size={22} className="text-[var(--verde-palta)]"/> Puesto de {vendor.nombre}</> : <><Store size={22} className="text-[var(--rojo-carmesi)]"/> Mi Puesto</>}
            </h1>
            <p className="text-[11px] text-[var(--texto-suave)] font-medium">Inventario visible en la app ciudadana</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 pb-20 anim-stagger space-y-4">
        
        {/* Botón Principal para ir al Editor */}
        <button 
          onClick={() => onAbrirEditor(vendor)}
          className="w-full bg-gradient-to-r from-[var(--verde-palta)] to-[#2E7D32] border border-[#1B5E20] p-4 rounded-2xl flex items-center justify-between text-white shadow-lg hover:shadow-xl transition-shadow active:scale-95 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform shadow-inner">
              <PackagePlus size={20} className="text-white" />
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-base block leading-tight">Agregar / Editar Productos</span>
              <span className="text-[11px] font-medium text-white/80">Ingresa para actualizar tu puesto</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
            <ChevronRight size={16} className="text-white"/>
          </div>
        </button>

        <h3 className="text-[11px] font-bold text-[var(--texto-suave)] uppercase tracking-widest pt-2">Lista Actual</h3>

        {listado.map(item => (
          <div key={item.id} className={`card-organic p-4 transition-all duration-300 ${!item.disponible ? 'opacity-70 bg-gray-50 border-gray-200' : 'hover:border-[var(--dorado-gamlp)]/40 hover:shadow-md'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border bg-white border-[var(--borde)] shadow-sm ${!item.disponible && 'grayscale'}`}>
                  {item.icono}
                </div>
                <div>
                  <h3 className={`font-bold text-base ${item.disponible ? 'text-[var(--texto-fuerte)]' : 'text-gray-500 line-through'}`}>{item.producto}</h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-bold text-lg text-[var(--rojo-carmesi)]">Bs {item.precio.toFixed(2)}</span>
                    <span className="text-[11px] text-[var(--texto-suave)] font-medium">por {item.unidad}</span>
                  </div>
                </div>
              </div>
              
              <label className="flex flex-col items-end cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={item.disponible} onChange={() => onToggleDisponibilidad(item.id, isAhijada)} />
                  <div className={`block w-12 h-7 rounded-full transition-colors ${item.disponible ? 'bg-[var(--verde-palta)]' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-[3px] top-[3px] bg-white w-[22px] h-[22px] rounded-full transition-transform shadow-sm ${item.disponible ? 'transform translate-x-5' : ''}`}></div>
                </div>
                <span className={`text-[9px] font-bold mt-1.5 uppercase tracking-wide ${item.disponible ? 'text-[var(--verde-palta)]' : 'text-gray-400'}`}>
                  {item.disponible ? 'En Stock' : 'Agotado'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
