'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CreditCard, Shield, Truck } from 'lucide-react';
import { formatPrice } from '../utils';

interface RentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  rentalDates: {
    startDate: string;
    endDate: string;
  };
  onRentalDatesChange: (dates: { startDate: string; endDate: string }) => void;
  onConfirmRent: () => void;
}

export default function RentModal({ 
  isOpen, 
  onClose, 
  product, 
  rentalDates, 
  onRentalDatesChange, 
  onConfirmRent 
}: RentModalProps) {
  if (!product) return null;

  const calculateRentalDays = () => {
    if (!rentalDates.startDate || !rentalDates.endDate) return 0;
    const start = new Date(rentalDates.startDate);
    const end = new Date(rentalDates.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const rentalDays = calculateRentalDays();
  const totalPrice = product.price * rentalDays;
  const totalWithDeposit = totalPrice + (product.deposit || 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Rent Now</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{product.name}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Rental Dates */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Select Rental Dates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={rentalDates.startDate}
                      onChange={(e) => onRentalDatesChange({ 
                        ...rentalDates, 
                        startDate: e.target.value 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={rentalDates.endDate}
                      onChange={(e) => onRentalDatesChange({ 
                        ...rentalDates, 
                        endDate: e.target.value 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rental Price ({rentalDays} days)</span>
                    <span className="text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="text-gray-900">{formatPrice(product.deposit || 0)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatPrice(totalWithDeposit)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <motion.div 
                  className="flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </motion.div>
                <motion.div 
                  className="flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Truck className="w-6 h-6 text-blue-600" />
                  <span className="text-xs text-gray-600">Free Delivery</span>
                </motion.div>
                <motion.div 
                  className="flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirmRent}
                disabled={!rentalDates.startDate || !rentalDates.endDate}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rental - {formatPrice(totalWithDeposit)}
              </motion.button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                By clicking confirm, you agree to our rental terms and conditions
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 