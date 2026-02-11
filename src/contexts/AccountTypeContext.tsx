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

export type AccountType = "member" | "partner";

type AccountTypeContextValue = {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  toggleAccountType: () => void;
};

const AccountTypeContext = createContext<AccountTypeContextValue | null>(null);

export function AccountTypeProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("member");

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    } catch {
      return;
    }

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AuthUser;
      const nextType = parsed.accountType ?? "member";
      const timeoutId = window.setTimeout(() => {
        setAccountType(nextType);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    } catch {
      // ignore parsing errors
    }
  }, []);

  const toggleAccountType = useCallback(() => {
    setAccountType((prev) => (prev === "member" ? "partner" : "member"));
  }, []);

  const value = useMemo(
    () => ({
      accountType,
      setAccountType,
      toggleAccountType,
    }),
    [accountType, toggleAccountType],
  );

  return (
    <AccountTypeContext.Provider value={value}>
      {children}
    </AccountTypeContext.Provider>
  );
}

export function useAccountType() {
  const context = useContext(AccountTypeContext);

  if (!context) {
    throw new Error("useAccountType must be used within AccountTypeProvider");
  }

  return context;
}
