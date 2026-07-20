'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type ToastInfo = {
  show: boolean;
  msg: string;
  type: 'info' | 'success' | 'warning';
};

type ToastContextType = {
  toast: ToastInfo;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastInfo>({ show: false, msg: '', type: 'info' });

  const showToast = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
