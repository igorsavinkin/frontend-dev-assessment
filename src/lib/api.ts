import type { Balance, Currency } from "@/types/api";

const BASE_URL = "https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1";
const DEFAULT_TIMEOUT_MS = 10000;

type RequestParams = Record<string, string | number | boolean | undefined>;
type RequestOptions = RequestInit & { timeoutMs?: number };

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

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();
  if (!text) return null;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new ApiError("Invalid JSON response received.", response.status);
    }
  }

  return text;
}

function extractErrorMessage(body: unknown, fallback: string) {
  if (typeof body === "string" && body.trim()) return body;

  if (body && typeof body === "object") {
    const message = (body as { message?: string; error?: string }).message;
    if (message?.trim()) return message;
    const error = (body as { error?: string }).error;
    if (error?.trim()) return error;
  }

  return fallback;
}

async function request<T>(
  path: string,
  params?: RequestParams,
  init?: RequestOptions,
) {
  const controller = new AbortController();
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildUrl(path, params), {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    const body = await parseResponseBody(response);

    if (!response.ok) {
      const fallback = response.statusText || "Request failed.";
      throw new ApiError(extractErrorMessage(body, fallback), response.status);
    }

    if (body === null || body === undefined) {
      throw new ApiError("Empty response received.", response.status);
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 408);
    }

    if (error instanceof Error) {
      throw new ApiError(error.message || "Network error occurred.", 0);
    }

    throw new ApiError("Network error occurred.", 0);
  } finally {
    clearTimeout(timeoutId);
  }
}

export function fetchCurrencies() {
  return request<Currency[]>("/currencies");
}

export function fetchCurrency(id: string) {
  if (!id.trim()) {
    throw new ApiError("Currency ID is required.", 400);
  }
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
