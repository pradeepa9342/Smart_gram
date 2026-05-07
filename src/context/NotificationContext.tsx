'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  target: 'user' | 'admin';
  timestamp: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: number) => void;
  unreadCount: (role: 'user' | 'admin') => number;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('smartgram-notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('smartgram-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = (role: 'user' | 'admin') => {
    return notifications.filter(n => n.target === role).length;
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
