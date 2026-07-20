'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/context/AuthContext';
import { 
  Store, ShieldCheck, UserPlus, MapPin, 
  ChevronRight, Check, Lock, Phone, LogIn, Info, AlertTriangle 
} from 'lucide-react';

const organicMarketStyles = `
  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  .anim-stagger > * {
    opacity: 0;
    animation: fadeUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  .anim-stagger > *:nth-child(1) { animation-delay: 0.05s; }
  .anim-stagger > *:nth-child(2) { animation-delay: 0.1s; }
  .anim-stagger > *:nth-child(3) { animation-delay: 0.15s; }
  .anim-stagger > *:nth-child(4) { animation-delay: 0.2s; }
  .anim-stagger > *:nth-child(5) { animation-delay: 0.25s; }
  
  .pattern-rafia {
    background-color: var(--bg-maiz);
    background-image: 
      linear-gradient(90deg, rgba(211,47,47,0.04) 0px, rgba(211,47,47,0.04) 4px, transparent 4px, transparent 12px, rgba(56,142,60,0.03) 12px, rgba(56,142,60,0.03) 24px, transparent 24px, transparent 28px, rgba(212,175,55,0.05) 28px, rgba(212,175,55,0.05) 32px, transparent 32px, transparent 40px),
      repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 12px);
    background-size: 40px 100%, 100% 24px;
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [registerStep, setRegisterStep] = useState(1); // 1, 2, 3
  const [authForm, setAuthForm] = useState({ phone: '', pin: '', nombre: '', mercado: '', puesto: '' });
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });

  const showToast = (msg: string, type = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!authForm.phone || !authForm.pin) {
       showToast("Por favor ingrese su celular y su PIN secreto", "warning");
       return;
    }
    // TODO: Validate against DB
    const fakeProfile = {
      id: 'USR-MARIA-45',
      nombre: 'Doña María',
      puesto: 'N° 45 - Sector Verduras',
      mercado: 'Mercado Rodríguez',
      calificacion: 4.9,
      es_madrina: true,
      progreso_patente: 85
    };
    login(fakeProfile, 'casera');
    showToast("¡Bienvenida a su puesto digital!", "success");
    router.push('/perfil'); // or wherever Casera home is
  };

  const handleNextStep = () => {
    if(registerStep === 1 && (!authForm.phone || !authForm.pin)) {
      showToast("Llene su celular y PIN para continuar", "warning"); return;
    }
    if(registerStep === 2 && !authForm.nombre) {
      showToast("Ponga su nombre para que la reconozcan", "warning"); return;
    }
    setRegisterStep(prev => prev + 1);
  };

  const handlePrevStep = () => setRegisterStep(prev => prev - 1);

  const handleRegisterComplete = () => {
    if(!authForm.mercado || !authForm.puesto) {
      showToast("Seleccione su mercado y número de puesto", "warning"); return;
    }
    const newProfile = {
      id: `USR-${Date.now()}`,
      nombre: authForm.nombre,
      puesto: authForm.puesto,
      mercado: authForm.mercado,
      calificacion: 5.0,
      es_madrina: false,
      progreso_patente: 0
    };
    login(newProfile, 'casera');
    showToast(`¡Bienvenida ${authForm.nombre}, su puesto fue creado!`, "success");
    router.push('/perfil');
  };

  const ToastNotificacion = () => {
    if (!toast.show) return null;
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-4 w-full max-w-sm" style={{animation: 'fadeUp 0.3s ease-out'}}>
        <div className={`p-3 rounded-xl shadow-lg border flex items-center gap-3 font-bold text-xs
          \${toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 
            toast.type === 'success' ? 'bg-[var(--verde-claro)] border-[var(--verde-palta)]/30 text-[var(--verde-palta)]' : 
            'bg-gray-900 border-gray-800 text-white'}`}
        >
          {toast.type === 'warning' ? <AlertTriangle size={18}/> : toast.type === 'success' ? <Check size={18}/> : <Info size={18}/>}
          {toast.msg}
        </div>
      </div>
    );
  };

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: organicMarketStyles }} />
    <ToastNotificacion />
    <div className="h-screen w-full flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll relative pattern-rafia">
      
      {/* Cabecera general */}
      <div className="p-8 pt-12 pb-6 flex flex-col items-center text-center transition-all duration-500" style={{ transform: authMode === 'register' ? 'scale(0.9) translateY(-10px)' : 'scale(1)' }}>
         <div className="w-16 h-16 bg-white border-4 border-[var(--dorado-gamlp)] rounded-full flex items-center justify-center mb-3 shadow-lg">
           <Store size={32} className="text-[var(--rojo-carmesi)]" />
         </div>
         <h1 className="font-display text-2xl font-extrabold text-[var(--texto-fuerte)] leading-tight">Casera<br/><span className="text-[var(--rojo-carmesi)]">GAMLP</span></h1>
      </div>

      <div className="flex-1 bg-white rounded-t-[3rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-6 pt-8 flex flex-col relative z-10">
         
         {/* Pestañas de Login / Registro */}
         {(authMode === 'login' || (authMode === 'register' && registerStep === 1)) && (
           <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
             <button onClick={() => { setAuthMode('login'); setRegisterStep(1); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all \${authMode === 'login' ? 'bg-white text-[var(--verde-palta)] shadow-sm' : 'text-gray-400'}`}>Ya tengo Puesto</button>
             <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all \${authMode === 'register' ? 'bg-white text-[var(--verde-palta)] shadow-sm' : 'text-gray-400'}`}>Soy Nueva</button>
           </div>
         )}

         {/* --- MODO INGRESO --- */}
         {authMode === 'login' && (
           <form onSubmit={handleLoginSubmit} className="flex-1 flex flex-col space-y-4 anim-stagger">
              <div>
                <label className="text-[10px] font-bold text-[var(--texto-suave)] uppercase tracking-widest ml-2 block mb-1">Número de Celular</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="tel" placeholder="60000000" value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} className="w-full bg-gray-50 border border-[var(--borde)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--texto-fuerte)] focus:outline-none focus:border-[var(--verde-palta)] focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--texto-suave)] uppercase tracking-widest ml-2 block mb-1">PIN Secreto (4 números)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="password" placeholder="••••" maxLength={4} inputMode="numeric" value={authForm.pin} onChange={e => setAuthForm({...authForm, pin: e.target.value})} className="w-full bg-gray-50 border border-[var(--borde)] rounded-2xl py-4 pl-12 pr-4 text-xl font-bold tracking-widest text-[var(--texto-fuerte)] focus:outline-none focus:border-[var(--verde-palta)] focus:bg-white transition-all" />
                </div>
              </div>

              <div className="mt-auto pt-6 pb-4">
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[var(--verde-palta)] to-[#2E7D32] text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:shadow-xl active:scale-95 transition-all">
                  <LogIn size={20}/> Ingresar a mi Puesto
                </button>
              </div>
           </form>
         )}

         {/* --- MODO WIZARD (REGISTRO) --- */}
         {authMode === 'register' && (
           <div className="flex-1 flex flex-col anim-stagger">
             
             {/* Barra de progreso visual */}
             <div className="flex gap-2 mb-6">
                {[1, 2, 3].map(step => (
                  <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-500 \${step <= registerStep ? 'bg-[var(--verde-palta)]' : 'bg-gray-200'}`}></div>
                ))}
             </div>

             {/* PASO 1: Seguridad */}
             {registerStep === 1 && (
               <div className="flex-1 flex flex-col space-y-5 anim-stagger">
                 <div>
                   <h3 className="font-display text-xl font-bold text-[var(--texto-fuerte)] flex items-center gap-2 mb-1">
                     <ShieldCheck className="text-[var(--verde-palta)]"/> 1. Cuenta Segura
                   </h3>
                 </div>

                 <div className="bg-[var(--dorado-claro)]/50 border border-[var(--dorado-gamlp)]/30 rounded-xl p-4 flex gap-3">
                   <Info size={20} className="text-[var(--dorado-gamlp)] shrink-0 mt-0.5" />
                   <p className="text-xs text-[var(--texto-suave)] font-medium leading-relaxed">
                     <strong className="text-[var(--texto-fuerte)]">¿Por qué te pedimos esto?</strong><br/>
                     Necesitamos tu celular para contactarte y un PIN de 4 números para que solo tú puedas cambiar tus precios.
                   </p>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-[var(--texto-suave)] uppercase tracking-widest ml-2 block mb-1">Tu Celular</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="tel" placeholder="Ej: 60000000" value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} className="w-full bg-gray-50 border border-[var(--borde)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--texto-fuerte)] focus:outline-none focus:border-[var(--verde-palta)] focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[var(--texto-suave)] uppercase tracking-widest ml-2 block mb-1">Crea un PIN (4 Números)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="password" placeholder="••••" maxLength={4} inputMode="numeric" value={authForm.pin} onChange={e => setAuthForm({...authForm, pin: e.target.value})} className="w-full bg-gray-50 border border-[var(--borde)] rounded-2xl py-4 pl-12 pr-4 text-xl font-bold tracking-widest text-[var(--texto-fuerte)] focus:outline-none focus:border-[var(--verde-palta)] focus:bg-white transition-all" />
                    </div>
                  </div>
               </div>
             )}

             {/* PASO 2: Identidad */}
             {registerStep === 2 && (
               <div className="flex-1 flex flex-col space-y-5 anim-stagger">
                 <div>
                   <h3 className="font-display text-xl font-bold text-[var(--texto-fuerte)] flex items-center gap-2 mb-1">
                     <UserPlus className="text-[var(--verde-palta)]"/> 2. ¿Cómo te conocen?
                   </h3>
                 </div>

                 <div className="bg-[var(--dorado-claro)]/50 border border-[var(--dorado-gamlp)]/30 rounded-xl p-4 flex gap-3">
                   <Info size={20} className="text-[var(--dorado-gamlp)] shrink-0 mt-0.5" />
                   <p className="text-xs text-[var(--texto-suave)] font-medium leading-relaxed">
                     <strong className="text-[var(--texto-fuerte)]">¿Por qué te pedimos esto?</strong><br/>
                     Pon tu nombre como te dicen tus caseritos de cariño, para que te reconozcan rapidito en la app.
                   </p>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-[var(--texto-suave)] uppercase tracking-widest ml-2 block mb-1">Nombre o Apodo de Vendedora</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="text" placeholder="Ej: Doña María o María Quispe" value={authForm.nombre} onChange={e => setAuthForm({...authForm, nombre: e.target.value})} className="w-full bg-gray-50 border border-[var(--borde)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--texto-fuerte)] focus:outline-none focus:border-[var(--verde-palta)] focus:bg-white transition-all" />
                    </div>
                  </div>
               </div>
             )}

             {/* PASO 3: Ubicación (Mapa interactivo) */}
             {registerStep === 3 && (
               <div className="flex-1 flex flex-col space-y-4 anim-stagger">
                 <div>
                   <h3 className="font-display text-xl font-bold text-[var(--texto-fuerte)] flex items-center gap-2 mb-1">
                     <MapPin className="text-[var(--verde-palta)]"/> 3. ¿Dónde vendes?
                   </h3>
                 </div>

                 <div className="bg-[var(--dorado-claro)]/50 border border-[var(--dorado-gamlp)]/30 rounded-xl p-3 flex gap-3">
                   <Info size={20} className="text-[var(--dorado-gamlp)] shrink-0 mt-0.5" />
                   <p className="text-xs text-[var(--texto-suave)] font-medium leading-relaxed">
                     Toca tu mercado en el mapa y anota tu número de puesto para que los clientes lleguen directo.
                   </p>
                 </div>

                 {/* Mapa Simulado Interactivo */}
                 <div className="relative w-full h-44 bg-[var(--verde-claro)]/40 rounded-2xl border-2 border-[var(--borde)] overflow-hidden shadow-inner">
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--verde-palta) 2px, transparent 2px)', backgroundSize: '15px 15px'}}></div>
                   
                   {/* Puntos en el mapa */}
                   {[
                     { id: 'Rodríguez', top: '30%', left: '20%' },
                     { id: 'Lanza', top: '45%', left: '70%' },
                     { id: 'Camacho', top: '70%', left: '40%' },
                     { id: 'Villa Fátima', top: '15%', left: '60%' },
                   ].map(mercado => (
                     <button 
                       key={mercado.id}
                       onClick={(e) => { e.preventDefault(); setAuthForm({...authForm, mercado: mercado.id}) }}
                       className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group"
                       style={{ top: mercado.top, left: mercado.left }}
                     >
                       <MapPin size={authForm.mercado === mercado.id ? 28 : 20} className={`transition-all duration-300 \${authForm.mercado === mercado.id ? 'text-[var(--rojo-carmesi)] drop-shadow-md' : 'text-[var(--verde-palta)]'}`} />
                       <span className={`text-[9px] font-bold mt-1 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100 transition-all \${authForm.mercado === mercado.id ? 'opacity-100 text-[var(--rojo-carmesi)] scale-110' : 'opacity-70 text-gray-500 group-hover:opacity-100'}`}>
                         {mercado.id}
                       </span>
                     </button>
                   ))}
                 </div>

                 {/* Indicador de mercado seleccionado y Nro de Puesto */}
                 <div className="flex gap-3">
                   <div className="flex-1 bg-gray-50 border border-[var(--borde)] rounded-xl py-3 px-4 flex flex-col justify-center">
                     <span className="text-[9px] font-bold text-[var(--texto-suave)] uppercase tracking-widest">Mercado</span>
                     <span className={`text-sm font-bold \${authForm.mercado ? 'text-[var(--verde-palta)]' : 'text-gray-400'}`}>
                       {authForm.mercado || 'Toca el mapa ↑'}
                     </span>
                   </div>
                   <div className="w-1/3">
                     <label className="text-[9px] font-bold text-[var(--texto-suave)] uppercase tracking-widest ml-1 block mb-1">N° Puesto</label>
                     <input type="text" placeholder="Ej: 45" value={authForm.puesto} onChange={e => setAuthForm({...authForm, puesto: e.target.value})} className="w-full bg-gray-50 border border-[var(--borde)] rounded-xl py-2 px-3 text-sm font-bold text-[var(--texto-fuerte)] focus:outline-none focus:border-[var(--verde-palta)] focus:bg-white text-center" />
                   </div>
                 </div>
               </div>
             )}

             {/* Controles de Navegación del Wizard */}
             <div className="mt-auto pt-6 pb-2 flex gap-3">
               {registerStep > 1 && (
                 <button onClick={handlePrevStep} type="button" className="w-1/3 py-4 bg-gray-100 text-[var(--texto-suave)] rounded-2xl font-bold shadow-sm active:scale-95 transition-all">
                   Atrás
                 </button>
               )}
               
               {registerStep < 3 ? (
                 <button onClick={handleNextStep} type="button" className="flex-1 py-4 bg-[var(--texto-fuerte)] text-white rounded-2xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                   Siguiente <ChevronRight size={18}/>
                 </button>
               ) : (
                 <button onClick={handleRegisterComplete} type="button" className="flex-1 py-4 bg-gradient-to-r from-[var(--verde-palta)] to-[#2E7D32] text-white rounded-2xl font-bold shadow-lg shadow-[var(--verde-palta)]/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                   <Check size={18}/> Crear mi Puesto
                 </button>
               )}
             </div>

           </div>
         )}
      </div>
    </div>
    </>
  );
}
