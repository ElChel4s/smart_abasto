'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';
import { ShieldCheck, Users, LogIn } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, setIsLoggedIn } = useAuth();
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Error Google OAuth:", err.message);
      showToast("Error de conexión con Google: " + err.message, "error");
    }
  };

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
          {/* BOTÓN REAL: Google Auth en Supabase */}
          <button 
            onClick={handleGoogleLogin} 
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Entrar con Google
          </button>

          {/* MOCK: Entrada simulada rápida para demo local */}
          <button 
            onClick={() => { setIsLoggedIn(true); setShowLoginModal(false); showToast("¡Sesión de prueba iniciada!", "success"); }} 
            className="w-full bg-[var(--rojo-carmesi)] text-[var(--bg-tarjeta)] font-bold py-3.5 rounded-xl shadow-md hover:bg-red-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <ShieldCheck size={18}/> Invitado rápido (Demo)
          </button>
          
          <button onClick={() => setShowLoginModal(false)} className="w-full bg-transparent text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)] font-semibold py-2 text-xs transition-colors">
            Continuar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
