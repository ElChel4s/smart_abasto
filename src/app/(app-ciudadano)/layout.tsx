'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/shared/context/AuthContext';
import { ToastProvider } from '@/shared/context/ToastContext';
import { CartProvider } from '@/shared/context/CartContext';
import ToastNotificacion from '@/components/ui/Toast';
import LoginModal from '@/components/ui/LoginModal';
import NameSetupModal from '@/components/ui/NameSetupModal';
import BottomNav from '@/components/ui/BottomNav';
import { organicMarketStyles } from '@/components/ui/organicMarketStyles';

export default function CiudadanoLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <style dangerouslySetInnerHTML={{ __html: organicMarketStyles }} />
          <div className="flex flex-col min-h-screen w-full max-w-[430px] mx-auto bg-[var(--bg-maiz)] relative shadow-2xl font-sans">
            {children}
            <BottomNav />
            <ToastNotificacion />
            <LoginModal />
            <NameSetupModal />
          </div>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
