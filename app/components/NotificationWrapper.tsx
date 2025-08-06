'use client';

import { useCart } from '../contexts/CartContext';
import { CheckCircle, X, ShoppingBag, Heart } from 'lucide-react';
import { useEffect } from 'react';

export default function NotificationWrapper() {
  const { notification, hideNotification } = useCart();

  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.isVisible, hideNotification]);

  if (!notification.isVisible) return null;

  const getIcon = () => {
    switch (notification.action) {
      case 'cart':
        return <ShoppingBag className="w-5 h-5" />;
      case 'wishlist':
        return <Heart className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className={`${getBgColor()} text-white rounded-lg shadow-lg p-4 flex items-center space-x-3`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
        <button
          onClick={hideNotification}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 