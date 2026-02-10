"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "@/lib/auth";
import { AUTH_STORAGE_KEY } from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
    }),
    [user, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
