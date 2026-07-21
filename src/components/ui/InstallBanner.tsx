'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { X, Share, PlusSquare, Download } from 'lucide-react';

/**
 * Banner que se muestra cuando el usuario llega con ?install=1 desde la landing.
 * Le indica cómo añadir la app a la pantalla de inicio según su plataforma.
 */
export default function InstallBanner() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const hasInstallParam = searchParams.get('install') === '1';
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;

    setIsIOS(ios);
    setIsStandalone(standalone);

    // Mostrar si viene de la landing con ?install=1 y no está ya instalada
    if (hasInstallParam && !standalone) {
      setShow(true);
    }
  }, [searchParams]);

  if (!show || isStandalone) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] animate-slideDown">
      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-[#2D2422] to-[#3D3432] text-white p-5 shadow-2xl border border-white/10 relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors p-1"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
            <Download size={24} className="text-white" />
          </div>
          <div className="flex-1 pr-4">
            <h3 className="font-bold text-base mb-1">Instalar esta App</h3>

            {isIOS ? (
              <div className="space-y-2">
                <p className="text-white/70 text-xs leading-relaxed">
                  Para instalar en tu iPhone/iPad:
                </p>
                <ol className="text-xs text-white/80 space-y-1.5 list-none">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                    Toca el botón <Share size={14} className="inline text-blue-400 mx-0.5" /> <strong>Compartir</strong> en Safari
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                    Selecciona <PlusSquare size={14} className="inline text-gray-300 mx-0.5" /> <strong>&quot;Agregar a Inicio&quot;</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                    ¡Listo! Se instala como app nativa 🎉
                  </li>
                </ol>
              </div>
            ) : (
              <p className="text-white/70 text-xs leading-relaxed">
                Tu navegador debería mostrarte una opción para instalar esta app.
                Si no aparece, busca el menú <strong>⋮</strong> → <strong>&quot;Instalar aplicación&quot;</strong>.
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
