import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AccountTypeProvider,
  useAccountType,
} from "@/contexts/AccountTypeContext";
import { AUTH_STORAGE_KEY, type AuthUser } from "@/lib/auth";

// Coverage for account type hydration and toggling behavior.
const partnerUser: AuthUser = {
  email: "partner@valid.email",
  accountType: "partner",
};

describe("useAccountType", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("throws when used outside AccountTypeProvider", () => {
    expect(() => renderHook(() => useAccountType())).toThrow(
      new Error("useAccountType must be used within AccountTypeProvider"),
    );
  });

  it("hydrates account type from session storage", () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(partnerUser));
    vi.useFakeTimers();

    const { result } = renderHook(() => useAccountType(), {
      wrapper: ({ children }) => (
        <AccountTypeProvider>{children}</AccountTypeProvider>
      ),
    });

    expect(result.current.accountType).toBe("member");

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.accountType).toBe("partner");
    vi.useRealTimers();
  });

  it("toggles account type", () => {
    const { result } = renderHook(() => useAccountType(), {
      wrapper: ({ children }) => (
        <AccountTypeProvider>{children}</AccountTypeProvider>
      ),
    });

    expect(result.current.accountType).toBe("member");

    act(() => {
      result.current.toggleAccountType();
    });

    expect(result.current.accountType).toBe("partner");

    act(() => {
      result.current.toggleAccountType();
    });

    expect(result.current.accountType).toBe("member");
  });
});
