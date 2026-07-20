'use client';
import { useToast } from '@/shared/context/ToastContext';
import { AlertTriangle, Check, Info } from 'lucide-react';

export default function ToastNotificacion() {
  const { toast } = useToast();
  
  if (!toast.show) return null;
  
  const isWarn = toast.type === 'warning';
  const isSuccess = toast.type === 'success';
  
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-sm" style={{animation: 'slideIn 0.3s ease-out'}}>
      <div className={`p-3 rounded-xl shadow-lg border flex items-center gap-3
        ${isWarn ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 
          isSuccess ? 'bg-[var(--verde-claro)] border-[var(--verde-palta)]/30 text-[var(--verde-palta)]' : 
          'bg-gray-900 border-gray-800 text-white'}`}
      >
        {isWarn ? <AlertTriangle size={18}/> : isSuccess ? <Check size={18}/> : <Info size={18}/>}
        <p className="text-xs font-bold leading-tight">{toast.msg}</p>
      </div>
    </div>
  );
}
