'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <AuthContext value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
