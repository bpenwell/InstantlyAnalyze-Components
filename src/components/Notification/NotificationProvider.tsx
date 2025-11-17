import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // in milliseconds, default 2000
}

interface NotificationContextType {
  notifications: NotificationMessage[];
  showNotification: (message: Omit<NotificationMessage, 'id'>) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const showNotification = (message: Omit<NotificationMessage, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const notification: NotificationMessage = {
      id,
      duration: 2000,
      ...message,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-hide after duration
    setTimeout(() => {
      hideNotification(id);
    }, notification.duration);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
