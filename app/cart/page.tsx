'use client';

import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { cart } = useCart();



  // Redirect based on cart state
  if (cart.items.length === 0) {
    window.location.href = '/';
    return null;
  } else {
    window.location.href = '/checkout/guest';
    return null;
  }

  return null;
} 