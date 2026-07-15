// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/authApi';
import { setAuthToken } from '../api/client';
import { AuthResponse, User } from '../types';

const STORAGE_KEY = 'cafe_app_auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  register: (nom: string, email: string, motDePasse: string, telephone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toUser(auth: AuthResponse): User {
  return { id: auth.id, nom: auth.nom, email: auth.email, role: auth.role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const auth: AuthResponse = JSON.parse(raw);
        setAuthToken(auth.token);
        setUser(toUser(auth));
      }
    } finally {
      setLoading(false);
    }
  };

  const persist = async (auth: AuthResponse) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setAuthToken(auth.token);
    setUser(toUser(auth));
  };

  const login = async (email: string, motDePasse: string) => {
    const auth = await authApi.login(email, motDePasse);
    await persist(auth);
  };

  const register = async (nom: string, email: string, motDePasse: string, telephone?: string) => {
    const auth = await authApi.register(nom, email, motDePasse, telephone);
    await persist(auth);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise a l\'interieur de AuthProvider');
  }
  return context;
}
