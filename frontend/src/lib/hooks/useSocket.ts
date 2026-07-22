import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      socketRef.current = io('http://localhost:3001', {
        auth: {
          token: `Bearer ${token}`
        }
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      socketRef.current.on('notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        // Trigger a native notification or toast here if needed
        if (typeof window !== 'undefined') {
          const evt = new CustomEvent('new-notification', { detail: data });
          window.dispatchEvent(evt);
        }
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isAuthenticated]);

  const clearNotifications = () => setNotifications([]);

  return { socket: socketRef.current, liveNotifications: notifications, clearNotifications };
}
