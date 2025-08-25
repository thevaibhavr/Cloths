'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Order } from '../types';
import { formatPrice } from '../utils';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user, currentPage, router]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders(currentPage, 10);
      setOrders(response.orders || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

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
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
        >
          My Orders
        </motion.h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <Package className="w-8 h-8 text-pink-500" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.orderNumber || order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col sm:items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
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
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Duration: {item.rentalDuration} day{item.rentalDuration !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.totalPrice || item.price * item.quantity * item.rentalDuration)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Payment Method</h4>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Rental Period</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(order.rentalStartDate).toLocaleDateString()} - {new Date(order.rentalEndDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Total Amount</h4>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 