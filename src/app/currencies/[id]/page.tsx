"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import CurrencyDetailCard from "@/components/CurrencyDetailCard";

export default function CurrencyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const currencyId = params.id;

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
        <CurrencyDetailCard currencyId={currencyId} />
      </main>
    </div>
  );
}
