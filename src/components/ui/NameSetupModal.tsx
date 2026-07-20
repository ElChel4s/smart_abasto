'use client';

import React, { useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useToast } from '@/shared/context/ToastContext';
import { User, Check } from 'lucide-react';

export default function NameSetupModal() {
  const { showNameSetupModal, updateProfileName } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  if (!showNameSetupModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const success = await updateProfileName(name.trim());
    setSaving(false);

    if (success) {
      showToast(`¡Bienvenido/a, ${name.trim()}! Nombre guardado.`, 'success');
    } else {
      showToast('No se pudo guardar tu nombre. Intenta de nuevo.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-md flex items-center justify-center p-6" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="bg-[var(--bg-tarjeta)] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative border border-[var(--borde)] text-center anim-scale-up">
        
        <div className="w-16 h-16 bg-[var(--verde-claro)] text-[var(--verde-palta)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--verde-palta)]/30">
          <User size={32} />
        </div>
        
        <h3 className="font-display text-xl font-bold text-[var(--texto-fuerte)] mb-2">¡Queremos conocerte!</h3>
        <p className="text-xs text-[var(--texto-suave)] mb-6 leading-relaxed">
          Para participar en la red de abastecimiento de La Paz, dinos cómo te llamas. Este nombre aparecerá en tus reportes y reseñas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white border-2 border-[var(--borde)] focus-within:border-[var(--verde-palta)] rounded-xl flex items-center px-3 shadow-inner transition-all">
            <input 
              type="text" 
              placeholder="Ej: Doña Juana, Caserito Alex..." 
              required
              className="w-full bg-transparent border-none outline-none py-3.5 text-sm text-[var(--texto-fuerte)] placeholder:text-gray-300 font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </div>

          <button 
            type="submit" 
            disabled={!name.trim() || saving}
            className="w-full bg-[var(--verde-palta)] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#2E7D32] transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none"
          >
            <Check size={18} />
            {saving ? 'Guardando...' : 'Comenzar a usar la App'}
          </button>
        </form>
      </div>
    </div>
  );
}
