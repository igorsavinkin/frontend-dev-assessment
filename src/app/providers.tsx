"use client";

import { HeroUIProvider } from "@heroui/react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import {
  AccountTypeProvider,
  useAccountType,
} from "@/contexts/AccountTypeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function ThemeBridge({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { accountType } = useAccountType();

  useEffect(() => {
    const themeName = `${accountType}-${theme}`;
    const themeClasses = [
      "member-light",
      "member-dark",
      "partner-light",
      "partner-dark",
    ];

    document.documentElement.setAttribute("data-theme", themeName);
    document.body.setAttribute("data-theme", themeName);
    document.documentElement.classList.remove(...themeClasses);
    document.documentElement.classList.add(themeName);
    document.body.classList.remove(...themeClasses);
    document.body.classList.add(themeName);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [accountType, theme]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <AccountTypeProvider>
          <AuthProvider>
            <ThemeBridge>{children}</ThemeBridge>
          </AuthProvider>
        </AccountTypeProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
