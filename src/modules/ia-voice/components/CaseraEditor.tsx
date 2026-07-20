'use client';

import React from 'react';
import { 
  Plus, Trash2, ArrowLeft, ClipboardList, Mic2,
  Mic, ListChecks, FileSearch, Check, ClipboardCheck
} from 'lucide-react';

interface CaseraEditorProps {
  updateTarget: any;
  ahijada: any;
  updateStep: string;
  drafts: any[];
  inputText: string;
  isDictating: boolean;
  onBack: (tab: string) => void;
  onSetUpdateStep: (step: string) => void;
  onSetInputText: (text: string) => void;
  onSimulateDictation: () => void;
  onProcessInputWithAI: () => void;
  onUpdateDraftField: (id: string, field: string, value: any) => void;
  onRemoveDraft: (id: string) => void;
  onAddNewEmptyDraft: () => void;
  onConfirmAndSaveDrafts: () => void;
}

export default function CaseraEditor({
  updateTarget, ahijada, updateStep, drafts, inputText, isDictating,
  onBack, onSetUpdateStep, onSetInputText, onSimulateDictation,
  onProcessInputWithAI, onUpdateDraftField, onRemoveDraft,
  onAddNewEmptyDraft, onConfirmAndSaveDrafts
}: CaseraEditorProps) {
  const isAhijada = updateTarget?.id === ahijada.id;

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-maiz)] overflow-hidden z-[100] relative anim-stagger">
      
      {/* Cabecera del Editor */}
      <div className="px-6 pt-12 pb-4 shrink-0 bg-[var(--bg-maiz)]/95 backdrop-blur-md border-b border-[var(--dorado-gamlp)]/20 pattern-rafia shadow-sm flex items-center gap-4">
        <button 
          onClick={() => onBack(isAhijada ? 'inventario_ahijada' : 'inventario')} 
          className="w-10 h-10 bg-white border border-[var(--borde)] rounded-full flex items-center justify-center text-gray-600 hover:text-[var(--rojo-carmesi)] shadow-sm active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl text-[var(--texto-fuerte)] font-bold">Editar Puesto</h1>
          <p className="text-[11px] text-[var(--texto-suave)] font-medium">
            {isAhijada ? `Acomodando mercadería de ${ahijada.nombre}` : 'Agrega o modifica tu mercadería'}
          </p>
        </div>
      </div>

      {/* CONTENIDO DEL EDITOR */}
      <div className="flex-1 overflow-y-auto hide-scroll pb-28 relative">
        
        {/* MODO 1: EDICIÓN MANUAL Y LISTA */}
        {updateStep === 'manual' && (
          <div className="p-6 pt-6 anim-stagger">
            
            {/* Sección Ayuda con IA */}
            <div 
              onClick={() => onSetUpdateStep('ai_input')}
              className="bg-gradient-to-r from-[var(--dorado-gamlp)] to-[#9B7A1C] p-5 rounded-2xl shadow-lg mb-8 flex items-center justify-between cursor-pointer hover:shadow-xl active:scale-95 transition-all group"
            >
              <div>
                <h3 className="font-display text-white font-bold text-lg flex items-center gap-2">
                  <ClipboardList size={20} className="text-[#FFF5D1]" /> 
                  Dictar mi Lista
                </h3>
                <p className="text-white/80 text-[11px] font-medium mt-1">
                  Díctame qué cambió hoy y yo lo anoto.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <Mic2 size={22} className="text-white"/>
              </div>
            </div>

            <h3 className="text-[11px] font-bold text-[var(--texto-suave)] uppercase tracking-widest mb-4 flex items-center justify-between">
              Tu Inventario Actual
              <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[9px]">Edita lo que necesites</span>
            </h3>

            {/* Lista Manual de Borradores */}
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div key={draft.id} className={`bg-white border-2 p-4 rounded-[1.5rem] shadow-sm relative transition-colors ${draft.aiUpdated ? 'border-[var(--dorado-gamlp)] bg-[var(--dorado-claro)]/30' : 'border-[var(--borde)]'}`}>
                  
                  {draft.aiUpdated && (
                    <span className="absolute -top-3 right-4 bg-gradient-to-r from-[var(--dorado-gamlp)] to-[#9B7A1C] text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <ClipboardCheck size={10}/> LISTA ACTUALIZADA
                    </span>
                  )}
                  
                  <div className="flex gap-4 mb-4">
                    <div className="w-14 h-14 bg-[var(--bg-maiz)] rounded-2xl flex items-center justify-center text-3xl border border-[var(--borde)] shadow-inner">
                      {draft.icono}
                    </div>
                    <div className="flex-1 pt-1">
                      <input 
                        type="text" 
                        value={draft.producto} 
                        onChange={(e) => onUpdateDraftField(draft.id, 'producto', e.target.value)}
                        placeholder="Ej: Tomate Perita"
                        className="font-display font-bold text-lg text-[var(--texto-fuerte)] w-full input-editable p-1 rounded-md"
                      />
                      <div className="text-[10px] font-bold text-[var(--texto-suave)] uppercase tracking-widest mt-1 ml-1">Producto</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-[var(--bg-maiz)] p-3 rounded-xl border border-[var(--borde)]/50 mb-3">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-[var(--rojo-carmesi)]">Bs.</span>
                        <input 
                          type="number" 
                          value={draft.precio} 
                          onChange={(e) => onUpdateDraftField(draft.id, 'precio', e.target.value)}
                          placeholder="0.00"
                          className="w-full font-bold text-lg text-[var(--rojo-carmesi)] input-editable p-1 rounded-md"
                        />
                      </div>
                      <div className="text-[9px] font-bold text-[var(--texto-suave)] uppercase tracking-widest mt-1 ml-1">Precio</div>
                    </div>
                    <div>
                      <select 
                        value={draft.unidad} 
                        onChange={(e) => onUpdateDraftField(draft.id, 'unidad', e.target.value)}
                        className="w-full font-bold text-sm text-[var(--texto-fuerte)] input-editable p-1.5 rounded-md cursor-pointer mt-0.5"
                      >
                        <option value="unidad">Por Unidad</option>
                        <option value="cuarta">Por Cuarta</option>
                        <option value="cuartilla">Por Cuartilla</option>
                        <option value="arroba">Por Arroba</option>
                        <option value="docena">Por Docena</option>
                        <option value="kilo">Por Kilo</option>
                        <option value="litro">Por Litro</option>
                        <option value="amarro">Por Amarro</option>
                      </select>
                      <div className="text-[9px] font-bold text-[var(--texto-suave)] uppercase tracking-widest mt-1 ml-1">Medida</div>
                    </div>
                  </div>

                  {/* Controles de Disponibilidad y Eliminar */}
                  <div className="flex justify-between items-center px-1">
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[var(--borde)] hover:bg-gray-50 transition-colors shadow-sm">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={draft.disponible} onChange={(e) => onUpdateDraftField(draft.id, 'disponible', e.target.checked)} />
                        <div className={`block w-9 h-5 rounded-full transition-colors ${draft.disponible ? 'bg-[var(--verde-palta)]' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform ${draft.disponible ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className={`text-[11px] font-bold uppercase ${draft.disponible ? 'text-[var(--verde-palta)]' : 'text-gray-500'}`}>
                        {draft.disponible ? 'En Stock' : 'Agotado'}
                      </span>
                    </label>

                    <button onClick={() => onRemoveDraft(draft.id)} className="text-gray-400 hover:text-[var(--rojo-carmesi)] hover:bg-[var(--rojo-claro)] p-2.5 rounded-xl transition-colors">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onAddNewEmptyDraft}
              className="w-full py-4 mt-6 border-2 border-dashed border-[var(--borde)] text-[var(--texto-suave)] rounded-[1.5rem] font-bold flex flex-col items-center justify-center gap-1 hover:border-[var(--verde-palta)] hover:text-[var(--verde-palta)] transition-colors bg-white/50"
            >
              <Plus size={20} /> 
              <span className="text-sm">Agregar producto manualmente</span>
            </button>
          </div>
        )}

        {/* MODO 2: INPUT DE IA (DICTADO) */}
        {updateStep === 'ai_input' && (
          <div className="flex flex-col h-full anim-stagger px-6 pt-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-[var(--dorado-gamlp)] to-[#9B7A1C] rounded-full flex items-center justify-center mb-4 shadow-lg">
                 <ClipboardList size={32} className="text-white" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[var(--texto-fuerte)] leading-tight">Díctame o escribe<br/>tus cambios</h3>
              <p className="text-sm text-[var(--texto-suave)] mt-3 leading-relaxed">
                Yo leeré tu mensaje y actualizaré tu lista automáticamente, igualito a tu cuaderno.
              </p>
            </div>

            <div className="relative mb-6 group">
              <div className={`absolute -inset-1 rounded-3xl blur transition duration-1000 opacity-20 group-hover:opacity-40 ${isDictating ? 'bg-[var(--dorado-gamlp)] opacity-60' : 'bg-gray-300'}`}></div>
              <div className="relative bg-white border-2 border-[var(--borde)] focus-within:border-[var(--dorado-gamlp)] rounded-3xl p-1 shadow-sm transition-all duration-300 flex flex-col">
                <textarea 
                  className="w-full bg-transparent p-5 text-[var(--texto-fuerte)] text-base font-medium focus:outline-none resize-none h-40 placeholder:text-gray-300"
                  placeholder="Ej: El tomate bajó a 4 bolivianos, la papa está a 50..."
                  value={inputText}
                  onChange={(e) => onSetInputText(e.target.value)}
                />
                
                <div className="flex justify-between items-center p-3 pt-0 border-t border-gray-50 mt-2">
                  <span className="text-[10px] text-[var(--texto-suave)] font-bold uppercase tracking-wider pl-2 flex items-center gap-1">
                    {isDictating ? <span className="flex items-center gap-1 text-[var(--dorado-gamlp)]"><span className="w-2 h-2 rounded-full bg-[var(--dorado-gamlp)] animate-pulse"></span> Escuchando...</span> : 'Escribe o Dicta'}
                  </span>
                  <button 
                    onClick={onSimulateDictation}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 active:scale-95 ${isDictating ? 'bg-gradient-to-r from-[var(--dorado-gamlp)] to-[#9B7A1C] text-white mic-listening' : 'bg-gray-100 text-gray-500 hover:bg-[var(--dorado-claro)] hover:text-[var(--dorado-gamlp)]'}`}
                  >
                    <Mic size={24} className={isDictating ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => onSetUpdateStep('manual')}
                className="w-1/3 py-4 bg-white text-[var(--texto-suave)] rounded-2xl font-bold border border-[var(--borde)] shadow-sm active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button 
                onClick={onProcessInputWithAI}
                disabled={!inputText.trim()}
                className="flex-1 py-4 bg-[var(--verde-palta)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none transition-all hover:bg-[#2E7D32] active:scale-95"
              >
                <ListChecks size={20} className={inputText.trim() ? "animate-pulse" : ""}/> 
                Acomodar Lista
              </button>
            </div>
          </div>
        )}

        {/* MODO 3: PROCESANDO */}
        {updateStep === 'processing' && (
          <div className="flex flex-col h-full items-center justify-center text-center -mt-10 px-6">
            <div className="relative mb-8">
              <div className="w-28 h-28 bg-white border border-[var(--borde)] rounded-3xl flex items-center justify-center shadow-xl relative z-10 overflow-hidden">
                <ClipboardList size={48} className="text-gray-300" />
                <div className="absolute inset-0">
                   <div className="w-full h-1 bg-[var(--verde-palta)] shadow-[0_0_15px_rgba(56,142,60,0.8)] absolute animate-[scan_1.5s_ease-in-out_infinite]"></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[var(--verde-claro)] rounded-full blur-2xl opacity-50 scale-150"></div>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[var(--texto-fuerte)] mb-2">Acomodando Datos</h3>
            <p className="text-sm font-medium text-[var(--texto-suave)] bg-white px-4 py-2 rounded-full border border-[var(--borde)] shadow-sm animate-pulse flex items-center gap-2">
              <FileSearch size={14} className="text-[var(--verde-palta)]"/> Leyendo productos...
            </p>
          </div>
        )}
      </div>

      {/* BARRA INFERIOR (Solo en modo manual para guardar) */}
      {updateStep === 'manual' && (
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-md border-t border-[var(--borde)] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20">
          <button 
            onClick={onConfirmAndSaveDrafts} 
            className="w-full py-4 bg-[var(--texto-fuerte)] text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-black"
          >
            <Check size={20}/> Guardar Cambios en mi Puesto
          </button>
        </div>
      )}
    </div>
  );
}
