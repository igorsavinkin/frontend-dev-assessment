import type { AccountType } from "@/contexts/AccountTypeContext";

export type AuthUser = {
  email: string;
  accountType: AccountType;
};

export type PendingAuth = {
  email: string;
  accountType: AccountType;
};

export const AUTH_STORAGE_KEY = "auth.user";
export const AUTH_PENDING_KEY = "auth.pending";

export const AUTH_CREDENTIALS: Record<
  AccountType,
  { email: string; password: string; otp: string }
> = {
  member: {
    email: "member@valid.email",
    password: "Member123!",
    otp: "151588",
  },
  partner: {
    email: "partner@valid.email",
    password: "Partner123!",
    otp: "262699",
  },
};

export function validateCredentials(
  accountType: AccountType,
  email: string,
  password: string,
) {
  const credentials = AUTH_CREDENTIALS[accountType];
  return (
    credentials.email.toLowerCase() === email.trim().toLowerCase() &&
    credentials.password === password
  );
}

export function validateOtp(accountType: AccountType, otp: string) {
  const credentials = AUTH_CREDENTIALS[accountType];
  return credentials.otp === otp.trim();
}
