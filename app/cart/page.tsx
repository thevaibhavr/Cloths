'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils';

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateRentalDays = (startDate: string, endDate: string) => {
    const days = calculateDays(startDate, endDate);
    if (days <= 2) return 1;
    return days - 1; // Don't count start and end dates
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      const item = cart.items.find(item => item.product._id === productId);
      if (item) {
        updateCartItem(productId, newQuantity, item.rentalDuration);
      }
    }
  };

  const handleDateChange = (productId: string, startDate: string, endDate: string) => {
    const rentalDays = calculateRentalDays(startDate, endDate);
    const item = cart.items.find(item => item.product._id === productId);
    if (item) {
      updateCartItem(productId, item.quantity, rentalDays);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    window.location.href = '/checkout';
  };

  if (cart.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-lg font-medium text-gray-900"
            >
              Your cart is empty
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-sm text-gray-500"
            >
              Start shopping to add items to your cart
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <Link
                href="/categories"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center mb-6 sm:mb-8"
        >
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start">
          <div className="lg:col-span-7">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
            >
              Shopping Cart
            </motion.h1>
            
            <div className="space-y-4 sm:space-y-6">
              <AnimatePresence>
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item.product._id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={item.product.images[0] || '/placeholder-image.jpg'}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              <Link href={`/product/${item.product.slug}`} className="hover:text-pink-600">
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                              {item.product.category.name} • Size: {item.product.size} • Color: {item.product.color}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors self-start sm:self-auto"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Quantity Display */}
                          <div className="flex items-center justify-between sm:justify-start">
                            <span className="text-sm font-medium text-gray-700">Quantity: {item.quantity}</span>
                          </div>

                          {/* Date Selection */}
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Rental Dates:</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                <input
                                  type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  value={item.rentalDates?.startDate || ''}
                                  onChange={(e) => {
                                    const endDate = new Date(e.target.value);
                                    endDate.setDate(endDate.getDate() + 1);
                                    handleDateChange(item.product._id, e.target.value, endDate.toISOString().split('T')[0]);
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                <input
                                  type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  value={item.rentalDates?.endDate || ''}
                                  onChange={(e) => {
                                    const startDate = new Date();
                                    handleDateChange(item.product._id, startDate.toISOString().split('T')[0], e.target.value);
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              Rental days: {item.rentalDuration} day{item.rentalDuration !== 1 ? 's' : ''}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.product.price * item.quantity * item.rentalDuration)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatPrice(item.product.price)} × {item.quantity} × {item.rentalDuration} days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Clear Cart Button */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear all items
              </button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 mt-6 lg:mt-0"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                  <span className="text-gray-900">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="text-gray-900">₹0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || cart.items.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {!user && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  <Link href="/login" className="text-pink-600 hover:text-pink-500">
                    Sign in
                  </Link>{' '}
                  to complete your order
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 