'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, Clock, Car, AlertCircle, Coffee, Star, HandHeart, Filter, MessageSquare, Send, Store } from 'lucide-react';
import { getMercadoById } from '@/modules/mercados/repository';
import { getCaserasPorMercado } from '@/modules/inventario/repository';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/ui/LeafletMap'), { ssr: false });
import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';

export default function MercadoDetail() {
  const params = useParams();
  const id = params.id as string;

  const [market, setMarket] = useState<any>(null);
  const [caseras, setCaseras] = useState<any[]>([]);
  const [mercadoActiveTab, setMercadoActiveTab] = useState('directorio');
  
  // Reseñas de Mercado
  const [comentariosMercado, setComentariosMercado] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [sugerenciaText, setSugerenciaText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoggedIn, setShowLoginModal } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      const [m, c] = await Promise.all([
        getMercadoById(id),
        getCaserasPorMercado(id)
      ]);
      setMarket(m);
      c.sort((a: any, b: any) => b.calificacion - a.calificacion);
      setCaseras(c);

      setComentariosMercado([
        { id: 1, autor: 'María T.', fecha: 'Hace 2 días', texto: 'El mercado está muy limpio, pero los baños necesitan más atención.', estrellas: 4, etiquetas: ['🧹 Pasillos Limpios', '🚽 Baños Clausurados/Sucios'] },
        { id: 2, autor: 'Juan P.', fecha: 'La semana pasada', texto: 'Seguridad en la puerta, da mucha tranquilidad al comprar.', estrellas: 5, etiquetas: ['👮 Gendarmes Activos'] }
      ]);
    }
    loadData();
  }, [id]);

  const toggleEtiqueta = (tag: string) => {
    if (etiquetas.includes(tag)) {
      setEtiquetas(etiquetas.filter(t => t !== tag));
    } else {
      setEtiquetas([...etiquetas, tag]);
    }
  };

  const handleEnviarSugerencia = () => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    if (rating === 0) {
      showToast("Por favor selecciona una valoración en estrellas.", "warning");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRating(0);
      setEtiquetas([]);
      setSugerenciaText('');
      setShowReviewForm(false);
      showToast("¡Gracias! Tu reporte cívico ayuda al GAMLP a mejorar la infraestructura.", "success");
    }, 1000);
  };

  if (!market) return <div className="p-10 text-center text-[var(--texto-suave)]">Cargando...</div>;

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-y-auto hide-scroll pb-28 anim-stagger">
      <div className="pattern-rafia px-6 pt-12 pb-6 relative shadow-sm border-b border-[var(--dorado-gamlp)]/30 shrink-0">
        <Link href="/ciudadano" className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tarjeta)]/90 backdrop-blur rounded-full mb-4 shadow-sm hover:bg-white transition-colors border border-[var(--borde)]">
          <ChevronLeft size={22} className="text-[var(--texto-fuerte)]" />
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[var(--bg-tarjeta)] rounded-2xl flex items-center justify-center text-4xl shadow-md border border-[var(--borde)] shrink-0">
            {market.img}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-[var(--texto-fuerte)] leading-tight">{market.nombre}</h1>
            <p className="text-[11px] font-bold text-[var(--rojo-carmesi)] uppercase tracking-wider flex items-center gap-1 mt-1">
              <MapPin size={10}/> {market.zona}
            </p>
          </div>
        </div>

        {/* Bloque de Información General del Mercado */}
        <div className="bg-[var(--bg-tarjeta)] rounded-xl p-4 border border-[var(--borde)] shadow-sm text-xs space-y-2 mt-4">
          <div className="flex items-start gap-2">
            <Calendar size={14} className="text-[var(--texto-suave)] shrink-0 mt-0.5"/>
            <div>
              <span className="font-bold text-[var(--texto-fuerte)] block">Días de Atención:</span>
              <span className="text-[var(--texto-suave)]">{market.dias}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-[var(--texto-suave)] shrink-0 mt-0.5"/>
            <div>
              <span className="font-bold text-[var(--texto-fuerte)] block">Horarios:</span>
              <span className="text-[var(--texto-suave)]">{market.horario}</span>
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-[var(--borde)] flex flex-wrap gap-1.5">
            {market.servicios.map((srv: string, idx: number) => (
              <span key={idx} className="bg-[var(--bg-maiz)] border border-[var(--borde)] px-2 py-1 rounded-md text-[10px] font-bold text-[var(--texto-suave)] flex items-center gap-1">
                {srv.includes('Parqueo') && <Car size={10}/>}
                {srv.includes('Baño') && <AlertCircle size={10}/>}
                {srv.includes('Comedor') && <Coffee size={10}/>}
                {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Mapa del Mercado */}
        <div className="h-48 w-full mt-4 rounded-xl overflow-hidden border border-[var(--borde)] shadow-sm relative z-0">
          <MapComponent 
            markers={[{
              id: market.id,
              lat: market.lat,
              lng: market.lng,
              title: market.nombre,
              icon: market.img
            }]}
            center={[market.lng, market.lat]}
            zoom={15}
          />
        </div>

        {/* Navegación Interna (Tabs deslizables) */}
        <div className="mt-6 tab-slider-bg w-full">
          <button 
            onClick={() => setMercadoActiveTab('directorio')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 flex justify-center items-center gap-1.5
              ${mercadoActiveTab === 'directorio' ? 'bg-[var(--bg-tarjeta)] text-[var(--texto-fuerte)] shadow-sm' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'}`}
          >
            <Store size={14}/> Directorio ({caseras.length})
          </button>
          <button 
            onClick={() => { setMercadoActiveTab('infraestructura'); setShowReviewForm(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 flex justify-center items-center gap-1.5
              ${mercadoActiveTab === 'infraestructura' ? 'bg-[var(--bg-tarjeta)] text-[var(--texto-fuerte)] shadow-sm' : 'text-[var(--texto-suave)] hover:text-[var(--texto-fuerte)]'}`}
          >
            <MessageSquare size={14}/> Reseñas ({comentariosMercado.length})
          </button>
        </div>
      </div>

      <div className="px-6 py-6 min-h-[300px]">
        {/* PESTAÑA: DIRECTORIO */}
        {mercadoActiveTab === 'directorio' && (
          <div className="anim-stagger">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-[var(--texto-fuerte)] uppercase tracking-widest">Caseras del Mercado</h2>
              <div className="text-[10px] text-[var(--texto-suave)] flex items-center gap-1 bg-[var(--bg-tarjeta)] px-2 py-1 rounded border border-[var(--borde)]">
                <Filter size={10}/> Mejor Calificadas
              </div>
            </div>

            <div className="space-y-4">
              {caseras.map((casera) => (
                <Link href={`/ciudadano/casera/${casera.id}`} key={casera.id} className="block card-organic interactive p-4 cursor-pointer relative overflow-hidden bg-[var(--bg-tarjeta)]">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-[var(--dorado-claro)] rounded-full flex items-center justify-center font-display text-xl text-[var(--dorado-gamlp)] font-bold border border-[var(--dorado-gamlp)]/30 shrink-0">
                      {casera.nombre.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-bold text-[var(--texto-fuerte)]">{casera.nombre}</h3>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--texto-fuerte)]">
                          <Star size={12} className="text-[var(--verde-palta)]" fill="currentColor"/> {casera.calificacion}
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--texto-suave)] mb-1">Puesto {casera.puesto} • {casera.especialidad}</p>
                      
                      <div className="flex gap-1 flex-wrap mt-1">
                        {casera.apadrinada && (
                          <span className="text-[9px] font-bold bg-[var(--rojo-claro)] text-[var(--rojo-carmesi)] px-2 py-1 rounded border border-[var(--rojo-carmesi)]/20 flex items-center gap-1">
                            <HandHeart size={10}/> Validada por comunidad
                          </span>
                        )}
                        <span className="text-[9px] font-bold bg-[var(--verde-claro)] text-[var(--verde-palta)] px-2 py-1 rounded border border-[var(--verde-palta)]/20 flex items-center gap-1">
                          Abierto
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA: RESEÑAS DE INFRAESTRUCTURA (GAMLP) */}
        {mercadoActiveTab === 'infraestructura' && (
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
                  <MessageSquare size={18} /> Auditar este Mercado
                </button>

                {comentariosMercado.map(com => (
                  <div key={com.id} className="card-organic p-4 bg-[var(--bg-tarjeta)]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-display text-sm font-bold text-blue-600 border border-blue-200">
                          {com.autor.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[var(--texto-fuerte)]">{com.autor}</h4>
                          <p className="text-[9px] text-[var(--texto-suave)]">{com.fecha}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < com.estrellas ? 'text-[var(--dorado-gamlp)]' : 'text-gray-200'} fill={i < com.estrellas ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    {com.etiquetas && com.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2 pl-10">
                        {com.etiquetas.map((tag: string, i: number) => (
                          <span key={i} className="text-[9px] font-bold bg-[var(--bg-maiz)] text-[var(--texto-suave)] px-2 py-0.5 rounded border border-[var(--borde)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-[var(--texto-suave)] leading-relaxed font-medium pl-10 italic">
                      &quot;{com.texto}&quot;
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-gradient-to-br from-[var(--bg-tarjeta)] to-white border border-[var(--dorado-gamlp)]/30 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--dorado-gamlp)]"></div>
                <div className="flex justify-between items-center mb-4 pl-2">
                  <h3 className="font-display font-bold text-lg text-[var(--texto-fuerte)]">Auditoría Urbana (GAMLP)</h3>
                  <button onClick={() => setShowReviewForm(false)} className="text-[10px] font-bold text-[var(--texto-suave)] hover:text-red-500">Cancelar</button>
                </div>
                <p className="text-xs text-[var(--texto-suave)] leading-relaxed mb-6 pl-2">
                  Conviértete en auditor voluntario de la Intendencia. Tu voz ayuda a mejorar la infraestructura de los mercados paceños.
                </p>

                {/* Formulario Guiado de Infraestructura */}
                <div className="space-y-5 pl-2">
                  
                  {/* Paso 1: Estrellas */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--texto-fuerte)] uppercase tracking-widest mb-2"><span className="bg-[var(--dorado-gamlp)] text-white px-1.5 py-0.5 rounded mr-1">1</span> Valoración General</p>
                    <p className="text-xs font-bold mb-2">¿Qué tal estuvo tu experiencia hoy en el mercado?</p>
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

                  {/* Paso 2: Etiquetas */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--texto-fuerte)] uppercase tracking-widest mb-2"><span className="bg-[var(--dorado-gamlp)] text-white px-1.5 py-0.5 rounded mr-1">2</span> Etiquetas Rápidas</p>
                    <p className="text-xs font-bold mb-2">¿Qué aspectos de la infraestructura llamaron tu atención?</p>
                    <div className="flex flex-wrap gap-2">
                      {['🧹 Pasillos Limpios', '👮 Gendarmes Activos', '⚠️ Poca Luz', '🚽 Baños Clausurados/Sucios'].map((tag) => (
                        <button 
                          key={tag}
                          onClick={() => toggleEtiqueta(tag)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${etiquetas.includes(tag) ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-inner' : 'bg-white border-[var(--borde)] text-[var(--texto-suave)]'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paso 3: Sugerencia GAMLP */}
                  <div>
                    <p className="text-[10px] font-bold text-[var(--texto-fuerte)] uppercase tracking-widest mb-2"><span className="bg-[var(--dorado-gamlp)] text-white px-1.5 py-0.5 rounded mr-1">3</span> Sugerencia Constructiva</p>
                    <textarea 
                      rows={4} 
                      placeholder="💡 Tu voz ayuda a mejorar la ciudad. Por favor, escribe un mensaje constructivo e informativo (evita insultos; los reportes amables se procesan más rápido por el municipio)."
                      value={sugerenciaText}
                      onChange={(e) => setSugerenciaText(e.target.value)}
                      className="w-full bg-white border border-[var(--borde)] rounded-xl p-3 text-xs text-[var(--texto-fuerte)] placeholder-[var(--texto-suave)] focus:outline-none focus:border-[var(--dorado-gamlp)] transition-colors resize-none shadow-inner"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleEnviarSugerencia}
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Enviando Auditoría...</span>
                    ) : (
                      <><Send size={18} /> Enviar Auditoría a Intendencia</>
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
