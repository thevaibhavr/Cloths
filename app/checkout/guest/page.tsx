'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, MapPin, Check, Share2, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils';
import { apiService } from '../../services/api';
import { useRouter } from 'next/navigation';

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function GuestCheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India' 
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/');
      return;
    }
  }, [cart.items.length, router]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    });
  };

  const shareOrderOnWhatsApp = (order: any) => {
    const orderDetails = `
🎉 *New Order Placed!*

*Order Number:* ${order.orderNumber}
*Customer:* ${order.shippingAddress.name}
*Phone:* ${order.shippingAddress.phone}
*Total Amount:* ₹${order.totalAmount}

*Items:*
${order.items.map((item: any) => `• ${item.product.name} x${item.quantity}`).join('\n')}

*Delivery Address:*
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

*Payment Method:* ${order.paymentMethod}
*Rental Start:* ${new Date(order.rentalStartDate).toLocaleDateString()}
*Rental End:* ${new Date(order.rentalEndDate).toLocaleDateString()}
    `.trim();

    const whatsappUrl = `https://wa.me/919926503468?text=${encodeURIComponent(orderDetails)}`;
    
    // Try to open WhatsApp with a fallback
    if (typeof window !== 'undefined') {
      try {
        window.open(whatsappUrl, '_blank');
      } catch (error) {
        // Fallback: copy to clipboard and show message
        navigator.clipboard.writeText(orderDetails);
        alert('Order details copied to clipboard. Please paste in WhatsApp manually.');
      }
    }
  };



  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }

    setOrderLoading(true);
    try {
      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          rentalDuration: item.rentalDuration
        })),
        shippingAddress: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country
        },
        paymentMethod: paymentMethod,
        rentalStartDate: cart.items[0]?.needDate || new Date().toISOString(),
        rentalEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 7 days from now
        needDate: cart.items[0]?.needDate || new Date().toISOString(),
        notes: ''
      };

      // Create guest order
      const order = await apiService.createGuestOrder(orderData);
      
      console.log('Order created successfully:', order);
      
      // Set success state
      setCreatedOrder(order);
      setOrderSuccess(true);
      
      // Clear cart after successful order
      clearCart();
      
      // Immediately open WhatsApp with order details
      shareOrderOnWhatsApp(order);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return null; // Will redirect to cart
  }

  if (orderSuccess && createdOrder) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 py-8 sm:py-12"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully and WhatsApp has been opened to share order details.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="font-semibold text-gray-900 mb-3">Order Details</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Order Number:</span> {createdOrder.orderNumber}</p>
                <p><span className="font-medium">Total Amount:</span> ₹{createdOrder.totalAmount}</p>
                <p><span className="font-medium">Payment Method:</span> {createdOrder.paymentMethod}</p>
                <p><span className="font-medium">Delivery Address:</span></p>
                <div className="ml-4 text-gray-600">
                  <p>{createdOrder.shippingAddress.name}</p>
                  <p>{createdOrder.shippingAddress.street}</p>
                  <p>{createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} {createdOrder.shippingAddress.zipCode}</p>
                  <p>{createdOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => shareOrderOnWhatsApp(createdOrder)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                <Share2 className="w-6 h-6 mr-3" />
                Share Order Details on WhatsApp Again
              </button>
              
              <a
                href="tel:9926503468"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us: 9926503468
              </a>

              <Link
                href="/"
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
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
        {/* Header */}
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
            Back to Home
          </Link>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
            >
              Guest Checkout
            </motion.h1>

            {/* Delivery Address */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-pink-500" />
                  Delivery Address
                </h2>
              </div>

              {selectedAddress ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{selectedAddress.name}</p>
                        <p className="text-gray-600">{selectedAddress.phone}</p>
                        <p className="font-medium text-gray-900">{selectedAddress.street}</p>
                        <p className="text-gray-600">
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                        </p>
                        <p className="text-gray-600">{selectedAddress.country}</p>
                      </div>
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                  >
                    Change Address
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No delivery address selected</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              )}

              {/* Address Form */}
              {showAddressForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 border-t border-gray-200 pt-4"
                >
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter ZIP code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {['Cash on Delivery', 'Credit Card', 'Debit Card', 'PayPal'].map((method) => (
                  <label key={method} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                    />
                    <span className="text-gray-900">{method}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={item.product._id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0 w-16 h-16 relative">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">N/A</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Duration: 1 day</p>
                      {item.needDate && (
                        <p className="text-sm text-gray-500">
                          Need by: {new Date(item.needDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity * 1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 mt-6 lg:mt-0"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-8">
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
                onClick={handlePlaceOrder}
                disabled={orderLoading || !selectedAddress}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </button>

              {!selectedAddress && (
                <p className="text-sm text-red-500 mt-3 text-center">
                  Please select a delivery address to continue
                </p>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After placing your order, you can share the order details directly on WhatsApp with our team at 9926503468 for quick confirmation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
