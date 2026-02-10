import type { Balance, Currency } from "@/types/api";

const BASE_URL = "https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1";

type RequestParams = Record<string, string | number | boolean | undefined>;

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function buildUrl(path: string, params?: RequestParams) {
  const url = new URL(`${BASE_URL}${path}`);
  if (!params) return url.toString();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function request<T>(
  path: string,
  params?: RequestParams,
  init?: RequestInit,
) {
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || "Request failed", response.status);
  }

  return (await response.json()) as T;
}

export function fetchCurrencies() {
  return request<Currency[]>("/currencies");
}

export function fetchCurrency(id: string) {
  return request<Currency>(`/currencies/${id}`);
}

export function fetchBalances(params: {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}) {
  return request<Balance[]>("/balances", params);
}

export { ApiError };
