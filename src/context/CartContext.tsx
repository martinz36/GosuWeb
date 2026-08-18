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

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  message: string;
  isAffiliate?: boolean;
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
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  discountAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Load cart and check for ?ref= parameter in URL on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gosu_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }

    const savedCoupon = localStorage.getItem('gosu_applied_coupon');
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        console.error('Error loading coupon from localStorage', e);
      }
    }

    // Check for ?ref= in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRef = urlParams.get('ref');

      if (urlRef) {
        const cleanRef = urlRef.toUpperCase().trim();
        localStorage.setItem('gosu_ref_code', cleanRef);
        
        // Auto-validate affiliate referral code
        fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: cleanRef }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const couponObj: AppliedCoupon = {
                code: data.code,
                discountType: data.discountType,
                discountValue: data.discountValue,
                message: data.message,
                isAffiliate: data.type === 'affiliate',
              };
              setAppliedCoupon(couponObj);
              localStorage.setItem('gosu_applied_coupon', JSON.stringify(couponObj));
            }
          })
          .catch((err) => console.error('Error auto-applying referral coupon:', err));
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

  // Validate coupon or affiliate code via API
  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.success) {
        const couponObj: AppliedCoupon = {
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          message: data.message,
          isAffiliate: data.type === 'affiliate',
        };
        setAppliedCoupon(couponObj);
        localStorage.setItem('gosu_applied_coupon', JSON.stringify(couponObj));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Código no válido' };
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: 'Error de conexión al validar código.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('gosu_applied_coupon');
  };

  // Financial Calculations
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = cartTotal * (appliedCoupon.discountValue / 100);
    } else {
      discountAmount = Math.min(cartTotal, appliedCoupon.discountValue);
    }
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount);

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
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalTotal,
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
