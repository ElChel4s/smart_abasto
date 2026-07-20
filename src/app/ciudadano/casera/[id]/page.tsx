'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Star, Store, MapPin, Clock, CreditCard, QrCode, 
  HandHeart, Info, Tag, MessageSquare, Check, Plus, AlertTriangle, AlertCircle, Send
} from 'lucide-react';
import { getCaseraById, getInventarioByCasera, getComentariosByCasera, submitResenaCasera } from '@/modules/inventario/repository';
import { getMercadoById } from '@/modules/mercados/repository';
import { crearAlertaWaze } from '@/modules/compras/waze-alerts';
import { useCart } from '@/shared/context/CartContext';
import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';
import { supabase } from '@/shared/lib/supabase';

export default function CaseraDetail() {
  const params = useParams();
  const id = params.id as string;

  const [casera, setCasera] = useState<any>(null);
  const [market, setMarket] = useState<any>(null);
  const [inventario, setInventario] = useState<any[]>([]);
  const [caseraActiveTab, setCaseraActiveTab] = useState('productos');
  const [alertas, setAlertas] = useState<Record<string, 'AGOTADO' | 'PRECIO_INCORRECTO'>>({});
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);

  // Formulario Guiado de Reseña
  const [rating, setRating] = useState(0);
  const [pesoJusto, setPesoJusto] = useState<boolean | null>(null);
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [sugerenciaText, setSugerenciaText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { cart, toggleCart } = useCart();
  const { isLoggedIn, setShowLoginModal, perfil } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      const c = await getCaseraById(id);
      if (!c) return;
      setCasera(c);
      const [m, inv, coms] = await Promise.all([
        getMercadoById(c.mercado_id),
        getInventarioByCasera(id),
        getComentariosByCasera(id)
      ]);
      setMarket(m);
      setInventario(inv);
      setComentarios(coms);
    }
    loadData();

    // Check query params to open evaluation tab immediately
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      if (query.get('evaluar') === 'true') {
        setCaseraActiveTab('resenas');
        setShowReviewForm(true);
      }
    }

    // === Realtime Inventario (Supabase) ===
    const channel = supabase
      .channel('inventario_ciudadano_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'inventario', filter: `casera_id=eq.${id}` },
        async (payload) => {
          // El inventario cambió (ej. la casera confirmó que se agotó)
          const inv = await getInventarioByCasera(id);
          setInventario(inv);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleReportar = async (invId: string, tipo: 'AGOTADO' | 'PRECIO_INCORRECTO') => {
    // UI optimistic update
    setAlertas(prev => ({ ...prev, [invId]: tipo }));
    setReportingId(null);
    
    // Convert to DB enum
    const dbTipo = tipo === 'AGOTADO' ? 'agotado' : 'precio_alto';
    
    // Use perfil?.id if available, otherwise undefined
    const ciudadanoId = perfil?.id;
    
    const success = await crearAlertaWaze(invId, casera.id, ciudadanoId, dbTipo);
    
    if (success) {
      showToast(tipo === 'AGOTADO' ? "¡Gracias! Tu reporte ayuda a alertar sobre stock agotado." : "¡Gracias! Tu reporte ayuda a avisar sobre precio desactualizado.", "success");
    } else {
      // Revert on failure
      setAlertas(prev => {
        const newAlertas = { ...prev };
        delete newAlertas[invId];
        return newAlertas;
      });
      showToast("Hubo un error al enviar tu reporte.", "error");
    }
  };

  const handleEnviarSugerencia = async () => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    if (rating === 0) {
      showToast("Por favor selecciona una valoración en estrellas.", "warning");
      return;
    }
    if (pesoJusto === null) {
      showToast("Por favor indica si la casera te dio el peso justo.", "warning");
      return;
    }
    
    setIsSubmitting(true);
    
    const success = await submitResenaCasera({
      casera_id: casera.id,
      ciudadano_id: perfil?.id,
      calificacion_estrellas: rating,
      peso_fiel: pesoJusto,
      etiquetas_rapidas: etiquetas,
      comentario: sugerenciaText
    });

    setIsSubmitting(false);

    if (success) {
      const newComentario = {
        id: Date.now(),
        autor: perfil?.nombre || 'Ciudadano',
        fecha: 'Hace un momento',
        texto: sugerenciaText,
        estrellas: rating,
        pesoJusto: pesoJusto,
        etiquetas: etiquetas
      };
      setComentarios([newComentario, ...comentarios]);
      setRating(0);
      setPesoJusto(null);
      setEtiquetas([]);
      setSugerenciaText('');
      setShowReviewForm(false);
      showToast("¡Gracias! Tu reseña ha sido publicada con éxito.", "success");
    } else {
      showToast("Hubo un error al guardar la reseña. Inténtalo de nuevo.", "error");
    }
  };
  
  const toggleEtiqueta = (tag: string) => {
    if (etiquetas.includes(tag)) {
      setEtiquetas(etiquetas.filter(t => t !== tag));
    } else {
      setEtiquetas([...etiquetas, tag]);
    }
  };

  if (!casera || !market) return <div className="p-10 text-center text-[var(--texto-suave)]">Cargando...</div>;

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-28 anim-stagger">
      
      {/* Cabecera Casera */}
      <div className="pattern-rafia px-6 pt-12 pb-6 relative shadow-sm border-b border-[var(--dorado-gamlp)]/30 shrink-0">
        <Link href={`/ciudadano/mercado/${market.id}`} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tarjeta)] rounded-full mb-6 border border-[var(--borde)] hover:bg-white transition-colors">
          <ChevronLeft size={22} className="text-[var(--texto-fuerte)]" />
        </Link>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="w-24 h-24 bg-[var(--rojo-carmesi)] rounded-3xl flex flex-col items-center justify-center text-[var(--bg-tarjeta)] font-display text-4xl font-bold shadow-lg border-4 border-[var(--bg-tarjeta)] relative shrink-0">
            {casera.nombre.charAt(0)}
            <div className="absolute -bottom-3 bg-[var(--verde-palta)] text-[var(--bg-tarjeta)] text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1 border-2 border-[var(--bg-tarjeta)]">
              <Star size={10} fill="currentColor"/> {casera.calificacion}
            </div>
          </div>
          <div className="flex-1 mt-1">
            <h1 className="font-display text-2xl font-bold text-[var(--texto-fuerte)] leading-tight flex items-center gap-2">
              {casera.nombre}
            </h1>
            <p className="text-[var(--texto-suave)] text-xs font-medium flex items-center gap-1 mt-1"><Store size={12}/> {market.nombre}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-[var(--verde-claro)] text-[var(--verde-palta)] text-[10px] font-bold px-2 py-1 rounded-full border border-[var(--verde-palta)]/30 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--verde-palta)] animate-pulse"></div> Abierto Ahora
            </div>
          </div>
        </div>

        {/* Bloque de Información General Casera */}
        <div className="bg-[var(--bg-tarjeta)] rounded-xl p-4 border border-[var(--borde)] shadow-sm grid grid-cols-2 gap-3 mt-4">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--texto-suave)] flex items-center gap-1 mb-1"><Clock size={10}/> Horario</p>
            <p className="text-xs font-bold text-[var(--texto-fuerte)]">{casera.horario}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--texto-suave)] flex items-center gap-1 mb-1"><MapPin size={10}/> Ubicación Exacta</p>
            <p className="text-xs font-bold text-[var(--texto-fuerte)]">{casera.sector}</p>
            <p className="text-[10px] text-[var(--texto-suave)]">Puesto {casera.puesto}</p>
          </div>
          <div className="col-span-2 pt-2 border-t border-[var(--borde)] flex items-center justify-between">
             <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--texto-suave)] flex items-center gap-1 mb-1"><CreditCard size={10}/> Medios de Pago</p>
                <div className="flex gap-1">
                  {casera.metodos_pago.map((pago: string, idx: number) => (
                    <span key={idx} className="bg-[var(--bg-maiz)] border border-[var(--borde)] px-2 py-0.5 rounded text-[10px] font-bold text-[var(--texto-fuerte)] flex items-center gap-1">
                      {pago.includes('QR') ? <QrCode size={10}/> : null} {pago}
                    </span>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {casera.apadrinada && (
          <div className="mt-4 bg-gradient-to-r from-[var(--dorado-claro)] to-[var(--bg-tarjeta)] border border-[var(--dorado-gamlp)]/40 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
            <Info size={18} className="text-[var(--dorado-gamlp)] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-[11px] font-bold text-[var(--texto-fuerte)] mb-1">Casera Apadrinada</h4>
              <p className="text-[10px] text-[var(--texto-suave)] font-medium leading-relaxed">
                Sus precios son validados por la comunidad. Eres parte de su escudo cívico.
              </p>
            </div>
          </div>
        )}

        {/* Navegación Interna (Tabs deslizables) */}
        <div className="mt-6 tab-slider-bg w-full">
          <button 
            onClick={() => setCaseraActiveTab('productos')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 flex justify-center items-center gap-1.5
              ${caseraActiveTab === 'productos' ? 'bg-[var(--bg-tarjeta)] text-[var(--texto-fuerte)] shadow-sm' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'}`}
          >
            <Tag size={14}/> Catálogo ({inventario.length})
          </button>
          <button 
            onClick={() => { setCaseraActiveTab('resenas'); setShowReviewForm(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 flex justify-center items-center gap-1.5
              ${caseraActiveTab === 'resenas' ? 'bg-[var(--bg-tarjeta)] text-[var(--texto-fuerte)] shadow-sm' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'}`}
          >
            <MessageSquare size={14}/> Reseñas ({comentarios.length})
          </button>
        </div>
      </div>

      {/* Contenido Dinámico de las Pestañas */}
      <div className="px-6 py-4 min-h-[300px]">
        
        {/* PESTAÑA: PRODUCTOS */}
        {caseraActiveTab === 'productos' && (
          <div className="space-y-4 anim-stagger">
            {inventario.map(inv => {
              const inCart = cart.some((c: any) => c.id === inv.id);
              const hasAlert = alertas[inv.id];
              
              return (
                <div key={inv.id} className="card-organic flex flex-col overflow-hidden relative bg-[var(--bg-tarjeta)]">
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl bg-[var(--bg-maiz)] w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--borde)]">{inv.producto?.icono}</span>
                        <div>
                          <h3 className="font-bold text-[var(--texto-fuerte)] text-sm mb-0.5">{inv.producto?.nombre}</h3>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-[var(--rojo-carmesi)]">Bs {inv.precio.toFixed(2)}</span>
                            <span className="text-[10px] text-[var(--texto-suave)] font-medium">/ {inv.unidad}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-0 border-t border-[var(--borde)] flex justify-between items-center mt-0 pt-3">
                    {reportingId === inv.id ? (
                      <div className="flex gap-1.5 items-center">
                        <button onClick={() => handleReportar(inv.id, 'AGOTADO')} className="bg-[var(--rojo-claro)] text-[var(--rojo-carmesi)] border border-[var(--rojo-carmesi)]/20 px-2 py-1 rounded text-[10px] font-bold">
                          Agotado
                        </button>
                        <button onClick={() => handleReportar(inv.id, 'PRECIO_INCORRECTO')} className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded text-[10px] font-bold">
                          Precio Antiguo
                        </button>
                        <button onClick={() => setReportingId(null)} className="text-[10px] text-gray-400 hover:text-gray-600 px-1">
                          Volver
                        </button>
                      </div>
                    ) : hasAlert ? (
                       <div className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded ${hasAlert === 'AGOTADO' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50'}`}>
                         <AlertCircle size={12}/> {hasAlert === 'AGOTADO' ? 'Reportado Agotado' : 'Precio Incorrecto'}
                       </div>
                    ) : (
                      <button onClick={() => { if (!isLoggedIn) { setShowLoginModal(true); return; } setReportingId(inv.id); }} className="text-[10px] font-medium text-[var(--texto-suave)] hover:text-yellow-600 flex items-center gap-1 transition-colors">
                        <AlertTriangle size={12} /> Informar problema
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        const fullItem = { ...inv, prod: inv.producto, casera, mercado: market };
                        toggleCart(fullItem);
                      }}
                      className={`h-8 px-4 rounded-lg flex items-center justify-center transition-all shadow-sm border text-xs font-bold gap-1.5
                        ${inCart ? 'bg-[var(--verde-palta)] text-[var(--bg-tarjeta)] border-[var(--verde-palta)]' : 'bg-white text-[var(--texto-fuerte)] hover:bg-[var(--dorado-claro)] hover:border-[var(--dorado-gamlp)] border-[var(--borde)]'}`}
                    >
                      {inCart ? <><Check size={14} /> En Ruta</> : <><Plus size={14} /> Añadir</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* PESTAÑA: CALIFICAR Y SUGERENCIAS */}
        {caseraActiveTab === 'resenas' && (
          <div className="space-y-4 anim-stagger">
            
            {!showReviewForm ? (
              <>
                <button 
                  onClick={() => {
                     if (!isLoggedIn) { setShowLoginModal(true); return; }
                     setShowReviewForm(true);
                  }}
                  className="w-full py-4 border-2 border-dashed border-[var(--dorado-gamlp)]/50 text-[var(--dorado-gamlp)] bg-[var(--dorado-claro)]/30 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-[var(--dorado-gamlp)] hover:bg-[var(--dorado-claro)] active:scale-95 transition-all"
                >
                  <MessageSquare size={18} /> Evaluar a esta Casera
                </button>

                {comentarios.map(com => (
                  <div key={com.id} className="card-organic p-4 bg-[var(--bg-tarjeta)]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[var(--dorado-claro)] rounded-full flex items-center justify-center font-display text-sm font-bold text-[var(--dorado-gamlp)] border border-[var(--dorado-gamlp)]/30">
                          {com.autor.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[var(--texto-fuerte)]">{com.autor}</h4>
                          <p className="text-[9px] text-[var(--texto-suave)]">{com.fecha}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < com.estrellas ? 'text-[var(--dorado-gamlp)]' : 'text-gray-200'} fill={i < com.estrellas ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${com.pesoJusto ? 'bg-[var(--verde-claro)] text-[var(--verde-palta)] border-[var(--verde-palta)]/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {com.pesoJusto ? '⚖️ Peso Justo' : '❌ Peso Dudoso'}
                        </span>
                      </div>
                    </div>
                    {com.etiquetas && com.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1 pl-10 mb-2">
                        {com.etiquetas.map((tag: string, i: number) => (
                          <span key={i} className="text-[9px] font-bold bg-[var(--bg-maiz)] text-[var(--texto-suave)] px-2 py-0.5 rounded border border-[var(--borde)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {com.texto && (
                      <p className="text-[11px] text-[var(--texto-suave)] font-medium leading-relaxed italic pl-10">
                        &quot;{com.texto}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-gradient-to-br from-[var(--bg-tarjeta)] to-[var(--bg-maiz)] border border-[var(--dorado-gamlp)]/30 rounded-2xl p-5 shadow-sm text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-bold text-lg text-[var(--texto-fuerte)]">Evaluar a la Casera</h3>
                  <button onClick={() => setShowReviewForm(false)} className="text-[10px] font-bold text-[var(--texto-suave)] hover:text-red-500">Cancelar</button>
                </div>
                <p className="text-xs text-[var(--texto-suave)] leading-relaxed mb-6">
                  Tu calificación y reseña son <span className="font-bold text-[var(--dorado-gamlp)]">públicas</span>. Por favor, evalúa con honestidad, amabilidad y respeto.
                </p>

                {/* Formulario Guiado */}
                <div className="space-y-5">
                  
                  {/* Paso 1: Estrellas */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--texto-fuerte)] uppercase tracking-widest mb-2"><span className="bg-[var(--dorado-gamlp)] text-white px-1.5 py-0.5 rounded mr-1">1</span> Valoración General</p>
                    <p className="text-xs font-bold mb-2">¿Qué tal estuvo la atención y calidad del puesto?</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          onClick={() => setRating(star)}
                          className={`transition-transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-[var(--dorado-gamlp)]' : 'text-gray-200'}`}
                        >
                          <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paso 2: Peso Justo */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--texto-fuerte)] uppercase tracking-widest mb-2"><span className="bg-[var(--dorado-gamlp)] text-white px-1.5 py-0.5 rounded mr-1">2</span> Certificación del Núcleo Comercial</p>
                    <p className="text-xs font-bold mb-2">¿La casera te dio el peso fiel?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPesoJusto(true)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${pesoJusto === true ? 'bg-[var(--verde-claro)] border-[var(--verde-palta)] text-[var(--verde-palta)]' : 'bg-white border-[var(--borde)] text-[var(--texto-suave)]'}`}
                      >
                        ⚖️ Sí, Peso Justo
                      </button>
                      <button 
                        onClick={() => setPesoJusto(false)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${pesoJusto === false ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-[var(--borde)] text-[var(--texto-suave)]'}`}
                      >
                        ❌ No / Dudoso
                      </button>
                    </div>
                  </div>

                  {/* Paso 3: Etiquetas */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--texto-fuerte)] uppercase tracking-widest mb-2"><span className="bg-[var(--dorado-gamlp)] text-white px-1.5 py-0.5 rounded mr-1">3</span> Etiquetas Rápidas</p>
                    <p className="text-xs font-bold mb-2">¿Qué es lo que más rescatas de comprarle a esta casera?</p>
                    <div className="flex flex-wrap gap-2">
                      {['🎉 ¡Me dio Yapa!', '🍎 Producto Fresquito', '😊 Atención Amable', '💵 Tiene cambio/sencillo'].map((tag) => (
                        <button 
                          key={tag}
                          onClick={() => toggleEtiqueta(tag)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${etiquetas.includes(tag) ? 'bg-[var(--dorado-claro)] border-[var(--dorado-gamlp)] text-[var(--dorado-gamlp)]' : 'bg-white border-[var(--borde)] text-[var(--texto-suave)]'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paso 4: Tips */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--texto-fuerte)] uppercase tracking-widest mb-2"><span className="bg-[var(--dorado-gamlp)] text-white px-1.5 py-0.5 rounded mr-1">4</span> Reseña Pública</p>
                    <textarea 
                      rows={4} 
                      placeholder="💡 Escribe tu reseña con respeto y amabilidad. Recuerda que tu comentario será público para ayudar a otros vecinos."
                      value={sugerenciaText}
                      onChange={(e) => setSugerenciaText(e.target.value)}
                      className="w-full bg-white border border-[var(--borde)] rounded-xl p-3 text-xs text-[var(--texto-fuerte)] placeholder-[var(--texto-suave)] focus:outline-none focus:border-[var(--dorado-gamlp)] transition-colors resize-none shadow-inner"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleEnviarSugerencia}
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-[var(--rojo-carmesi)] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Publicando...</span>
                    ) : (
                      <><Send size={18} /> Publicar Reseña Constructiva</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
