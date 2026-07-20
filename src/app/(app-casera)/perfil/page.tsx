'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useRouter } from 'next/navigation';

// === Módulos de Datos (Dev Backend) ===
import { getInventario, updateInventario } from '@/modules/inventario/repository';
import { getAlertasIniciales, type AlertaWaze } from '@/modules/compras/waze-alerts';

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

// Mock de ahijada — TODO: Mover a repository.ts con Supabase
const ahijadaInicial = {
  id: 'a1',
  nombre: 'Doña Rosita',
  puesto: 'N° 14 - Lácteos',
  especialidad: 'Quesos y Lácteos',
  inventario: [
    { id: 'ainv1', producto: 'Queso Criollo', icono: '🧀', precio: 15.00, unidad: 'kilo', disponible: true },
    { id: 'ainv2', producto: 'Leche Fresca', icono: '🥛', precio: 6.00, unidad: 'litro', disponible: true },
  ]
};

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
  const { auth } = useAuth();
  const router = useRouter();

  // === Estado de Navegación ===
  const [activeTab, setActiveTab] = useState('home');

  // === Estado de Datos (Repositorios) ===
  const [inventario, setInventario] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<AlertaWaze[]>(getAlertasIniciales());
  const [ahijada, setAhijada] = useState(ahijadaInicial);
  const [loading, setLoading] = useState(true);

  // === Estado del Editor (Módulo IA-Voice) ===
  const [updateStep, setUpdateStep] = useState('manual');
  const [updateTarget, setUpdateTarget] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  // === Estado de UI Compartido ===
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });
  const [showApadrinarModal, setShowApadrinarModal] = useState(false);

  // === Autenticación ===
  useEffect(() => {
    if (!auth.isAuthenticated || auth.userType !== 'casera') {
      router.push('/login');
      return;
    }
    if (auth.perfil) {
      getInventario(auth.perfil.id).then(data => {
        setInventario(data);
        setLoading(false);
      });
    }
  }, [auth, router]);

  const miPerfil = auth.perfil || {
    id: 'USR-MARIA-45', nombre: 'Doña María', puesto: 'N° 45 - Sector Verduras',
    mercado: 'Mercado Rodríguez', calificacion: 4.9, es_madrina: true, progreso_patente: 85
  };

  // === Acciones de UI ===
  const showToast = (msg: string, type = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
  };

  // === Acciones de Inventario (Dev Backend) ===
  const abrirEditor = (vendor: any) => {
    setUpdateTarget(vendor);
    const listadoActual = vendor.id === ahijada.id ? ahijada.inventario : inventario;
    setDrafts(JSON.parse(JSON.stringify(listadoActual)));
    setUpdateStep('manual');
    setActiveTab('editor');
    setInputText('');
  };

  const toggleDisponibilidad = (id: string, isAhijada = false) => {
    if (isAhijada) {
      setAhijada(prev => ({ ...prev, inventario: prev.inventario.map(item => item.id === id ? { ...item, disponible: !item.disponible } : item) }));
      showToast("Actualizado para Doña Rosita", "success");
    } else {
      setInventario(prev => prev.map(item => item.id === id ? { ...item, disponible: !item.disponible } : item));
      showToast("Disponibilidad actualizada", "success");
    }
  };

  // === Acciones de Alertas (Dev Fullstack) ===
  const resolverAlerta = (alertaId: string, accion: string, productoId: string | null = null) => {
    if (accion === 'confirmar_agotado' && productoId) {
      setInventario(prev => prev.map(i => i.id === productoId ? { ...i, disponible: false } : i));
      showToast("Producto marcado como Agotado.", "success");
    } else {
      showToast("Alerta descartada. Tu reputación está protegida.", "info");
    }
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
  };

  // === Acciones de IA / Dictado (Dev IA) ===
  const simulateDictation = () => {
    setIsDictating(true);
    setInputText('');
    let text = "Hola chukuta, me llegó tomate perita a 4 pesos la cuarta, la arroba de papa imilla bajó a 50 bolivianos. El choclo ya se me acabó, y me llegó cebolla nueva a 10 la cuartilla.";
    let current = 0;
    const interval = setInterval(() => {
      setInputText(text.slice(0, current));
      current += 3;
      if (current > text.length) {
        clearInterval(interval);
        setIsDictating(false);
      }
    }, 40);
  };

  const processInputWithAI = () => {
    if (!inputText.trim()) return;
    setUpdateStep('processing');

    // TODO: Reemplazar con Server Action real → processVoiceInputAction(inputText)
    setTimeout(() => {
      setDrafts(prev => {
        let newDrafts = [...prev];
        let t = newDrafts.find(d => d.id === 'inv2');
        if (t) { t.precio = 4.00; t.aiUpdated = true; }
        let p = newDrafts.find(d => d.id === 'inv1');
        if (p) { p.precio = 50.00; p.aiUpdated = true; }
        let c = newDrafts.find(d => d.id === 'inv3');
        if (c) { c.disponible = false; c.aiUpdated = true; }
        newDrafts.unshift({
          id: `new_${Date.now()}`, isNew: true, aiUpdated: true,
          producto: 'Cebolla Nueva', precio: 10.00, unidad: 'cuartilla', disponible: true, icono: '🧅'
        });
        return newDrafts;
      });
      setUpdateStep('manual');
    }, 2500);
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
    const isAhijada = updateTarget?.id === ahijada.id;
    const finalData = drafts.map(d => {
      const { aiUpdated, isNew, ...rest } = d;
      return { ...rest, precio: Number(rest.precio), tendencia: rest.tendencia || 'estable' };
    }).filter(d => d.producto && d.precio);

    if (isAhijada) {
      setAhijada(prev => ({ ...prev, inventario: finalData }));
      showToast(`¡Puesto de ${ahijada.nombre} actualizado! +15 pts`, 'success');
      setActiveTab('inventario_ahijada');
    } else {
      await updateInventario(miPerfil.id, finalData);
      setInventario(finalData);
      showToast("¡Tu inventario ha sido guardado!", 'success');
      setActiveTab('inventario');
    }
  };

  // === Acciones de Solidaridad ===
  const handleRequestApadrinar = () => {
    setShowApadrinarModal(false);
    showToast("¡Solicitud enviada! Un funcionario de la Alcaldía pasará por su puesto pronto.", "success");
  };

  // === Guard de Auth ===
  if (!auth.isAuthenticated || !auth.perfil) return <div className="p-8">Cargando...</div>;

  // === RENDER: Solo orquestación, 0 lógica visual ===
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: organicMarketStyles }} />
      <ToastNotificacion toast={toast} />

      <div className="flex-1 flex flex-col relative overflow-hidden h-screen">
        {activeTab === 'home' && (
          <CaseraHome
            miPerfil={miPerfil}
            onEditarPuesto={() => abrirEditor(miPerfil)}
            onNavigateToSolidaria={() => setActiveTab('solidaria')}
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
          <MadrinaView
            ahijada={ahijada}
            showApadrinarModal={showApadrinarModal}
            onNavigateToAhijada={() => setActiveTab('inventario_ahijada')}
            onSetShowApadrinarModal={setShowApadrinarModal}
            onRequestApadrinar={handleRequestApadrinar}
          />
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
            updateStep={updateStep}
            drafts={drafts}
            inputText={inputText}
            isDictating={isDictating}
            onBack={setActiveTab}
            onSetUpdateStep={setUpdateStep}
            onSetInputText={setInputText}
            onSimulateDictation={simulateDictation}
            onProcessInputWithAI={processInputWithAI}
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
