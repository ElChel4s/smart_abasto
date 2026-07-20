'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    perfil: null,
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = (perfil: any, type: 'casera' | 'ciudadano') => {
    setAuth({ isAuthenticated: true, userType: type, perfil });
    setShowLoginModal(false);
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, userType: null, perfil: null });
  };

  const setIsLoggedIn = (v: boolean) => {
    if (v) {
      setAuth(prev => ({ ...prev, isAuthenticated: true }));
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoggedIn: auth.isAuthenticated, setShowLoginModal, showLoginModal, setIsLoggedIn }}>
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
