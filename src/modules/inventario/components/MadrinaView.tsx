'use client';

import React from 'react';
import { HeartHandshake, ShieldCheck, UserPlus, ChevronRight } from 'lucide-react';

interface MadrinaViewProps {
  ahijada: any;
  showApadrinarModal: boolean;
  onNavigateToAhijada: () => void;
  onSetShowApadrinarModal: (show: boolean) => void;
  onRequestApadrinar: () => void;
}

export default function MadrinaView({ ahijada, showApadrinarModal, onNavigateToAhijada, onSetShowApadrinarModal, onRequestApadrinar }: MadrinaViewProps) {
  return (
    <>
      {/* Modal de Apadrinar */}
      {showApadrinarModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl anim-stagger">
             <div className="w-16 h-16 bg-[var(--rojo-claro)] text-[var(--rojo-carmesi)] rounded-full flex items-center justify-center mx-auto mb-4">
               <HeartHandshake size={32} />
             </div>
             <h3 className="font-display text-xl font-bold text-center text-[var(--texto-fuerte)] mb-2">Apadrinar a una Vecina</h3>
             <p className="text-sm text-[var(--texto-suave)] text-center mb-6 font-medium">
               Para registrar a una nueva caserita, un funcionario de la Alcaldía le ayudará con el uso de la aplicación y la validación. ¿Desea solicitar una visita en su puesto?
             </p>
             <div className="flex flex-col gap-3">
                <button onClick={onRequestApadrinar} className="w-full py-4 bg-[var(--verde-palta)] text-white rounded-xl font-bold shadow-md hover:bg-[#2E7D32] active:scale-95 transition-all">
                  Sí, pedir ayuda a la Alcaldía
                </button>
                <button onClick={() => onSetShowApadrinarModal(false)} className="w-full py-4 bg-gray-100 text-[var(--texto-suave)] rounded-xl font-bold hover:bg-gray-200 active:scale-95 transition-all">
                  Cancelar
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Vista Solidaria */}
      <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-32">
        <div className="px-6 pt-12 pb-4 sticky top-0 z-10 bg-[var(--bg-maiz)]/95 backdrop-blur-md border-b border-[var(--dorado-gamlp)]/20 pattern-rafia">
          <h1 className="font-display text-2xl text-[var(--texto-fuerte)] font-bold flex items-center gap-2">
            <HeartHandshake className="text-[var(--rojo-carmesi)]"/> Red Solidaria
          </h1>
          <p className="text-[11px] text-[var(--texto-suave)] font-medium">Digitalizando el apadrinamiento andino.</p>
        </div>

        <div className="p-6 anim-stagger">
          <div className="bg-white p-5 rounded-2xl border border-[var(--dorado-gamlp)]/40 shadow-sm flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--dorado-claro)] flex items-center justify-center shrink-0">
               <ShieldCheck size={20} className="text-[var(--dorado-gamlp)]"/>
            </div>
            <p className="text-xs text-[var(--texto-suave)] leading-relaxed font-medium">
              Eres <span className="font-bold text-[var(--dorado-gamlp)]">Madrina Digital</span>. Al organizar los precios de las caseras mayores, ellas no se quedan atrás en la tecnología y tú ganas <span className="font-bold text-[var(--texto-fuerte)]">descuentos en tu patente</span>.
            </p>
          </div>

          <h3 className="text-[11px] font-bold text-[var(--texto-suave)] uppercase tracking-widest mb-4">Tus Ahijadas (Vecinas)</h3>
          
          <div onClick={onNavigateToAhijada} className="bg-white border border-[var(--borde)] p-5 rounded-[1.5rem] shadow-sm flex items-center justify-between cursor-pointer hover:border-[var(--verde-palta)]/50 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[var(--verde-claro)] rounded-2xl flex items-center justify-center border border-[var(--verde-palta)]/30 text-[var(--verde-palta)] font-display text-2xl font-bold shadow-inner">
                {ahijada.nombre.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-base text-[var(--texto-fuerte)]">{ahijada.nombre}</h4>
                <p className="text-xs text-[var(--texto-suave)] font-medium">{ahijada.especialidad}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[9px] font-bold text-[var(--verde-palta)] bg-[var(--verde-claro)] px-2 py-0.5 rounded-md border border-[var(--verde-palta)]/20">
                    Puesto Activo
                  </span>
                  <span className="text-[9px] font-bold text-[var(--dorado-gamlp)] bg-[var(--dorado-claro)] px-2 py-0.5 rounded-md border border-[var(--dorado-gamlp)]/20">
                    Ganas +15 pts
                  </span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[var(--verde-claro)] transition-colors">
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--verde-palta)]"/>
            </div>
          </div>

          <button 
            onClick={() => onSetShowApadrinarModal(true)}
            className="w-full py-4 mt-6 border-2 border-dashed border-[var(--verde-palta)]/50 text-[var(--verde-palta)] bg-[var(--verde-claro)]/30 rounded-[1.5rem] font-bold flex flex-col items-center justify-center gap-1 hover:border-[var(--verde-palta)] hover:bg-[var(--verde-claro)] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
               <UserPlus size={20} /> 
               <span className="text-sm">Apadrinar a una nueva vecina</span>
            </div>
            <span className="text-[10px] font-normal text-[var(--texto-suave)]">Solicitar ayuda presencial de la Alcaldía</span>
          </button>
        </div>
      </div>
    </>
  );
}
