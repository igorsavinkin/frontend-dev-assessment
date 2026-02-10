"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AccountType = "member" | "partner";

type AccountTypeContextValue = {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  toggleAccountType: () => void;
};

const AccountTypeContext = createContext<AccountTypeContextValue | null>(null);

export function AccountTypeProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("member");

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
