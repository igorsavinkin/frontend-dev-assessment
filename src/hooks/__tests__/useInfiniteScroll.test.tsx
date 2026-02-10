import { render } from "@testing-library/react";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

let observerCallback: IntersectionObserverCallback | null = null;

class TestIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  disconnect() {}

  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {}
}

function TestComponent({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const { sentinelRef } = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore,
  });

  useEffect(() => {
    if (!sentinelRef.current) return;
  }, [sentinelRef]);

  return <div data-testid="sentinel" ref={sentinelRef} />;
}

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    observerCallback = null;
    globalThis.IntersectionObserver = TestIntersectionObserver;
  });

  it("calls onLoadMore when intersecting and not loading", () => {
    const onLoadMore = vi.fn();
    const { getByTestId } = render(
      <TestComponent
        isLoading={false}
        hasMore={true}
        onLoadMore={onLoadMore}
      />,
    );

    const target = getByTestId("sentinel");
    observerCallback?.(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        },
      ],
      {} as IntersectionObserver,
    );

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does not call onLoadMore while loading", () => {
    const onLoadMore = vi.fn();
    const { getByTestId } = render(
      <TestComponent isLoading={true} hasMore={true} onLoadMore={onLoadMore} />,
    );

    const target = getByTestId("sentinel");
    observerCallback?.(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        },
      ],
      {} as IntersectionObserver,
    );

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
