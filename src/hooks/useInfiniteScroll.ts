"use client";

import { useEffect, useRef } from "react";

type InfiniteScrollOptions = {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
};

export function useInfiniteScroll({
  isLoading,
  hasMore,
  onLoadMore,
  rootMargin = "200px",
}: InfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, rootMargin]);

  return { sentinelRef };
}
