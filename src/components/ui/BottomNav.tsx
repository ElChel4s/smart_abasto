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

  const handleProfileClick = () => {
    if (isLoggedIn) {
      showToast("Perfil ciudadano activo", "success");
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      {/* Boton Flotante Comunidad (Ruta Inteligente) */}
      <Link href="/lista" className="fixed bottom-24 right-4 md:right-8 z-50 bg-[var(--rojo-carmesi)] text-[var(--bg-tarjeta)] p-4 rounded-full shadow-2xl border-2 border-[var(--rojo-claro)] flex items-center justify-center font-bold hover:scale-105 transition-transform" style={{animation: 'fadeUp 0.3s ease-out 0.2s both'}}>
        <ListTodo size={24} className="md:mr-2"/>
        <span className="text-xs hidden md:inline">Ruta Inteligente</span>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[var(--dorado-gamlp)] text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] shadow-sm border-2 border-[var(--bg-tarjeta)]">
            {cart.length}
          </span>
        )}
      </Link>

      {/* Navegación Inferior */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[var(--borde)] px-6 pt-3 pb-5 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:px-12 lg:px-24">
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-[var(--rojo-carmesi)]' : 'text-[var(--texto-suave)] hover:text-[var(--dorado-gamlp)]'}`}>
          <Home size={22} className={pathname === '/' ? 'fill-current' : ''}/>
          <span className="text-[9px] font-bold tracking-wider">Inicio</span>
        </Link>
        <Link href="/catalogo" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/catalogo' ? 'text-[var(--rojo-carmesi)]' : 'text-[var(--texto-suave)] hover:text-[var(--dorado-gamlp)]'}`}>
          <Search size={22} />
          <span className="text-[9px] font-bold tracking-wider">Catálogo</span>
        </Link>
        <Link href="/mapa" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/mapa' ? 'text-[var(--rojo-carmesi)]' : 'text-[var(--texto-suave)] hover:text-[var(--dorado-gamlp)]'}`}>
          <MapIcon size={22} />
          <span className="text-[9px] font-bold tracking-wider">Red</span>
        </Link>
        <button onClick={handleProfileClick} className={`flex flex-col items-center gap-1 transition-colors ${isLoggedIn ? 'text-[var(--verde-palta)]' : 'text-[var(--texto-suave)] hover:text-[var(--dorado-gamlp)]'}`}>
          <Users size={22} className={isLoggedIn ? 'fill-current' : ''}/>
          <span className="text-[9px] font-bold tracking-wider">Perfil</span>
        </button>
      </div>
    </>
  );
}
