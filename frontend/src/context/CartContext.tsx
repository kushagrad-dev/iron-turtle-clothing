import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LocalCartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { syncCartAPI, fetchCart, clearCartAPI } from '../services/api';
import toast from 'react-hot-toast';

interface CartContextType {
  items: LocalCartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'iron_turtle_cart';

const loadCartFromStorage = (): LocalCartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: LocalCartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<LocalCartItem[]>(loadCartFromStorage);
  const { user, session } = useAuth();

  // Sync cart with backend when user logs in
  useEffect(() => {
    if (user && session) {
      const syncWithBackend = async () => {
        try {
          const localItems = loadCartFromStorage();
          if (localItems.length > 0) {
            await syncCartAPI(localItems.map(item => ({
              product_id: item.product_id,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
            })));
          }

          // Fetch server cart (merged)
          const serverCart = await fetchCart();
          const mergedItems: LocalCartItem[] = serverCart.map(item => ({
            product_id: item.product_id,
            product: item.product!,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }));

          setItems(mergedItems);
          saveCartToStorage(mergedItems);
        } catch (error) {
          console.error('Cart sync failed:', error);
        }
      };

      syncWithBackend();
    }
  }, [user, session]);

  // Save to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product_id === product.id && item.size === size && item.color === color
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        toast.success(`Updated quantity in cart`);
        return updated;
      }

      toast.success(`${product.name} added to cart`);
      return [...prev, { product_id: product.id, product, size, color, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(
      item => !(item.product_id === productId && item.size === size && item.color === color)
    ));
    toast.success('Removed from cart');
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(item =>
        item.product_id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    if (user) {
      clearCartAPI().catch(console.error);
    }
  }, [user]);

  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
