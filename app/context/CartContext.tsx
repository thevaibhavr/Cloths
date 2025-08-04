'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  rentalDates: {
    startDate: string;
    endDate: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: Product[];
  addToCart: (product: Product, quantity: number, rentalDates: { startDate: string; endDate: string }) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getWishlistCount: () => number;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
    action?: 'cart' | 'wishlist';
    isVisible: boolean;
  };
  showNotification: (message: string, type: 'success' | 'error' | 'info', action?: 'cart' | 'wishlist') => void;
  hideNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    action?: 'cart' | 'wishlist';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    action: undefined,
    isVisible: false
  });

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rentEleganceCart');
    const savedWishlist = localStorage.getItem('rentEleganceWishlist');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rentEleganceCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rentEleganceWishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product: Product, quantity: number, rentalDates: { startDate: string; endDate: string }) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        showNotification(`${product.name} quantity updated in cart`, 'success', 'cart');
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        showNotification(`${product.name} added to cart`, 'success', 'cart');
        return [...prev, { product, quantity, rentalDates }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (!exists) {
        showNotification(`${product.name} added to wishlist`, 'success', 'wishlist');
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item) {
        showNotification(`${item.name} removed from wishlist`, 'info', 'wishlist');
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info', action?: 'cart' | 'wishlist') => {
    setNotification({
      message,
      type,
      action,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    addToWishlist,
    removeFromWishlist,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getWishlistCount,
    notification,
    showNotification,
    hideNotification,
  };

  return (
    <CartContext.Provider value={value}>
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