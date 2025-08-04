'use client';

import { useCart } from '../context/CartContext';
import Notification from './Notification';

export default function NotificationWrapper() {
  const { notification, hideNotification } = useCart();

  return (
    <Notification
      message={notification.message}
      type={notification.type}
      action={notification.action}
      isVisible={notification.isVisible}
      onClose={hideNotification}
    />
  );
} 