'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem, Cart } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart;
  wishlistItems: Product[];
  addToCart: (product: Product, quantity: number, rentalDuration: number, needDate?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number, rentalDuration: number) => void;
  clearCart: () => void;
  getCartItem: (productId: string) => CartItem | undefined;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
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
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0 });
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
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('rentTheMomentWishlist');

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('cart');
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
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rentTheMomentWishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity * 1); // Always 1 day rental
    }, 0);
  };

  const addToCart = (product: Product, quantity: number, rentalDuration: number, needDate?: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product._id === product._id
      );

              if (existingItemIndex > -1) {
          // Update existing item
          const updatedItems = [...prevCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            rentalDuration: rentalDuration, // Update rental duration
            needDate: needDate || updatedItems[existingItemIndex].needDate
          };

        const newCart = {
          ...prevCart,
          items: updatedItems,
          totalAmount: calculateTotal(updatedItems)
        };

        showNotification(`Updated ${product.name} in cart`, 'success', 'cart');
        return newCart;
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          rentalDuration,
          needDate
        };

        const newItems = [...prevCart.items, newItem];
        const newCart = {
          ...prevCart,
          items: newItems,
          totalAmount: calculateTotal(newItems)
        };

        showNotification(`Added ${product.name} to cart`, 'success', 'cart');
        return newCart;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.product._id !== productId);
      const newCart = {
        ...prevCart,
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems)
      };

      const removedItem = prevCart.items.find(item => item.product._id === productId);
      if (removedItem) {
        showNotification(`Removed ${removedItem.product.name} from cart`, 'info', 'cart');
      }

      return newCart;
    });
  };

  const updateCartItem = (productId: string, quantity: number, rentalDuration: number) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => {
        if (item.product._id === productId) {
          return {
            ...item,
            quantity,
            rentalDuration
          };
        }
        return item;
      });

      const newCart = {
        ...prevCart,
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems)
      };

      return newCart;
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalAmount: 0 });
    showNotification('Cart cleared', 'success', 'cart');
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return cart.items.find(item => item.product._id === productId);
  };

  const getCartTotal = (): number => {
    return cart.totalAmount;
  };

  const getCartItemCount = (): number => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item._id === product._id);
      if (!exists) {
        showNotification(`${product.name} added to wishlist`, 'success', 'wishlist');
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => {
      const item = prev.find(item => item._id === productId);
      if (item) {
        showNotification(`${item.name} removed from wishlist`, 'info', 'wishlist');
      }
      return prev.filter(item => item._id !== productId);
    });
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

  const value: CartContextType = {
    cart,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartItem,
    getCartTotal,
    getCartItemCount,
    addToWishlist,
    removeFromWishlist,
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