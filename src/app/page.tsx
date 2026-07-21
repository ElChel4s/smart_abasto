'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function App() {
  const [profile, setProfile] = useState('comprador'); // 'comprador' | 'casera'
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [installAppType, setInstallAppType] = useState('comprador');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  // PWA installation prompts
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [aiState, setAiState] = useState('idle');
  const [aiText, setAiText] = useState('"Presiona el micrófono para dictar tus precios de hoy..."');
  const [aiJson, setAiJson] = useState('{\n  "estado": "esperando_datos",\n  "catalogo": []\n}');

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(userAgent);
    setIsIOS(ios);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    const timeoutId = setTimeout(() => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timeoutId); observer.disconnect(); };
  }, [profile]);

  const handleInstallClick = (type: string) => {
    setInstallAppType(type);
    // Redirigir siempre a la ruta real de la app.
    // Esa ruta tiene el manifest correcto → Android mostrará su prompt nativo,
    // iOS mostrará el banner con instrucciones de "Agregar a Inicio".
    const targetUrl = type === 'comprador' ? '/ciudadano?install=1' : '/casera/perfil?install=1';
    window.location.href = targetUrl;
  };

  const closeInstallModal = () => setShowPwaModal(false);

  const simulateInstallSuccess = () => {
    closeInstallModal();
    setTimeout(() => {
      setToastMsg(`App ${installAppType === 'comprador' ? 'Ciudadana' : 'Caseras'} agregada correctamente.`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 400);
  };

  const handleMicClick = () => {
    if (aiState !== 'idle') return;
    
    setAiState('listening');
    setAiText('Escuchando... <br/> <span class="text-xs text-[#D32F2F] font-bold animate-pulse">Procesando modismos andinos...</span>');

    setTimeout(() => {
      setAiState('typing');
      const dictadoReal = "Me llegó tomate perita a 4 pesos la cuarta, y la arroba de papa imilla bajó a 50 bolivianos. Choclo ya no tengo, quítamelo de la lista.";
      let i = 0;
      let currentString = "";

      const typeInterval = setInterval(() => {
        currentString += dictadoReal.charAt(i);
        setAiText(currentString);
        i++;
        
        if (i >= dictadoReal.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            setAiState('success');
            setAiText('<span class="text-[#388E3C] font-bold"><i class="ph-bold ph-check-circle"></i> Catálogo actualizado al instante.</span>');
            
            const successJson = {
              "estado": "actualizado",
              "puesto": "ID_045_RODRIGUEZ",
              "operaciones": [
                { "producto": "Tomate Perita", "precio": 4.00, "unidad": "Cuarta", "accion": "actualizar" },
                { "producto": "Papa Imilla", "precio": 50.00, "unidad": "Arroba", "accion": "actualizar" },
                { "producto": "Choclo", "accion": "eliminar" }
              ]
            };
            setAiJson(JSON.stringify(successJson, null, 2));

            setTimeout(() => {
              setAiState('idle');
              setAiText('"Presiona el micrófono para dictar tus precios de hoy..."');
              setAiJson('{\n  "estado": "esperando_datos",\n  "catalogo": []\n}');
            }, 8000);
          }, 1000);
        }
      }, 30);
    }, 800);
  };

  return (
    <div className="font-sans antialiased overflow-x-hidden relative min-h-screen bg-[var(--bg-maiz)] text-[var(--texto-fuerte)]">
      
      {/* Script Phosphor Icons */}
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />

      {/* Estilos e Inyección de Google Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;500;700&display=swap');
        
        :root {
          --bg-maiz: #FDFBF7; 
          --bg-tarjeta: #FFFFFF; 
          --rojo-carmesi: #D32F2F; 
          --rojo-claro: #FFEBEE;
          --verde-palta: #388E3C; 
          --verde-claro: #E8F5E9;
          --dorado-gamlp: #D4AF37; 
          --dorado-claro: #FFF5D1;
          --texto-fuerte: #2D2422; 
          --texto-suave: #796661;
          --borde: #EADBCE;
        }

        .font-display { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.02em; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        
        .glass-nav { 
          background: rgba(253, 251, 247, 0.95); 
          backdrop-filter: blur(12px); 
          border-bottom: 1px solid var(--borde); 
        }
        
        .reveal { opacity: 0; transform: translateY(20px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }

        .pattern-rafia {
          background-color: var(--bg-maiz);
          background-image: 
            linear-gradient(90deg, rgba(211,47,47,0.03) 0px, rgba(211,47,47,0.03) 4px, transparent 4px, transparent 12px, rgba(56,142,60,0.02) 12px, rgba(56,142,60,0.02) 24px, transparent 24px, transparent 28px, rgba(212,175,55,0.04) 28px, rgba(212,175,55,0.04) 32px, transparent 32px, transparent 40px),
            repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 12px);
          background-size: 40px 100%, 100% 24px;
        }

        .card-organic {
          background: #FFFEFC;
          border: 1px solid var(--borde);
          border-radius: 24px;
          box-shadow: 0 4px 20px -12px rgba(139, 115, 85, 0.15);
        }

        .phone-mockup {
          box-shadow: 0 25px 50px -12px rgba(139, 115, 85, 0.2), inset 0 0 0 1px rgba(0,0,0,0.05);
          border-radius: 2.5rem;
          overflow: hidden;
          position: absolute;
          background: white;
          width: 280px;
          height: 580px;
          transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          border: 8px solid var(--texto-fuerte);
          transform-style: preserve-3d;
        }
        .phone-mockup::before {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 40%; height: 24px; background: var(--texto-fuerte); border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; z-index: 50;
        }

        @keyframes soundwave { 0%, 100% { height: 8px; } 50% { height: 24px; } }
        .wave-bar { animation: soundwave 1s ease-in-out infinite; width: 4px; background: currentColor; border-radius: 2px; }
        .wave-bar:nth-child(2) { animation-delay: 0.2s; } .wave-bar:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes pulseRipples {
          0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(211, 47, 47, 0); }
          100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
        }
        .mic-listening { animation: pulseRipples 1.5s infinite; }
      `}} />

      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm glass-nav' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 border-2 border-[var(--dorado-gamlp)] rounded-full flex items-center justify-center shadow-sm bg-white text-[var(--rojo-carmesi)]">
                <i className="ph-fill ph-storefront block text-xl"></i>
              </div>
              <span className="font-display font-extrabold text-xl leading-tight text-[var(--texto-fuerte)]">
                Yanay<br/>
                <span className="text-[var(--dorado-gamlp)] text-[10px] uppercase tracking-widest block -mt-1 font-sans font-bold">Plataforma Inteligente</span>
              </span>
            </div>

            <div className="hidden md:flex rounded-full p-1 bg-white border border-[var(--borde)] shadow-sm relative">
              <div className={`absolute top-1 bottom-1 w-[180px] rounded-full transition-all duration-500 ease-out shadow-sm border border-[var(--borde)] ${
                profile === 'comprador' ? 'left-1 bg-[var(--verde-claro)]' : 'left-[185px] bg-[var(--rojo-claro)]'
              }`}></div>
              
              <button 
                onClick={() => setProfile('comprador')}
                className={`relative z-10 w-[180px] py-2.5 rounded-full text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
                  profile === 'comprador' ? 'text-[var(--verde-palta)]' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'
                }`}
              >
                <i className="ph-fill ph-shopping-cart"></i> App Ciudadana
              </button>
              <button 
                onClick={() => setProfile('casera')}
                className={`relative z-10 w-[180px] py-2.5 rounded-full text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
                  profile === 'casera' ? 'text-[var(--rojo-carmesi)]' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'
                }`}
              >
                <i className="ph-fill ph-storefront"></i> App Caseras
              </button>
            </div>
            
            <div className="md:hidden">
               <button 
                onClick={() => setProfile(profile === 'comprador' ? 'casera' : 'comprador')}
                className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-[var(--borde)] bg-white shadow-sm text-[var(--texto-fuerte)]"
              >
                <i className="ph-bold ph-arrows-left-right"></i>
                Ver {profile === 'comprador' ? 'Caseras' : 'Ciudadana'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 flex items-center overflow-hidden min-h-[90vh] pattern-rafia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full border-b border-[var(--dorado-gamlp)]/20 pb-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="flex flex-col justify-center relative z-20 min-h-[380px]">
              
              {/* Texto Comprador */}
              <div className={`absolute top-0 left-0 w-full transition-all duration-700 transform ${
                profile === 'comprador' ? 'opacity-100 translate-y-0 pointer-events-auto relative' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--verde-palta)]/30 bg-[var(--verde-claro)] text-[var(--verde-palta)] font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
                  <i className="ph-fill ph-shield-check"></i> El fin de la especulación
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-[var(--texto-fuerte)]">
                  Acabamos con la <br/>
                  <span className="text-[var(--verde-palta)]">Ceguera Informativa</span>.
                </h1>
                <p className="text-lg text-[var(--texto-suave)] leading-relaxed font-medium mb-8 max-w-lg">
                  El peregrinaje de puesto en puesto buscando precios justos es cosa del pasado. Filtra mercados, encuentra el costo real y exige garantía de "Peso Fiel" desde tu celular.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleInstallClick('comprador')}
                    className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--verde-palta)]/20 bg-gradient-to-r from-[var(--verde-palta)] to-[#2E7D32] text-white hover:-translate-y-1 border border-[#1B5E20] cursor-pointer"
                  >
                    Instalar App Ciudadana
                    <i className="ph-bold ph-download-simple"></i>
                  </button>
                  <Link 
                    href="/ciudadano"
                    className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-[var(--borde)] bg-white/50 text-[var(--texto-suave)] hover:bg-white hover:text-[var(--texto-fuerte)] shadow-sm"
                  >
                    Ingresar desde el navegador
                    <i className="ph-bold ph-arrow-right"></i>
                  </Link>
                </div>
              </div>

              {/* Texto Casera */}
              <div className={`absolute top-0 left-0 w-full transition-all duration-700 transform ${
                profile === 'casera' ? 'opacity-100 translate-y-0 pointer-events-auto relative' : 'opacity-0 translate-y-8 pointer-events-none absolute'
              }`}>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--rojo-carmesi)]/30 bg-[var(--rojo-claro)] text-[var(--rojo-carmesi)] font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
                  <i className="ph-fill ph-microphone-stage"></i> Cero Fricción Tecnológica
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-[var(--texto-fuerte)]">
                  La tecnología que se <br/>
                  <span className="text-[var(--rojo-carmesi)]">adapta a ti</span>.
                </h1>
                <p className="text-lg text-[var(--texto-suave)] leading-relaxed font-medium mb-8 max-w-lg">
                  Escribir con las manos ocupadas es imposible. Presiona un botón, dicta tus precios como hablas todos los días y nuestra Inteligencia Artificial los organizará.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleInstallClick('casera')}
                    className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--rojo-carmesi)]/20 bg-gradient-to-r from-[var(--rojo-carmesi)] to-[#B71C1C] text-white hover:-translate-y-1 border border-[#881111] cursor-pointer"
                  >
                    Instalar App Caseras
                    <i className="ph-bold ph-download-simple"></i>
                  </button>
                  <Link 
                    href="/casera/login"
                    className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-[var(--borde)] bg-white/50 text-[var(--texto-suave)] hover:bg-white hover:text-[var(--texto-fuerte)] shadow-sm"
                  >
                    Ingresar desde el navegador
                    <i className="ph-bold ph-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center perspective-[1200px] h-[600px] relative z-10 w-full mt-10 lg:mt-0">
              <div className="relative w-full max-w-[450px] h-[600px]">
                
                {/* MOCKUP COMPRADOR */}
                <div 
                  className={`phone-mockup cursor-pointer group origin-center ${
                    profile === 'comprador' 
                      ? 'z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 shadow-[0_30px_60px_-15px_rgba(56,142,60,0.25)] rotate-y-0' 
                      : 'z-10 top-1/2 left-[15%] -translate-x-1/2 -translate-y-[45%] scale-[0.80] rotate-y-[15deg] opacity-50 hover:opacity-100 border-[var(--borde)] shadow-xl'
                  }`}
                  onClick={() => setProfile('comprador')}
                >
                  <div className="w-full h-full bg-[#FDFBF7] flex flex-col relative pointer-events-none">
                    <div className="bg-white p-4 pt-12 border-b border-[var(--borde)] shadow-sm flex justify-between items-end">
                      <div>
                        <div className="font-display font-bold text-xl text-[var(--texto-fuerte)]">Ruta de Compra</div>
                        <div className="text-xs font-bold text-[var(--verde-palta)] flex items-center gap-1 mt-1"><i className="ph-fill ph-map-pin"></i> Mercado Rodríguez</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[var(--verde-claro)] text-[var(--verde-palta)] flex items-center justify-center text-sm font-bold border border-[var(--verde-palta)]/30">JD</div>
                    </div>
                    
                    <div className="p-4 flex-1 bg-[var(--bg-maiz)] space-y-4">
                      <div className="flex justify-between items-center px-3 py-4 bg-white rounded-xl border border-[var(--borde)] shadow-sm">
                        <span className="text-xs font-bold text-[var(--texto-suave)] uppercase tracking-wide">Presupuesto Estimado</span>
                        <span className="text-lg font-bold text-[var(--texto-fuerte)]">Bs. 124.50</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-[var(--borde)] shadow-sm flex gap-3 opacity-60 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
                           <i className="ph-bold ph-check-circle text-3xl text-[var(--verde-palta)]"></i>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">🍗</div>
                        <div className="flex-1">
                          <div className="flex justify-between"><span className="font-bold text-sm line-through text-[var(--texto-suave)]">Pollo Entero</span></div>
                          <div className="text-[11px] text-gray-500">Doña Justa - Puesto 12</div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border-l-4 border-l-[var(--verde-palta)] border border-[var(--borde)] shadow-sm flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--rojo-claro)] flex items-center justify-center text-xl shrink-0">🍅</div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-bold text-sm text-[var(--texto-fuerte)]">Tomate Perita</span>
                            <span className="font-bold text-[var(--verde-palta)] text-sm">Bs 4.00</span>
                          </div>
                          <div className="text-[11px] text-[var(--texto-suave)] mt-0.5">Doña María - Puesto 45</div>
                          <div className="mt-2 flex gap-1"><span className="bg-[var(--dorado-claro)] text-[var(--dorado-gamlp)] border border-[var(--dorado-gamlp)]/30 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">⚖️ Peso Fiel verificado</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MOCKUP CASERA */}
                <div 
                  className={`phone-mockup cursor-pointer group origin-center ${
                    profile === 'casera' 
                      ? 'z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 shadow-[0_30px_60px_-15px_rgba(211,47,47,0.25)] rotate-y-0' 
                      : 'z-10 top-1/2 left-[85%] -translate-x-1/2 -translate-y-[45%] scale-[0.80] rotate-y-[-15deg] opacity-50 hover:opacity-100 border-[var(--borde)] shadow-xl'
                  }`}
                  onClick={() => setProfile('casera')}
                >
                  <div className="w-full h-full bg-[var(--bg-maiz)] flex flex-col relative pointer-events-none">
                    <div className="p-4 pt-12 pb-6 bg-gradient-to-b from-[var(--rojo-carmesi)] to-[#B71C1C] relative text-white shadow-md border-b-4 border-[var(--dorado-gamlp)]">
                      <div className="text-[10px] text-white/80 font-bold uppercase mb-1 flex items-center gap-1">
                        <i className="ph-fill ph-storefront"></i> Puesto Inteligente
                      </div>
                      <div className="font-display font-bold text-2xl mb-2">Puesto Doña María</div>
                      <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold border border-white/30">
                        <i className="ph-fill ph-broadcast"></i> Visible en Mapa Ciudadano
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 space-y-4">
                      <div className="text-xs font-bold text-[var(--texto-suave)] uppercase tracking-wide mb-2 flex justify-between items-center">
                        Inventario en Vivo
                        <span className="w-2 h-2 rounded-full bg-[var(--verde-palta)] animate-pulse"></span>
                      </div>
                      
                      <div className="bg-white rounded-xl p-3 border border-[var(--borde)] flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-[var(--rojo-claro)] flex items-center justify-center text-xl">🍅</div>
                        <div className="flex-1"><div className="font-bold text-sm text-[var(--texto-fuerte)]">Tomate Perita</div><div className="text-[10px] text-[var(--texto-suave)]">Cuarta</div></div>
                        <div className="font-bold text-[var(--rojo-carmesi)] text-sm">Bs 4.00</div>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-[var(--borde)] flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-[var(--dorado-claro)] flex items-center justify-center text-xl">🥔</div>
                        <div className="flex-1"><div className="font-bold text-sm text-[var(--texto-fuerte)]">Papa Imilla</div><div className="text-[10px] text-[var(--texto-suave)]">Arroba</div></div>
                        <div className="font-bold text-[var(--rojo-carmesi)] text-sm">Bs 50.00</div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                      <div className={`flex gap-1 items-end h-6 text-[var(--rojo-carmesi)] transition-opacity ${profile === 'casera' ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="wave-bar"></div><div className="wave-bar"></div><div className="wave-bar"></div><div className="wave-bar"></div><div className="wave-bar"></div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-[var(--dorado-gamlp)] to-[#9B7A1C] rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center border-4 border-white text-white">
                        <i className="ph-fill ph-microphone text-2xl"></i>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <section className={`py-20 lg:py-24 relative bg-[var(--bg-maiz)] transition-opacity duration-500 ${profile === 'comprador' ? 'block' : 'hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16 reveal text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[var(--texto-fuerte)] mb-4">El poder vuelve al ciudadano</h2>
            <p className="text-[var(--texto-suave)] text-lg">
              Una plataforma diseñada para resolver la asimetría de información y proteger tu presupuesto diario.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-organic p-8 hover:border-[var(--verde-palta)]/50 transition-colors reveal">
              <div className="w-12 h-12 bg-[var(--verde-claro)] rounded-xl flex items-center justify-center mb-6 text-[var(--verde-palta)] shadow-sm border border-[var(--verde-palta)]/20 text-2xl">
                <i className="ph-fill ph-funnel"></i>
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-[var(--texto-fuerte)]">Filtros contra la Especulación</h3>
              <p className="text-[var(--texto-suave)] text-sm leading-relaxed font-medium">
                Descubre qué mercados están abiertos y utiliza filtros inteligentes como "Precio Más Bajo" para saber a quién comprarle antes de salir de casa.
              </p>
            </div>

            <div className="card-organic p-8 hover:border-[var(--verde-palta)]/50 transition-colors reveal" style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 bg-[var(--verde-claro)] rounded-xl flex items-center justify-center mb-6 text-[var(--verde-palta)] shadow-sm border border-[var(--verde-palta)]/20 text-2xl">
                <i className="ph-fill ph-list-checks"></i>
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-[var(--texto-fuerte)]">Logística Exacta de Compra</h3>
              <p className="text-[var(--texto-suave)] text-sm leading-relaxed font-medium">
                Arma tu lista durante la semana. La app la agrupará inteligentemente por recintos y calculará un Presupuesto Estimado preciso.
              </p>
            </div>

            <div className="card-organic p-8 hover:border-[var(--verde-palta)]/50 transition-colors reveal" style={{ transitionDelay: '200ms' }}>
              <div className="w-12 h-12 bg-[var(--verde-claro)] rounded-xl flex items-center justify-center mb-6 text-[var(--verde-palta)] shadow-sm border border-[var(--verde-palta)]/20 text-2xl">
                <i className="ph-fill ph-star-half"></i>
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-[var(--texto-fuerte)]">Reseñas Constructivas</h3>
              <p className="text-[var(--texto-suave)] text-sm leading-relaxed font-medium">
                El sistema prohíbe insultos y guía tus reseñas. Premia el buen trato usando etiquetas rápidas como <span className="bg-[var(--dorado-claro)] text-[var(--dorado-gamlp)] px-2 py-0.5 rounded text-xs font-bold border border-[var(--dorado-gamlp)]/30 mx-1">🎉 Me dio Yapa</span>.
              </p>
            </div>

            <div className="card-organic p-8 hover:border-[var(--verde-palta)]/50 transition-colors reveal" style={{ transitionDelay: '300ms' }}>
              <div className="w-12 h-12 bg-[var(--verde-claro)] rounded-xl flex items-center justify-center mb-6 text-[var(--verde-palta)] shadow-sm border border-[var(--verde-palta)]/20 text-2xl">
                <i className="ph-fill ph-siren"></i>
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-[var(--texto-fuerte)]">Auditor Urbano Voluntario</h3>
              <p className="text-[var(--texto-suave)] text-sm leading-relaxed font-medium">
                ¿Baños clausurados? Convierte tu queja en acción cívica. Usa la plataforma para reportar el estado de la infraestructura a la Intendencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 lg:py-24 relative bg-[var(--bg-maiz)] transition-opacity duration-500 ${profile === 'casera' ? 'block' : 'hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[var(--texto-fuerte)] mb-4">La primera app que entiende tu trabajo</h2>
              <p className="text-[var(--texto-suave)] text-lg mb-8 leading-relaxed font-medium">
                Sabemos que digitalizar el abasto tradicional requiere empatía. Hemos diseñado herramientas que respetan tu entorno y protegen tu prestigio comercial.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start bg-white p-6 rounded-2xl border border-[var(--borde)] shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[var(--rojo-claro)] shadow-sm flex items-center justify-center shrink-0 border border-[var(--rojo-carmesi)]/20 text-[var(--rojo-carmesi)] text-2xl">
                    <i className="ph-fill ph-microphone-stage"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[var(--texto-fuerte)]">Ingesta de Datos por Voz</h4>
                    <p className="text-sm text-[var(--texto-suave)] mt-1 leading-relaxed font-medium">
                      Escribir con las manos mojadas es imposible. Solo pulsa el micrófono y dicta. La IA entiende jergas locales ("arroba", "cuarta", "amarro").
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white p-6 rounded-2xl border border-[var(--borde)] shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[var(--dorado-claro)] shadow-sm flex items-center justify-center shrink-0 border border-[var(--dorado-gamlp)]/30 text-[var(--dorado-gamlp)] text-2xl">
                    <i className="ph-fill ph-users-three"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[var(--texto-fuerte)]">Red Solidaria "Casera Madrina"</h4>
                    <p className="text-sm text-[var(--texto-suave)] mt-1 leading-relaxed font-medium">
                      Nadie se queda atrás. Si tienes compañeras adultas mayores sin celular, apadrina su puesto y visibiliza sus precios para ganar descuentos en tu Patente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-maiz)] p-2 rounded-[2.5rem] border border-[var(--borde)] shadow-inner reveal">
              <div className="card-organic p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-lg flex items-center gap-2 text-[var(--texto-fuerte)]">
                    <i className="ph-fill ph-robot text-[var(--rojo-carmesi)] text-2xl"></i> IA de Extracción
                  </h3>
                  <span className="text-[10px] font-bold text-[var(--dorado-gamlp)] bg-[var(--dorado-claro)] border border-[var(--dorado-gamlp)]/30 px-2 py-1 rounded uppercase tracking-wide">Prueba Interactiva</span>
                </div>
                
                <div className="bg-[var(--bg-maiz)] border border-[var(--borde)] rounded-2xl p-5 mb-6 relative shadow-inner">
                  <p 
                    className={`text-sm font-medium leading-relaxed min-h-[80px] ${aiState === 'idle' ? 'italic text-[var(--texto-suave)]' : 'text-[var(--texto-fuerte)]'}`} 
                    dangerouslySetInnerHTML={{ __html: aiText }} 
                  />
                  
                  <button 
                    onClick={handleMicClick} 
                    className={`absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
                      aiState === 'listening' || aiState === 'typing' ? 'bg-[var(--dorado-gamlp)] mic-listening scale-110' : 
                      aiState === 'success' ? 'bg-[var(--verde-palta)]' : 'bg-gradient-to-r from-[var(--rojo-carmesi)] to-[#B71C1C] hover:scale-105'
                    }`}
                  >
                    {aiState === 'success' ? <i className="ph-bold ph-check text-2xl"></i> : <i className="ph-fill ph-microphone text-2xl"></i>}
                  </button>
                </div>

                <div className="mt-10 bg-[#1D3B27] rounded-xl p-4 font-mono text-[11px] sm:text-xs text-[var(--verde-claro)] overflow-x-auto relative shadow-inner border border-[#122418]">
                  <div className="absolute top-2 right-2 text-white/50 text-[9px] uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded">JSON Estructurado</div>
                  <pre className={`transition-opacity duration-500 mt-4 ${aiState === 'success' ? 'opacity-100' : 'opacity-50'}`}>
                    {aiJson}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-[var(--borde)] bg-white relative pattern-rafia">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal relative z-10">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4 text-[var(--texto-fuerte)]">
            La modernidad llega al abasto popular
          </h2>
          <p className="mb-12 max-w-2xl mx-auto text-base text-[var(--texto-suave)] font-medium">
            Ambas aplicaciones funcionan instantáneamente desde el navegador. Sin ocupar la memoria de tu teléfono ni perder tiempo en tiendas de apps. Selecciona tu perfil y comienza.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => handleInstallClick('comprador')} 
              className="px-8 py-4 bg-gradient-to-r from-[var(--verde-palta)] to-[#2E7D32] border border-[#1B5E20] text-white font-bold rounded-2xl shadow-lg shadow-[var(--verde-palta)]/20 flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <i className="ph-bold ph-download-simple text-xl"></i>
              Instalar App Ciudadana
            </button>
            <button 
              onClick={() => handleInstallClick('casera')} 
              className="px-8 py-4 bg-gradient-to-r from-[var(--rojo-carmesi)] to-[#B71C1C] border border-[#881111] text-white font-bold rounded-2xl shadow-lg shadow-[var(--rojo-carmesi)]/20 flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <i className="ph-bold ph-download-simple text-xl"></i>
              Instalar App Caseras
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[var(--borde)] py-12 text-center text-[var(--texto-suave)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--dorado-gamlp)] text-[var(--rojo-carmesi)] flex items-center justify-center">
               <i className="ph-fill ph-storefront text-sm"></i>
            </div>
            <span className="font-display font-bold text-xl text-[var(--texto-fuerte)]">Yanay</span>
          </div>
          <p className="text-sm font-medium mt-2">Tecnología cívica para el comercio tradicional urbano.</p>
        </div>
      </footer>

      {/* Modal PWA adaptado para iOS y Android */}
      <div className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${showPwaModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`card-organic p-8 w-full max-w-sm shadow-2xl transform transition-transform duration-300 ${showPwaModal ? 'scale-100' : 'scale-95'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ${installAppType === 'comprador' ? 'bg-[var(--verde-claro)] text-[var(--verde-palta)] border border-[var(--verde-palta)]/30' : 'bg-[var(--rojo-claro)] text-[var(--rojo-carmesi)] border border-[var(--rojo-carmesi)]/30'}`}>
              <i className={`ph-fill ${installAppType === 'comprador' ? 'ph-shopping-cart' : 'ph-storefront'} text-3xl`}></i>
            </div>
            <button onClick={closeInstallModal} className="text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)] bg-[var(--bg-maiz)] rounded-full p-2 transition-colors border border-[var(--borde)] cursor-pointer">
              <i className="ph-bold ph-x"></i>
            </button>
          </div>
          
          <h3 className="font-display text-xl font-bold text-[var(--texto-fuerte)] mb-2">
            Instalar App {installAppType === 'comprador' ? 'Ciudadana' : 'Caseras'}
          </h3>

          {isIOS ? (
            <div className="space-y-4 mb-6">
              <p className="text-sm text-[var(--texto-suave)] font-medium leading-relaxed">
                En iOS, debes agregar la app manualmente usando Safari:
              </p>
              <ol className="list-decimal list-inside text-xs text-[var(--texto-suave)] space-y-2 font-semibold">
                <li>Presiona el botón de <span className="font-bold text-[var(--texto-fuerte)]">Compartir</span> <i className="ph-bold ph-share text-base align-middle text-blue-500"></i> en la barra de Safari.</li>
                <li>Desliza hacia abajo y selecciona <span className="font-bold text-[var(--texto-fuerte)]">"Agregar a Inicio"</span> <i className="ph-bold ph-plus-square text-base align-middle text-gray-500"></i>.</li>
                <li>¡Listo! La tendrás como una App nativa en tu pantalla.</li>
              </ol>
            </div>
          ) : (
            <p className="text-sm text-[var(--texto-suave)] mb-6 font-medium">
              Añade la aplicación a tu pantalla de inicio para un acceso rápido, seguro y sin consumir la memoria de tu celular.
            </p>
          )}
          
          {!isIOS ? (
            <button onClick={simulateInstallSuccess} className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 text-sm cursor-pointer ${installAppType === 'comprador' ? 'bg-[var(--verde-palta)] hover:bg-[#2E7D32]' : 'bg-[var(--rojo-carmesi)] hover:bg-[#C62828]'}`}>
              Añadir a mi pantalla
            </button>
          ) : (
            <button onClick={closeInstallModal} className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-[var(--texto-fuerte)] font-bold rounded-xl text-sm transition-transform cursor-pointer">
              Entendido
            </button>
          )}
        </div>
      </div>

      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-[var(--texto-fuerte)] text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm transform transition-all duration-500 z-[200] flex items-center gap-3 border border-white/10 ${toastMsg ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${installAppType === 'comprador' ? 'bg-[var(--verde-palta)]' : 'bg-[var(--rojo-carmesi)]'}`}>
          <i className="ph-bold ph-check text-white text-xs"></i>
        </div>
        <span>{toastMsg}</span>
      </div>

    </div>
  );
}
