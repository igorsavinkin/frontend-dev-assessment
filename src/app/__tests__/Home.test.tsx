import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Providers from "@/app/providers";
import Home from "@/app/page";

// Coverage for Home's API-driven render and error/retry flows.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const currencies = [{ id: "1", code: "USD", symbol: "$" }];
const balances = [{ id: "b1", currency_id: "1", amount: "1000" }];

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("Home", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders balances when API responses are valid", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(currencies))
      .mockResolvedValueOnce(jsonResponse(balances));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Providers>
        <Home />
      </Providers>,
    );

    expect(await screen.findByText("USD")).toBeInTheDocument();
    expect(screen.getByText("$ 1000")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View currency details" }),
    ).toBeInTheDocument();
  });

  it("shows a currencies error and retries successfully", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ message: "No currencies" }, 500))
      .mockResolvedValueOnce(jsonResponse(balances))
      .mockResolvedValueOnce(jsonResponse(currencies));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Providers>
        <Home />
      </Providers>,
    );

    expect(await screen.findByText("No currencies")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Retry loading currencies" }),
    );

    await waitFor(() => {
      expect(screen.queryByText("No currencies")).not.toBeInTheDocument();
    });
  });

  it("shows a balances error and retries successfully", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(currencies))
      .mockResolvedValueOnce(jsonResponse({ error: "Balances down" }, 503))
      .mockResolvedValueOnce(jsonResponse(balances));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Providers>
        <Home />
      </Providers>,
    );

    expect(await screen.findByText("Balances down")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Retry loading balances" }),
    );

    expect(await screen.findByText("$ 1000")).toBeInTheDocument();
  });
});
