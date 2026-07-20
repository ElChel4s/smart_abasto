'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/shared/lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  userType: 'casera' | 'ciudadano' | null;
  perfil: any | null; // Tipar mejor luego con los perfiles reales
}

interface AuthContextProps {
  auth: AuthState;
  login: (perfil: any, type: 'casera' | 'ciudadano') => void;
  logout: () => void;
  isLoggedIn: boolean;
  setShowLoginModal: (show: boolean) => void;
  showLoginModal: boolean;
  setIsLoggedIn: (v: boolean) => void;
  showNameSetupModal: boolean;
  setShowNameSetupModal: (show: boolean) => void;
  updateProfileName: (name: string) => Promise<boolean>;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    perfil: null,
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNameSetupModal, setShowNameSetupModal] = useState(false);

  // Sync with Supabase Auth
  React.useEffect(() => {
    // Check initial session
    const syncAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const metadata = session.user.user_metadata;
        const hasCustomName = metadata.nombre_personalizado === true;
        setAuth({
          isAuthenticated: true,
          userType: (metadata.rol || 'ciudadano') as 'casera' | 'ciudadano',
          perfil: {
            id: session.user.id,
            nombre: metadata.nombre_completo || session.user.email?.split('@')[0] || 'Ciudadano',
            email: session.user.email,
            nombre_personalizado: hasCustomName
          }
        });
        if (!hasCustomName && (metadata.rol || 'ciudadano') === 'ciudadano') {
          setShowNameSetupModal(true);
        }
      } else {
        // Mock fallback for hackathon refresh persistence
        const stored = localStorage.getItem('hackathon_auth');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setAuth(parsed);
          } catch(e) {}
        }
      }
      setIsInitializing(false);
    };
    syncAuth();

    // Listen for changes (OAuth redirect, signout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const metadata = session.user.user_metadata;
        const hasCustomName = metadata.nombre_personalizado === true;
        setAuth({
          isAuthenticated: true,
          userType: (metadata.rol || 'ciudadano') as 'casera' | 'ciudadano',
          perfil: {
            id: session.user.id,
            nombre: metadata.nombre_completo || session.user.email?.split('@')[0] || 'Ciudadano',
            email: session.user.email,
            nombre_personalizado: hasCustomName
          }
        });
        if (!hasCustomName && (metadata.rol || 'ciudadano') === 'ciudadano' && event === 'SIGNED_IN') {
          setShowNameSetupModal(true);
        }
      } else {
        setAuth({
          isAuthenticated: false,
          userType: null,
          perfil: null
        });
        setShowNameSetupModal(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (perfil: any, type: 'casera' | 'ciudadano') => {
    const newAuth = { isAuthenticated: true, userType: type, perfil };
    setAuth(newAuth);
    localStorage.setItem('hackathon_auth', JSON.stringify(newAuth));
    setShowLoginModal(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuth({ isAuthenticated: false, userType: null, perfil: null });
    localStorage.removeItem('hackathon_auth');
    setShowNameSetupModal(false);
  };

  const updateProfileName = async (newName: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // 1. Update Supabase user metadata
        const { error: authError } = await supabase.auth.updateUser({
          data: { 
            nombre_completo: newName,
            nombre_personalizado: true 
          }
        });
        if (authError) throw authError;

        // 2. Update public perfiles table
        const { error: dbError } = await supabase
          .from('perfiles')
          .update({ nombre_completo: newName })
          .eq('id', auth.perfil?.id);
        
        // We don't throw dbError to avoid crashing if table structure is still raw
        if (dbError) console.warn("Supabase database update failed:", dbError.message);
      } else {
        console.warn("No Supabase auth session found. Running in DEMO mode, skipping DB update.");
      }

      // 3. Update local state
      setAuth(prev => {
        if (!prev.perfil) return prev;
        const newAuth = {
          ...prev,
          perfil: {
            ...prev.perfil,
            nombre: newName,
            nombre_personalizado: true
          }
        };
        localStorage.setItem('hackathon_auth', JSON.stringify(newAuth));
        return newAuth;
      });
      setShowNameSetupModal(false);
      return true;
    } catch (err: any) {
      console.error("Error setting custom name:", err.message);
      return false;
    }
  };

  const setIsLoggedIn = (v: boolean) => {
    if (v) {
      const newAuth = { 
        isAuthenticated: true, 
        userType: 'ciudadano' as 'ciudadano' | 'casera', 
        perfil: { id: '20000000-0000-0000-0000-000000000001', nombre: 'Marcelo Testigo', nombre_personalizado: false } 
      };
      setAuth(newAuth);
      localStorage.setItem('hackathon_auth', JSON.stringify(newAuth));
      setShowNameSetupModal(true); // Trigger name setup for mock ciudadano too
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      auth, login, logout, isLoggedIn: auth.isAuthenticated, 
      setShowLoginModal, showLoginModal, setIsLoggedIn,
      showNameSetupModal, setShowNameSetupModal, updateProfileName,
      isInitializing
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
