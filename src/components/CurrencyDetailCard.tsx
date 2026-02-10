"use client";

import { Button, Skeleton, Spinner } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { fetchCurrency } from "@/lib/api";
import type { Currency } from "@/types/api";

type CurrencyDetailCardProps = {
  currencyId: string;
};

export default function CurrencyDetailCard({
  currencyId,
}: CurrencyDetailCardProps) {
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

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-2xl border border-default-200 bg-content1 p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-48" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="space-y-4 rounded-2xl border border-danger-200 bg-danger-50 p-6 text-danger-600"
      >
        <p className="text-sm">{error}</p>
        <Button color="danger" variant="flat" onPress={loadCurrency}>
          Retry
        </Button>
      </div>
    );
  }

  if (!currency) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-default-200 bg-content1 p-6">
      <p className="text-sm text-default-500">Currency code</p>
      <p className="text-3xl font-semibold text-default-900">{currency.code}</p>
      <p className="mt-3 text-sm text-default-500">Symbol</p>
      <p className="text-xl font-semibold text-default-900">
        {currency.symbol}
      </p>
      <div className="mt-6 flex items-center gap-3 text-sm text-default-500">
        <Spinner size="sm" color="primary" />
        Balance list updates are available on the main dashboard.
      </div>
    </div>
  );
}
