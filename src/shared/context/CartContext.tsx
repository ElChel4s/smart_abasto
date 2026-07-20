'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
  id: string;
  [key: string]: any;
};

type CartContextType = {
  cart: CartItem[];
  comprasHechas: string[];
  toggleCart: (invItem: CartItem, showToast?: (msg: string, type: string) => void) => void;
  reemplazarProducto: (oldInvId: string, newInvItem: CartItem, showToast?: (msg: string, type: string) => void) => void;
  toggleCompraHecha: (invId: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [comprasHechas, setComprasHechas] = useState<string[]>([]);

  const toggleCart = (invItem: CartItem, showToast?: (msg: string, type: string) => void) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === invItem.id);
      if (exists) {
        if (showToast) showToast("Removido de tu lista de compras", "info");
        return prev.filter(item => item.id !== invItem.id);
      }
      if (showToast) showToast("Agregado a tu lista de compras", "success");
      return [...prev, invItem];
    });
  };

  const reemplazarProducto = (oldInvId: string, newInvItem: CartItem, showToast?: (msg: string, type: string) => void) => {
    setCart(prev => {
      const filtered = prev.filter(item => item.id !== oldInvId);
      if (showToast) showToast("Lista recalculada con éxito", "success");
      return [...filtered, newInvItem];
    });
  };

  const toggleCompraHecha = (invId: string) => {
    setComprasHechas(prev => 
      prev.includes(invId) ? prev.filter(id => id !== invId) : [...prev, invId]
    );
  };

  return (
    <CartContext.Provider value={{ cart, comprasHechas, toggleCart, reemplazarProducto, toggleCompraHecha }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
