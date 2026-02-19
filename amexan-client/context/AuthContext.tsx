'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { API } from '@/lib/config/api-routes';

interface AuthUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  universalId?: string;
  avatar?: string;
}

interface AuthContextType {
  user:     AuthUser | null;
  token:    string | null;
  loading:  boolean;
  login:    (user: AuthUser, token: string) => void;
  logout:   () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'amexan_token';
const USER_KEY  = 'amexan_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount + verify token still valid
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser  = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Normalize _id
        if (!parsed._id && parsed.id) parsed._id = parsed.id;
        setUser(parsed);
        setToken(storedToken);
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        // Verify token is still valid against backend
        axios.get(API.AUTH.ME)
          .then(res => {
            const u = res.data?.user || res.data;
            if (!u._id && u.id) u._id = u.id;
            setUser(u);
            localStorage.setItem(USER_KEY, JSON.stringify(u));
          })
          .catch(() => {
            // Token expired — clear
            clearAuth();
          })
          .finally(() => setLoading(false));
      } catch {
        clearAuth();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const login = useCallback((u: AuthUser, t: string) => {
    if (!u._id && u.id) u._id = u.id;
    setUser(u);
    setToken(t);
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, []);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}