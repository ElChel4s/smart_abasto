'use client';

import React from 'react';
import { Store, Package, HeartHandshake, Bell } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  alertCount: number;
}

export default function BottomNavCasera({ activeTab, onTabChange, alertCount }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Store, label: 'Inicio' },
    { id: 'inventario', icon: Package, label: 'Mi Puesto' },
    { id: 'solidaria', icon: HeartHandshake, label: 'Madrina' },
    { id: 'comunidad', icon: Bell, label: 'Alertas', badge: alertCount }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-[var(--borde)] rounded-[2rem] flex justify-between items-center px-3 py-2 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-[90%] max-w-[340px]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id || (tab.id === 'solidaria' && activeTab === 'inventario_ahijada');
        return (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)} 
            className={`flex flex-col items-center justify-center h-14 w-[70px] rounded-2xl transition-all duration-300 relative
              ${isActive ? 'bg-[var(--bg-maiz)] text-[var(--rojo-carmesi)] shadow-inner' : 'text-[var(--texto-suave)] hover:bg-gray-50'}
            `}
          >
            <div className="relative">
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              {tab.badge && tab.badge > 0 && !isActive && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FFC107] border-2 border-white rounded-full flex items-center justify-center"></span>
              )}
            </div>
            {isActive && <span className="text-[9px] font-bold mt-1 tracking-wide">{tab.label}</span>}
          </button>
        )
      })}
    </div>
  );
}
