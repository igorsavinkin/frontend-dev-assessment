"use client";

import { Button, Skeleton, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { fetchCurrency } from "@/lib/api";
import type { Currency } from "@/types/api";

export default function CurrencyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const currencyId = params.id;

  const [currency, setCurrency] = useState<Currency | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrency = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCurrency(currencyId);
      setCurrency(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load currency.");
    } finally {
      setIsLoading(false);
    }
  }, [currencyId]);

  useEffect(() => {
    void loadCurrency();
  }, [loadCurrency]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-default-200 bg-content1">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
              Currency details
            </p>
            <h1 className="text-2xl font-semibold text-default-900">
              Currency #{currencyId}
            </h1>
          </div>
          <Button variant="ghost" onPress={() => router.push("/")}>
            Back to balances
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        {isLoading ? (
          <div className="space-y-4 rounded-2xl border border-default-200 bg-content1 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="space-y-4 rounded-2xl border border-danger-200 bg-danger-50 p-6 text-danger-600"
          >
            <p className="text-sm">{error}</p>
            <Button color="danger" variant="flat" onPress={loadCurrency}>
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !error && currency ? (
          <div className="rounded-2xl border border-default-200 bg-content1 p-6">
            <p className="text-sm text-default-500">Currency code</p>
            <p className="text-3xl font-semibold text-default-900">
              {currency.code}
            </p>
            <p className="mt-3 text-sm text-default-500">Symbol</p>
            <p className="text-xl font-semibold text-default-900">
              {currency.symbol}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-default-500">
              <Spinner size="sm" color="primary" />
              Balance list updates are available on the main dashboard.
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
