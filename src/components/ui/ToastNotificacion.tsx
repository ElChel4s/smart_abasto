'use client';

import React from 'react';
import { AlertTriangle, Check, Info } from 'lucide-react';

interface ToastProps {
  toast: { show: boolean; msg: string; type: string };
}

export default function ToastNotificacion({ toast }: ToastProps) {
  if (!toast.show) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-4 w-full max-w-sm" style={{animation: 'fadeUp 0.3s ease-out'}}>
      <div className={`p-3 rounded-xl shadow-lg border flex items-center gap-3 font-bold text-xs
        ${toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 
          toast.type === 'success' ? 'bg-[var(--verde-claro)] border-[var(--verde-palta)]/30 text-[var(--verde-palta)]' : 
          'bg-gray-900 border-gray-800 text-white'}`}
      >
        {toast.type === 'warning' ? <AlertTriangle size={18}/> : toast.type === 'success' ? <Check size={18}/> : <Info size={18}/>}
        {toast.msg}
      </div>
    </div>
  );
}
