import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

// Coverage for theme toggling and provider usage errors.
describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      new Error("useTheme must be used within ThemeProvider"),
    );
  });

  it("toggles the theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
  });
});
