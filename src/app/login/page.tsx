"use client";

import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAccountType } from "@/contexts/AccountTypeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  AUTH_PENDING_KEY,
  AUTH_CREDENTIALS,
  validateCredentials,
  type PendingAuth,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { accountType, setAccountType } = useAccountType();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const credentials = AUTH_CREDENTIALS[accountType];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const isValid = validateCredentials(accountType, email, password);
    if (!isValid) {
      setError("Invalid email or password for the selected account type.");
      setIsSubmitting(false);
      return;
    }

    const pending: PendingAuth = { email, accountType };
    sessionStorage.setItem(AUTH_PENDING_KEY, JSON.stringify(pending));
    setIsSubmitting(false);
    router.push("/login/otp");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-background)] px-6 py-12 text-[var(--app-foreground)]">
      <main className="w-full max-w-lg rounded-2xl border border-default-200 bg-content1 px-8 py-10 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
            Secure access
          </p>
          <h1 className="text-3xl font-semibold text-default-900">
            Sign in to continue
          </h1>
          <p className="text-sm text-default-500">
            Use the provided assessment credentials to log in.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <RadioGroup
            label="Account type"
            orientation="horizontal"
            value={accountType}
            onValueChange={(value) =>
              setAccountType(value as "member" | "partner")
            }
            color="primary"
          >
            <Radio value="member">Member</Radio>
            <Radio value="partner">Partner</Radio>
          </RadioGroup>

          <Input
            type="email"
            label="Email"
            value={email}
            onValueChange={setEmail}
            placeholder={credentials.email}
            isRequired
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onValueChange={setPassword}
            placeholder={credentials.password}
            isRequired
          />

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600"
            >
              {error}
            </p>
          ) : null}

          <Button
            color="primary"
            radius="full"
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
          >
            Continue with OTP
          </Button>
        </form>
      </main>
    </div>
  );
}
