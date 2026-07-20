'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Map as MapIcon, Users, ListTodo } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { useCart } from '@/shared/context/CartContext';
import { useToast } from '@/shared/context/ToastContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { isLoggedIn, setShowLoginModal } = useAuth();
  const { cart } = useCart();
  const { showToast } = useToast();

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    } else {
      showToast("Perfil ciudadano activo", "success");
    }
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio', id: 'home' },
    { href: '/catalogo', icon: Search, label: 'Catálogo', id: 'catalogo' },
    { href: '/mapa', icon: MapIcon, label: 'Red', id: 'mapa' },
    { href: '#', icon: Users, label: 'Perfil', id: 'perfil', onClick: handleProfileClick }
  ];

  return (
    <>
      {/* Boton Flotante Comunidad (Ruta Inteligente) - Elevado para no tapar el nav */}
      <Link href="/lista" className="fixed bottom-[100px] right-4 md:right-8 z-50 bg-[var(--rojo-carmesi)] text-[var(--bg-tarjeta)] p-4 rounded-full shadow-2xl border-2 border-[var(--rojo-claro)] flex items-center justify-center font-bold hover:scale-105 transition-transform" style={{animation: 'fadeUp 0.3s ease-out 0.2s both'}}>
        <ListTodo size={24} className="md:mr-2"/>
        <span className="text-xs hidden md:inline">Ruta Inteligente</span>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[var(--dorado-gamlp)] text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] shadow-sm border-2 border-[var(--bg-tarjeta)]">
            {cart.length}
          </span>
        )}
      </Link>

      {/* Navegación Inferior Estilo Casera (Píldora Flotante) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-[var(--borde)] rounded-[2rem] flex justify-between items-center px-3 py-2 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-[90%] max-w-[340px]">
        {navItems.map(tab => {
          const isActive = pathname === tab.href || (tab.id === 'perfil' && isLoggedIn);
          
          return (
            <Link 
              key={tab.id}
              href={tab.href}
              onClick={tab.onClick}
              className={`flex flex-col items-center justify-center h-14 w-[70px] rounded-2xl transition-all duration-300 relative
                ${isActive ? 'bg-[var(--bg-maiz)] text-[var(--rojo-carmesi)] shadow-inner' : 'text-[var(--texto-suave)] hover:bg-gray-50'}
              `}
            >
              <div className="relative">
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              </div>
              {isActive && <span className="text-[9px] font-bold mt-1 tracking-wide">{tab.label}</span>}
            </Link>
          )
        })}
      </div>
    </>
  );
}
