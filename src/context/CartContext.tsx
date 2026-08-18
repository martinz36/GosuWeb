'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id?: number | string;
  cartItemId?: string; // Unique key for cart item
  productId?: string | number;
  variantId?: string;
  variantTitle?: string;
  sku?: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
  selectedColor?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number, autoOpenCart?: boolean) => void;
  removeFromCart: (cartItemId: string | number) => void;
  updateQuantity: (cartItemId: string | number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gosu_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('gosu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1, autoOpenCart = true) => {
    const prodId = item.productId || item.id || 'unknown';
    const key = item.cartItemId || `${prodId}-${item.variantId || item.selectedColor || 'default'}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.cartItemId === key || (i.id === item.id && i.selectedColor === item.selectedColor)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = item.stock ?? updated[existingIndex].stock;
        
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: maxStock ? Math.min(newQty, maxStock) : newQty,
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          ...item,
          id: item.id || prodId,
          productId: prodId,
          cartItemId: key,
          quantity,
        },
      ];
    });

    if (autoOpenCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (cartItemId: string | number) => {
    const strKey = cartItemId.toString();
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          item.cartItemId !== strKey &&
          item.id?.toString() !== strKey &&
          item.productId?.toString() !== strKey
      )
    );
  };

  const updateQuantity = (cartItemId: string | number, quantity: number) => {
    const strKey = cartItemId.toString();
    if (quantity <= 0) {
      removeFromCart(strKey);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (
          item.cartItemId === strKey ||
          item.id?.toString() === strKey ||
          item.productId?.toString() === strKey
        ) {
          const maxStock = item.stock;
          return {
            ...item,
            quantity: maxStock ? Math.min(quantity, maxStock) : quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
