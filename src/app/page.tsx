"use client";

import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Skeleton,
  Spinner,
  Switch,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAccountType } from "@/contexts/AccountTypeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { fetchBalances, fetchCurrencies } from "@/lib/api";
import type { Balance, Currency } from "@/types/api";

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: "amount", label: "Amount" },
  { value: "currency_id", label: "Currency ID" },
] as const;

const ORDER_OPTIONS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
] as const;

type SortBy = (typeof SORT_OPTIONS)[number]["value"];
type SortOrder = (typeof ORDER_OPTIONS)[number]["value"];

export default function Home() {
  const router = useRouter();
  const { accountType, setAccountType } = useAccountType();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currenciesError, setCurrenciesError] = useState<string | null>(null);
  const [balancesError, setBalancesError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("amount");
  const [order, setOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const data = await fetchCurrencies();
        setCurrencies(data);
      } catch (error) {
        setCurrenciesError(
          error instanceof Error ? error.message : "Unable to load currencies.",
        );
      }
    };

    loadCurrencies();
  }, []);

  const loadBalances = useCallback(
    async (nextPage: number) => {
      setIsLoading(true);
      setBalancesError(null);

      try {
        const data = await fetchBalances({
          page: nextPage,
          limit: PAGE_SIZE,
          sortBy,
          order,
          search,
        });

        setBalances((prev) => (nextPage === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
        setPage(nextPage);
      } catch (error) {
        setBalancesError(
          error instanceof Error ? error.message : "Unable to load balances.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [order, search, sortBy],
  );

  useEffect(() => {
    void loadBalances(1);
  }, [loadBalances]);

  const { sentinelRef } = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: () => loadBalances(page + 1),
  });

  const currencyMap = useMemo(() => {
    return new Map(currencies.map((currency) => [currency.id, currency]));
  }, [currencies]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-default-200 bg-content1">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-6 px-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
              Frontend Developer Assessment
            </p>
            <h1 className="text-2xl font-semibold text-default-900">
              Balances overview
            </h1>
            <p className="text-sm text-default-500">
              Search, sort, and scroll through balances tied to currencies.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Switch
              isSelected={theme === "dark"}
              onValueChange={(value) => setTheme(value ? "dark" : "light")}
              color="primary"
            >
              {theme === "dark" ? "Dark" : "Light"}
            </Switch>
            <RadioGroup
              value={accountType}
              onValueChange={(value) =>
                setAccountType(value as "member" | "partner")
              }
              orientation="horizontal"
              color="primary"
            >
              <Radio value="member">Member</Radio>
              <Radio value="partner">Partner</Radio>
            </RadioGroup>
            {user ? (
              <Button color="primary" radius="full" onPress={logout}>
                Sign out
              </Button>
            ) : (
              <Button
                color="primary"
                radius="full"
                onPress={() => router.push("/login")}
              >
                Go to login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
        <section className="grid gap-4 rounded-2xl border border-default-200 bg-content1 p-6 lg:grid-cols-[1.4fr_1fr_1fr]">
          <Input
            label="Search balances"
            placeholder="Search by amount or currency"
            value={searchInput}
            onValueChange={setSearchInput}
            isClearable
            onClear={() => setSearchInput("")}
          />
          <Select
            label="Sort by"
            selectedKeys={[sortBy]}
            onSelectionChange={(keys) =>
              setSortBy(Array.from(keys)[0] as SortBy)
            }
          >
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="Order"
            selectedKeys={[order]}
            onSelectionChange={(keys) =>
              setOrder(Array.from(keys)[0] as SortOrder)
            }
          >
            {ORDER_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </section>

        {currenciesError ? (
          <div
            role="alert"
            className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600"
          >
            {currenciesError}
          </div>
        ) : null}

        <section className="space-y-4">
          {balances.length === 0 && isLoading ? (
            <div className="grid gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={`balance-skeleton-${index}`}
                  className="h-20 rounded-xl"
                />
              ))}
            </div>
          ) : null}

          {balancesError ? (
            <div
              role="alert"
              className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600"
            >
              {balancesError}
            </div>
          ) : null}

          <div className="grid gap-3">
            {balances.map((balance) => {
              const currency =
                currencyMap.get(String(balance.currency_id)) ?? null;

              return (
                <article
                  key={balance.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-default-200 bg-content1 px-5 py-4"
                >
                  <div>
                    <p className="text-sm text-default-500">Currency</p>
                    <p className="text-lg font-semibold text-default-900">
                      {currency ? currency.code : "Unknown"}
                    </p>
                    <p className="text-sm text-default-400">
                      {currency ? currency.symbol : "—"} · ID{" "}
                      {balance.currency_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-default-500">Balance</p>
                    <p className="text-2xl font-semibold text-default-900">
                      {currency ? currency.symbol : ""} {balance.amount}
                    </p>
                    <Button
                      variant="light"
                      color="primary"
                      onPress={() =>
                        router.push(`/currencies/${balance.currency_id}`)
                      }
                    >
                      View currency details
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex items-center justify-center py-4">
            {isLoading && balances.length > 0 ? (
              <Spinner color="primary" />
            ) : null}
          </div>

          {hasMore ? <div ref={sentinelRef} /> : null}
          {!hasMore && balances.length > 0 ? (
            <p className="text-center text-sm text-default-500">
              You’ve reached the end of the list.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
