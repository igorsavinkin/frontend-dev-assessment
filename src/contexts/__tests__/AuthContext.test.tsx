import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AUTH_STORAGE_KEY, type AuthUser } from "@/lib/auth";

// Coverage for useAuth hydration, persistence, and provider usage.
const testUser: AuthUser = {
  email: "member@valid.email",
  accountType: "member",
};

describe("useAuth", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("throws when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      new Error("useAuth must be used within AuthProvider"),
    );
  });

  it("hydrates the user from session storage", async () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(testUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    expect(result.current.user).toEqual(testUser);
  });

  it("persists user updates and clears on logout", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    act(() => {
      result.current.setUser(testUser);
    });

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        AUTH_STORAGE_KEY,
        JSON.stringify(testUser),
      );
    });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith(AUTH_STORAGE_KEY);
    });
    expect(result.current.user).toBeNull();
  });
});
