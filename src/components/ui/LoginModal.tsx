'use client';
import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';
import { ShieldCheck, Users } from 'lucide-react';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, setIsLoggedIn } = useAuth();
  const { showToast } = useToast();

  if (!showLoginModal) return null;
  
  return (
    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" style={{animation: 'fadeUp 0.2s ease-out'}}>
      <div className="bg-[var(--bg-tarjeta)] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-[var(--borde)] text-center">
        <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 font-bold text-sm">✕</button>
        
        <div className="w-16 h-16 bg-[var(--dorado-claro)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--dorado-gamlp)]/30">
          <Users size={32} className="text-[var(--dorado-gamlp)]" />
        </div>
        
        <h3 className="font-display text-xl font-bold text-[var(--texto-fuerte)] mb-2">Inicia Sesión</h3>
        <p className="text-sm text-[var(--texto-suave)] mb-6">Para interactuar con la comunidad (reportar stock, dejar reseñas) necesitas identificarte como ciudadano cívico.</p>
        
        <div className="space-y-3">
          <button onClick={() => { setIsLoggedIn(true); setShowLoginModal(false); showToast("¡Sesión iniciada correctamente!", "success"); }} className="w-full bg-[var(--rojo-carmesi)] text-[var(--bg-tarjeta)] font-bold py-3.5 rounded-xl shadow-md hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
            <ShieldCheck size={18}/> Ingresar como Ciudadano
          </button>
          <button onClick={() => setShowLoginModal(false)} className="w-full bg-white border-2 border-[var(--borde)] text-[var(--texto-fuerte)] font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
            Continuar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
