'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { initializeSocket, disconnectSocket, getSocket } from '@/lib/utils/socket';
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null); // ← track in state

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('amexan_token');
      if (token) {
        const s = initializeSocket(token);
        setSocket(s); // ← triggers re-render with live socket
      }
    }
    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [user]);

  const emit = (event: string, data: any) => {
    const s = getSocket();
    if (!s) return; // ← guard instead of throw
    s.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    const s = getSocket();
    if (!s) return;
    s.on(event, callback);
  };

  const off = (event: string, callback?: (data: any) => void) => {
    const s = getSocket();
    if (!s) return;
    callback ? s.off(event, callback) : s.off(event);
  };

  return (
    <SocketContext.Provider value={{ socket, emit, on, off }}>
      {/* ↑ use state variable, not getSocket() */}
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};