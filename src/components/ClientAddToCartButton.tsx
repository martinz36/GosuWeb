'use client';

import React from 'react';
import { useCart, CartItem } from '@/context/CartContext';

interface ClientAddToCartButtonProps {
  product: {
    id: number;
    slug: string;
    name: string;
    price: number;
    image: string;
    colors?: string;
  };
  label: string;
}

export default function ClientAddToCartButton({ product, label }: ClientAddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    // Select first color as default if available
    const colorList = product.colors ? product.colors.split(',').map(c => c.trim()) : [];
    const defaultColor = colorList.length > 0 ? colorList[0] : undefined;

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedColor: defaultColor
    }, 1);
  };

  return (
    <button
      onClick={handleAdd}
      className="btn-cyan text-sm tracking-wider uppercase font-semibold transition-all"
    >
      {label}
    </button>
  );
}
