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
  isHydrated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    } catch {
      setIsHydrated(true);
      return;
    }

    if (!raw) {
      setIsHydrated(true);
      return;
    }

    try {
      setUser(JSON.parse(raw) as AuthUser);
    } catch {
      try {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // ignore storage errors
      }
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    try {
      if (!user) {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore storage errors to avoid blocking auth state updates
    }
  }, [isHydrated, user]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      isHydrated,
    }),
    [user, logout, isHydrated],
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
