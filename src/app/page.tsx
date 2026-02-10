import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <main className="w-full max-w-lg">
        <div className="rounded-2xl border border-default-200 bg-content1 px-8 py-10 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
            Frontend Developer Assessment
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-default-900">
            Initial setup complete
          </h1>
          <p className="mt-3 text-base text-default-600">
            HeroUI is wired into the project. Next, we’ll build the auth flow,
            theming, and data views.
          </p>
          <div className="mt-6">
            <Button color="primary" radius="full">
              Continue setup
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
