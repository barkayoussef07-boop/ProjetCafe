// src/context/CartContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantite?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantite: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantite: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantite: item.quantite + quantite } : item
        );
      }
      return [...prev, { product, quantite }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantite: number) => {
    if (quantite <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantite } : item))
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.prix * item.quantite, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit etre utilise a l\'interieur de CartProvider');
  }
  return context;
}
