'use client';

import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Redirect based on cart state
    if (cart.items.length === 0) {
      router.push('/');
    } else {
      router.push('/checkout/guest');
    }
  }, [cart.items.length, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
} 