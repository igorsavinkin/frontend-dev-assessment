"use client";

import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { AUTH_PENDING_KEY, validateOtp, type PendingAuth } from "@/lib/auth";

export default function OtpPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [otpInputError, setOtpInputError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pending = useMemo<PendingAuth | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(AUTH_PENDING_KEY);
    } catch {
      return null;
    }
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as PendingAuth;
    } catch {
      sessionStorage.removeItem(AUTH_PENDING_KEY);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!pending) {
      router.replace("/login");
    }
  }, [pending, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pending) return;

    const normalizedOtp = otp.trim();
    if (!/^\d{6}$/.test(normalizedOtp)) {
      setOtpInputError("Enter a valid 6-digit OTP.");
      return;
    }

    setOtpInputError(null);
    setError(null);
    setIsSubmitting(true);

    const isValid = validateOtp(pending.accountType, normalizedOtp);
    if (!isValid) {
      setError("Invalid OTP. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      setUser({ email: pending.email, accountType: pending.accountType });
      sessionStorage.removeItem(AUTH_PENDING_KEY);
      setIsSubmitting(false);
      router.replace("/");
    } catch {
      setError("Unable to complete login. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-background)] px-6 py-12 text-[var(--app-foreground)]">
      <main className="w-full max-w-lg rounded-2xl border border-default-200 bg-content1 px-8 py-10 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
            One-time passcode
          </p>
          <h1 className="text-3xl font-semibold text-default-900">
            Verify your login
          </h1>
          <p className="text-sm text-default-500">
            Enter the OTP provided for the selected account type.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="OTP"
            value={otp}
            onValueChange={(value) => {
              const sanitized = value.replace(/\D/g, "");
              setOtp(sanitized);
              if (otpInputError) setOtpInputError(null);
              if (error) setError(null);
            }}
            isRequired
            autoFocus
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            description="Enter the 6-digit code."
            isInvalid={Boolean(otpInputError)}
            errorMessage={otpInputError ?? undefined}
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
            isDisabled={!pending || otp.trim().length !== 6}
          >
            Confirm OTP
          </Button>
        </form>
      </main>
    </div>
  );
}
