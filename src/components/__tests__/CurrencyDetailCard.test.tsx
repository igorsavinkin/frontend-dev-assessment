import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CurrencyDetailCard from "@/components/CurrencyDetailCard";
import { fetchCurrency } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  fetchCurrency: vi.fn(),
}));

describe("CurrencyDetailCard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders currency details when the API succeeds", async () => {
    vi.mocked(fetchCurrency).mockResolvedValueOnce({
      id: "1",
      code: "USD",
      symbol: "$",
    });

    render(<CurrencyDetailCard currencyId="1" />);

    expect(await screen.findByText("USD")).toBeInTheDocument();
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("shows an error and retries when requested", async () => {
    const user = userEvent.setup();
    vi.mocked(fetchCurrency)
      .mockRejectedValueOnce(new Error("Boom"))
      .mockResolvedValueOnce({ id: "1", code: "EUR", symbol: "€" });

    render(<CurrencyDetailCard currencyId="1" />);

    expect(await screen.findByText("Boom")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("EUR")).toBeInTheDocument();
  });
});
