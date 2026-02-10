"use client";

import { Button, Radio, RadioGroup, Switch } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useAccountType } from "@/contexts/AccountTypeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { accountType, setAccountType } = useAccountType();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <main className="w-full max-w-lg">
        <div className="rounded-2xl border border-default-200 bg-content1 px-8 py-10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
            Frontend Developer Assessment
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-default-900">
            Initial setup complete
          </h1>
          <p className="mt-3 text-base text-default-600">
            HeroUI is wired into the project. Next, we’ll build the auth flow,
            theming, and data views.
          </p>
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-default-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-default-900">Theme</p>
                <p className="text-xs text-default-500">
                  Toggle light or dark mode.
                </p>
              </div>
              <Switch
                isSelected={theme === "dark"}
                onValueChange={toggleTheme}
                color="primary"
              >
                {theme === "dark" ? "Dark" : "Light"}
              </Switch>
            </div>
            <div className="rounded-xl border border-default-200 px-4 py-3">
              <p className="text-sm font-semibold text-default-900">
                Account type
              </p>
              <p className="text-xs text-default-500">
                Primary color updates based on selection.
              </p>
              <RadioGroup
                className="mt-3"
                value={accountType}
                onValueChange={(value) =>
                  setAccountType(value as "member" | "partner")
                }
                orientation="horizontal"
                color="primary"
              >
                <Radio value="member">Member</Radio>
                <Radio value="partner">Partner</Radio>
              </RadioGroup>
            </div>
          </div>
          <div className="mt-6">
            {user ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button color="primary" radius="full" onPress={logout}>
                  Sign out
                </Button>
                <span className="text-sm text-default-500">
                  Logged in as {user.email}
                </span>
              </div>
            ) : (
              <Button
                color="primary"
                radius="full"
                onPress={() => router.push("/login")}
              >
                Go to login
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
