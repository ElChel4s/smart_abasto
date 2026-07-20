'use client';

import React from 'react';
import { Bell, Users, CheckCircle2 } from 'lucide-react';
import type { AlertaWaze } from '@/modules/compras/waze-alerts';

interface AlertasCaseraProps {
  alertas: AlertaWaze[];
  onResolverAlerta: (alertaId: string, accion: 'confirmar' | 'ignorar', inventarioId: string, tipo: 'agotado' | 'precio_alto') => void;
}

export default function AlertasCasera({ alertas, onResolverAlerta }: AlertasCaseraProps) {
  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-32">
      <div className="px-6 pt-12 pb-4 sticky top-0 z-10 bg-[var(--bg-maiz)]/95 backdrop-blur-md border-b border-[var(--dorado-gamlp)]/20 pattern-rafia">
        <h1 className="font-display text-2xl text-[var(--texto-fuerte)] font-bold flex items-center gap-2">
          <Bell className="text-[var(--rojo-carmesi)]"/> Alertas de Clientes
        </h1>
        <p className="text-[11px] text-[var(--texto-suave)] font-medium">El Waze de los mercados. La gente te avisa.</p>
      </div>

      <div className="px-6 mt-6 anim-stagger">
        {alertas.length === 0 ? (
          <div className="text-center py-20 opacity-60">
            <div className="w-20 h-20 mx-auto bg-[var(--verde-claro)] rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-[var(--verde-palta)]" />
            </div>
            <p className="text-base font-bold text-[var(--texto-fuerte)]">Sin alertas pendientes</p>
            <p className="text-xs text-[var(--texto-suave)] mt-1">Todo está en orden en su puesto.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alertas.map(alerta => (
              <div key={alerta.id} className="bg-white border-2 border-[#FFC107] rounded-[1.5rem] p-5 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#FFC107]"></div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0 border border-yellow-200">
                    <Users size={20}/>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--texto-fuerte)] flex items-center gap-1.5">
                       Reporte Comunitario
                    </h4>
                    <p className="text-xs text-[var(--texto-suave)] mt-1.5 leading-relaxed font-medium">
                      Un comprador informa que <span className="font-bold text-[var(--rojo-carmesi)] text-sm">{alerta.productoNombre}</span> 
                      {alerta.tipo === 'agotado' ? ' probablemente ya se agotó en tu puesto.' : ` cambió de precio.`}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{alerta.tiempo}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pl-14">
                  <button onClick={() => onResolverAlerta(alerta.id, 'confirmar', alerta.inventarioId, alerta.tipo)} className={`flex-1 text-white text-xs font-bold py-3 rounded-xl shadow-sm transition-colors ${alerta.tipo === 'agotado' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    {alerta.tipo === 'agotado' ? 'Confirmar Agotado' : 'Revisar Precio'}
                  </button>
                  <button onClick={() => onResolverAlerta(alerta.id, 'ignorar', alerta.inventarioId, alerta.tipo)} className="flex-1 bg-gray-50 border border-[var(--borde)] hover:bg-gray-100 text-[var(--texto-suave)] text-xs font-bold py-3 rounded-xl transition-colors shadow-sm">
                    Falso (Ignorar)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
