'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useRouter } from 'next/navigation';

import { getInventario, updateInventario, getAhijada, updateDisponibilidadProducto, getProductosMaestro, createProductoMaestro, getComentariosByCasera, type ProductoBase } from '@/modules/inventario/repository';
import { processCaseraInput, processCaseraAudioForm } from '@/modules/ia-voice/actions';
import { getAlertasActivas, resolverAlertaWaze, type AlertaWaze } from '@/modules/compras/waze-alerts';
import { supabase } from '@/shared/lib/supabase';

// === Componentes de UI Compartidos (Dev UI) ===
import { organicMarketStyles } from '@/components/ui/organicMarketStyles';
import ToastNotificacion from '@/components/ui/ToastNotificacion';
import BottomNavCasera from '@/components/ui/BottomNavCasera';

// === Componentes de Módulos (Dev Frontend / IA / Fullstack) ===
import CaseraHome from '@/modules/inventario/components/CaseraHome';
import CaseraInventario from '@/modules/inventario/components/CaseraInventario';
import MadrinaView from '@/modules/inventario/components/MadrinaView';
import AlertasCasera from '@/modules/compras/components/AlertasCasera';
import CaseraEditor from '@/modules/ia-voice/components/CaseraEditor';


/**
 * Orquestador principal de la App Casera.
 * 
 * Este componente NO contiene lógica visual propia.
 * Solo administra el estado global y delega a los componentes de cada módulo DDD.
 * 
 * Mapa de responsabilidades:
 * - CaseraHome       → modules/inventario/components/
 * - CaseraInventario → modules/inventario/components/
 * - MadrinaView      → modules/inventario/components/
 * - AlertasCasera    → modules/compras/components/
 * - CaseraEditor     → modules/ia-voice/components/
 * - BottomNavCasera  → components/ui/
 * - ToastNotificacion → components/ui/
 */
export default function CaseraDashboard() {
  const { auth, isInitializing } = useAuth();
  const router = useRouter();

  // === Estado de Navegación ===
  const [activeTab, setActiveTab] = useState('home');

  // === Estado de Datos (Repositorios) ===
  const [inventario, setInventario] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<AlertaWaze[]>([]);
  const [ahijada, setAhijada] = useState<any>(null);
  const [productosMaestro, setProductosMaestro] = useState<ProductoBase[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // === Estado del Editor (Módulo IA-Voice) ===
  const [updateStep, setUpdateStep] = useState('manual');
  const [updateTarget, setUpdateTarget] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef('');
  const [drafts, setDrafts] = useState<any[]>([]);

  // === Estado de UI Compartido ===
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });
  const [showApadrinarModal, setShowApadrinarModal] = useState(false);

  // === Autenticación ===
  useEffect(() => {
    if (isInitializing) return;
    
    if (!auth.isAuthenticated || auth.userType !== 'casera') {
      router.push('/casera/login');
      return;
    }
    if (auth.perfil) {
      // Cargar inventario propio y de ahijada en paralelo
      Promise.all([
        getInventario(auth.perfil.id),
        getAhijada(auth.perfil.id), // Buscar si soy madrina de alguien
        getProductosMaestro(), // Cargar base de productos para nuevos registros
        getAlertasActivas(auth.perfil.id), // Cargar alertas reales
        getComentariosByCasera(auth.perfil.id) // Cargar reseñas
      ]).then(([inv, ahijadaData, maestros, alertasActivas, coms]) => {
        setInventario(inv);
        if (ahijadaData) {
          setAhijada(ahijadaData);
        }
        setProductosMaestro(maestros);
        setAlertas(alertasActivas);
        setComentarios(coms);
        setLoading(false);
      });
    }
  }, [auth, isInitializing, router]);

  // === Realtime Alertas (Supabase) ===
  useEffect(() => {
    if (!auth.perfil) return;
    
    const channel = supabase
      .channel('alertas_casera_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alertas_waze', filter: `casera_id=eq.${auth.perfil.id}` },
        async (payload) => {
          // Un nuevo reporte fue creado. Recargamos todas las alertas activas para tener la información fresca
          // (con el join de productos_maestro que hace getAlertasActivas).
          const alertasActualizadas = await getAlertasActivas(auth.perfil!.id);
          setAlertas(alertasActualizadas);
          showToast("¡Nueva alerta comunitaria recibida!", "warning");
        }
      )
      .subscribe();

    const channelComentarios = supabase
      .channel('comentarios_casera_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'evaluacion_caseras', filter: `casera_id=eq.${auth.perfil.id}` },
        async (payload) => {
          const comsActualizados = await getComentariosByCasera(auth.perfil!.id);
          setComentarios(comsActualizados);
          showToast("¡Has recibido un nuevo comentario amable de un cliente!", "success");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(channelComentarios);
    };
  }, [auth.perfil]);

  const miPerfil = auth.perfil;

  // === Acciones de UI ===
  const showToast = (msg: string, type = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
  };

  // === Acciones de Inventario (Dev Backend) ===
  const abrirEditor = (vendor: any) => {
    setUpdateTarget(vendor);
    const listadoActual = (ahijada && vendor.id === ahijada.id) ? ahijada.inventario : inventario;
    setDrafts(JSON.parse(JSON.stringify(listadoActual)));
    setUpdateStep('manual');
    setActiveTab('editor');
    setInputText('');
  };

  const toggleDisponibilidad = async (id: string, isAhijada = false) => {
    // Optimistic UI Update
    const currentList = isAhijada ? ahijada.inventario : inventario;
    const item = currentList.find((i: any) => i.id === id);
    if (!item) return;
    
    const newStatus = !item.disponible;
    
    if (isAhijada) {
      setAhijada((prev: any) => ({ ...prev, inventario: prev.inventario.map((i: any) => i.id === id ? { ...i, disponible: newStatus } : i) }));
    } else {
      setInventario(prev => prev.map(i => i.id === id ? { ...i, disponible: newStatus } : i));
    }

    // Persist to DB
    const success = await updateDisponibilidadProducto(id, newStatus);
    if (success) {
      showToast(isAhijada ? `Actualizado para ${ahijada?.nombre}` : "Disponibilidad actualizada", "success");
    } else {
      // Revert if failed
      if (isAhijada) {
        setAhijada((prev: any) => ({ ...prev, inventario: prev.inventario.map((i: any) => i.id === id ? { ...i, disponible: item.disponible } : i) }));
      } else {
        setInventario(prev => prev.map(i => i.id === id ? { ...i, disponible: item.disponible } : i));
      }
      showToast("Error al actualizar estado en la base de datos", "error");
    }
  };

  // === Acciones de Alertas (Dev Fullstack) ===
  const resolverAlerta = async (alertaId: string, accion: 'confirmar' | 'ignorar', inventarioId: string, tipoAlerta: 'agotado' | 'precio_alto') => {
    // Optimistic UI update
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
    if (accion === 'confirmar' && tipoAlerta === 'agotado') {
      setInventario(prev => prev.map(i => i.id === inventarioId ? { ...i, disponible: false } : i));
      showToast("Producto marcado como Agotado.", "success");
    } else if (accion === 'ignorar') {
      showToast("Alerta descartada. Tu reputación está protegida.", "info");
    } else {
      showToast("Alerta confirmada.", "success");
    }

    // Persist to backend
    const success = await resolverAlertaWaze(alertaId, accion, inventarioId, tipoAlerta);
    if (!success) {
      // Si falla, podrías recargar las alertas, pero por UX es mejor ignorarlo.
      console.error("Error backend al resolver alerta");
    }
  };

  // === Acciones de IA / Dictado (Dev IA) ===
  const toggleDictation = () => {
    if (isDictating) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsDictating(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Tu navegador no soporta dictado por voz automático.", "error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-BO'; 

    recognition.onstart = () => {
      setIsDictating(true);
      baseTextRef.current = inputText; // Guardamos el texto que ya había antes de empezar a hablar
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // Actualizamos el texto base con lo final, para que no se duplique en la próxima iteración
      if (finalTranscript) {
        baseTextRef.current = (baseTextRef.current + ' ' + finalTranscript).trim();
      }
      
      // Mostramos el texto consolidado + lo que se está hablando ahora mismo (interim)
      setInputText((baseTextRef.current + ' ' + interimTranscript).trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsDictating(false);
      showToast("Error al escuchar. Revisa tu micrófono.", "error");
    };

    recognition.onend = () => {
      setIsDictating(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleProcessInput = async (type: 'text' | 'audio', content: string, mimeType?: string) => {
    try {
      setUpdateStep('processing');
      // Usamos los drafts actuales (lo que está en pantalla) como base para Gemini
      const inventarioLimpio = drafts.map(d => {
        const { aiUpdated, ...rest } = d; // Quitamos marcas previas
        return rest;
      });

      let updatedDrafts;
      if (type === 'audio') {
        const formData = new FormData();
        formData.append('audioBase64', content);
        formData.append('mimeType', mimeType || '');
        formData.append('inventarioActual', JSON.stringify(inventarioLimpio));
        formData.append('productosMaestros', JSON.stringify(productosMaestro));
        updatedDrafts = await processCaseraAudioForm(formData);
      } else {
        updatedDrafts = await processCaseraInput(type, content, mimeType || null, inventarioLimpio, productosMaestro);
      }

      // Aplicar los borradores procesados a la UI
      setDrafts(updatedDrafts);
      setUpdateStep('manual');
      showToast("¡Inventario actualizado por Gemini!", "success");
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Error procesando el audio/texto", "error");
      setUpdateStep('manual');
    }
  };

  // === Acciones del Editor ===
  const updateDraftField = (draftId: string, field: string, value: any) => {
    setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, [field]: value, aiUpdated: false } : d));
  };

  const removeDraft = (draftId: string) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  const addNewEmptyDraft = () => {
    setDrafts(prev => [...prev, {
      id: `new_${Date.now()}`, isNew: true, producto: '', precio: '', unidad: 'unidad', disponible: true, icono: '📦'
    }]);
  };

  const confirmAndSaveDrafts = async () => {
    setLoading(true);
    const isAhijada = ahijada && updateTarget?.id === ahijada.id;
    
    // Check for custom products that AI or User created
    const processedDrafts = await Promise.all(drafts.map(async (d) => {
      if (!d.producto_id && d.producto) {
        // AI created a new custom product! (or user typed it manually)
        const newProduct = await createProductoMaestro(
          d.producto, 
          d.categoria || 'Nuevos', 
          d.icono || '✨'
        );
        if (newProduct) {
          // Add to local maestro list so UI updates
          setProductosMaestro(prev => [...prev, newProduct]);
          return { ...d, producto_id: newProduct.id, icono: newProduct.icono };
        }
      }
      return d;
    }));

    const validUnits = ['libra', 'cuartilla', 'arroba', 'cuarta', 'amarro', 'kilo', 'unidad', 'docena', 'carga', 'litro'];

    const finalData = processedDrafts.map(d => {
      const { aiUpdated, isNew, ...rest } = d;
      const sanitizedUnidad = validUnits.includes(rest.unidad?.toLowerCase()) ? rest.unidad.toLowerCase() : 'unidad';
      return { ...rest, unidad: sanitizedUnidad, precio: Number(rest.precio), tendencia: rest.tendencia || 'estable' };
    }).filter(d => d.producto_id && d.precio);

    if (isAhijada) {
      await updateInventario(ahijada.id, finalData);
      setAhijada((prev: any) => ({ ...prev, inventario: finalData }));
      showToast(`¡Puesto de ${ahijada.nombre} actualizado! +15 pts`, 'success');
      setActiveTab('inventario_ahijada');
    } else {
      await updateInventario(miPerfil.id, finalData);
      setInventario(finalData);
      showToast("¡Tu inventario ha sido guardado!", 'success');
      setActiveTab('inventario');
    }
    setLoading(false);
  };

  // === Acciones de Solidaridad ===
  const handleRequestApadrinar = () => {
    setShowApadrinarModal(false);
    showToast("¡Solicitud enviada! Un funcionario de la Alcaldía pasará por su puesto pronto.", "success");
  };

  if (!auth.isAuthenticated || !auth.perfil || loading) return <div className="p-8 font-bold text-[var(--texto-suave)] text-center mt-10">Cargando perfil...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: organicMarketStyles }} />
      <ToastNotificacion toast={toast} />

      <div className="flex-1 flex flex-col relative overflow-hidden h-screen">
        {activeTab === 'home' && (
          <CaseraHome 
            miPerfil={miPerfil} 
            comentarios={comentarios}
            onEditarPuesto={() => setActiveTab('editor')}
            onNavigateToSolidaria={() => setActiveTab('madrina')}
          />
        )}

        {activeTab === 'inventario' && (
          <CaseraInventario
            vendor={miPerfil}
            isAhijada={false}
            listado={inventario}
            onAbrirEditor={abrirEditor}
            onToggleDisponibilidad={toggleDisponibilidad}
          />
        )}

        {activeTab === 'inventario_ahijada' && (
          <CaseraInventario
            vendor={ahijada}
            isAhijada={true}
            listado={ahijada.inventario}
            onAbrirEditor={abrirEditor}
            onToggleDisponibilidad={toggleDisponibilidad}
          />
        )}

        {activeTab === 'solidaria' && (
          ahijada ? (
            <MadrinaView
              ahijada={ahijada}
              showApadrinarModal={showApadrinarModal}
              onNavigateToAhijada={() => setActiveTab('inventario_ahijada')}
              onSetShowApadrinarModal={setShowApadrinarModal}
              onRequestApadrinar={handleRequestApadrinar}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-3xl border border-[var(--borde)] shadow-sm">
              <div className="w-16 h-16 bg-[var(--rojo-claro)] rounded-full flex items-center justify-center text-3xl mb-4">❤️</div>
              <h3 className="font-display font-bold text-lg text-[var(--texto-fuerte)] mb-2">Aún no eres Madrina</h3>
              <p className="text-sm text-[var(--texto-suave)] mb-6">Apadrina a una casera vecina para ayudarla con la tecnología y obtén rebajas en tus patentes del GAMLP.</p>
              <button className="bg-[var(--rojo-carmesi)] text-white font-bold py-3 px-6 rounded-xl w-full shadow-md">
                Solicitar Apadrinamiento
              </button>
            </div>
          )
        )}

        {activeTab === 'comunidad' && (
          <AlertasCasera
            alertas={alertas}
            onResolverAlerta={resolverAlerta}
          />
        )}

        {activeTab === 'editor' && (
          <CaseraEditor
            updateTarget={updateTarget}
            ahijada={ahijada}
            productosMaestro={productosMaestro}
            updateStep={updateStep}
            drafts={drafts}
            inputText={inputText}
            isDictating={isDictating}
            onBack={setActiveTab}
            onSetUpdateStep={setUpdateStep}
            onSetInputText={setInputText}
            onSimulateDictation={toggleDictation}
            onProcessInputWithAI={handleProcessInput}
            onUpdateDraftField={updateDraftField}
            onRemoveDraft={removeDraft}
            onAddNewEmptyDraft={addNewEmptyDraft}
            onConfirmAndSaveDrafts={confirmAndSaveDrafts}
          />
        )}
      </div>

      {/* Navegación Inferior */}
      {activeTab !== 'editor' && (
        <BottomNavCasera
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertCount={alertas.length}
        />
      )}
    </>
  );
}
