'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils';
import { Trash2, Calendar, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { isExternalImage, isValidImageUrl, handleImageError } from '../utils/imageUtils';

export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    getCartTotal, 
    getCartItemCount,
    clearCart 
  } = useCart();
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: ''
  });

  const calculateRentalDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalWithDeposits = () => {
    const rentalTotal = getCartTotal();
    const depositsTotal = cartItems.reduce((total, item) => {
      return total + (item.product.deposit || 0);
    }, 0);
    return rentalTotal + depositsTotal;
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="relative w-24 h-32 flex-shrink-0">
                      {isValidImageUrl(item.product.images[0]) ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => handleImageError(e)}
                          unoptimized={isExternalImage(item.product.images[0])}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Size: {item.product.size} • Condition: {item.product.condition}
                          </p>
                          
                          {/* Owner Info */}
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">
                                {item.product.owner.rating}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {item.product.owner.location}
                              </span>
                            </div>
                          </div>

                          {/* Rental Dates */}
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {item.rentalDates.startDate} - {item.rentalDates.endDate}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.originalPrice > item.product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                            <span className="text-sm text-gray-600">per day</span>
                          </div>
                        </div>

                        {/* Quantity and Remove */}
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Rental Dates */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Rental Dates</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={rentalDates.startDate}
                      onChange={(e) => setRentalDates(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={rentalDates.endDate}
                      onChange={(e) => setRentalDates(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rental Total ({getCartItemCount()} items)</span>
                  <span className="text-gray-900">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposits</span>
                  <span className="text-gray-900">
                    {formatPrice(cartItems.reduce((total, item) => total + (item.product.deposit || 0), 0))}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(getTotalWithDeposits())}</span>
                  </div>
                </div>
              </div>

              {/* Rent Now Button */}
              <button className="w-full bg-pink-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                Rent Now
              </button>

              {/* Additional Info */}
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>• Security deposits are refundable after return</p>
                <p>• Free delivery for orders above ₹2,000</p>
                <p>• 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 