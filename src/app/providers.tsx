"use client";

import { HeroUIProvider } from "@heroui/react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import {
  AccountTypeProvider,
  useAccountType,
} from "@/contexts/AccountTypeContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function ThemeBridge({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { accountType } = useAccountType();

  useEffect(() => {
    const themeName = `${accountType}-${theme}`;
    document.documentElement.setAttribute("data-theme", themeName);
  }, [accountType, theme]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <AccountTypeProvider>
          <ThemeBridge>{children}</ThemeBridge>
        </AccountTypeProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
