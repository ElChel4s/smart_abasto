'use client';
import { useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';
import { ShieldCheck, Users, Mail, Lock, User, Store } from 'lucide-react';
import { loginUsuario, registrarUsuario } from '@/modules/auth/repository';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'ciudadano' | 'casera'>('ciudadano');
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLogin) {
      const user = await loginUsuario(email, password);
      if (user) {
        login(user, user.rol as 'ciudadano' | 'casera');
        showToast("¡Sesión iniciada correctamente!", "success");
      } else {
        showToast("Credenciales incorrectas", "error");
      }
    } else {
      const newUser = await registrarUsuario(nombre, email, password, rol);
      if (newUser) {
        login(newUser, rol);
        showToast("¡Cuenta creada correctamente!", "success");
      } else {
        showToast("Error al registrar (quizás el correo ya existe)", "error");
      }
    }
    setLoading(false);
  };
  
  return (
    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" style={{animation: 'fadeUp 0.2s ease-out'}}>
      <div className="bg-[var(--bg-tarjeta)] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-[var(--borde)] text-center">
        <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 font-bold text-sm">✕</button>
        
        <div className="w-16 h-16 bg-[var(--dorado-claro)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--dorado-gamlp)]/30">
          <Users size={32} className="text-[var(--dorado-gamlp)]" />
        </div>
        
        <h3 className="font-display text-xl font-bold text-[var(--texto-fuerte)] mb-2">
          {isLogin ? 'Inicia Sesión' : 'Crea tu Cuenta'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-3 mb-4 text-left">
          {!isLogin && (
            <>
              <div className="relative">
                <User size={16} className="absolute top-3.5 left-3 text-[var(--texto-suave)]" />
                <input type="text" placeholder="Tu Nombre" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-gray-50 border border-[var(--borde)] rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--rojo-carmesi)]" />
              </div>
              <div className="flex gap-2 mt-2 mb-2">
                <label className={`flex-1 p-2 border rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${rol === 'ciudadano' ? 'bg-[var(--bg-maiz)] border-[var(--dorado-gamlp)] text-[var(--dorado-gamlp)] font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="rol" value="ciudadano" checked={rol === 'ciudadano'} onChange={() => setRol('ciudadano')} className="hidden" />
                  <Users size={12} /> Cliente
                </label>
                <label className={`flex-1 p-2 border rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${rol === 'casera' ? 'bg-[var(--rojo-claro)] border-[var(--rojo-carmesi)] text-[var(--rojo-carmesi)] font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="rol" value="casera" checked={rol === 'casera'} onChange={() => setRol('casera')} className="hidden" />
                  <Store size={12} /> Casera
                </label>
              </div>
            </>
          )}
          <div className="relative">
            <Mail size={16} className="absolute top-3.5 left-3 text-[var(--texto-suave)]" />
            <input type="email" placeholder="Correo electrónico" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-[var(--borde)] rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--rojo-carmesi)]" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute top-3.5 left-3 text-[var(--texto-suave)]" />
            <input type="password" placeholder="Contraseña" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-[var(--borde)] rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--rojo-carmesi)]" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-[var(--rojo-carmesi)] text-[var(--bg-tarjeta)] font-bold py-3.5 rounded-xl shadow-md hover:bg-red-800 transition-colors flex items-center justify-center gap-2 mt-2">
            {loading ? 'Cargando...' : (isLogin ? 'Ingresar' : 'Registrarme')}
          </button>
        </form>

        <p className="text-xs text-[var(--texto-suave)] mb-4">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[var(--rojo-carmesi)] ml-1 hover:underline">
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </p>

        <button onClick={() => setShowLoginModal(false)} className="w-full bg-white border-2 border-[var(--borde)] text-[var(--texto-fuerte)] font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
          Continuar sin cuenta
        </button>
      </div>
    </div>
  );
}
