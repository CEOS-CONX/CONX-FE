'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  endpoint: string;
  initialItems: T[];
  initialIsLastPage: boolean;
  params: URLSearchParams;
  size?: number;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll<T>({
  endpoint,
  initialItems,
  initialIsLastPage,
  params,
  size = 12,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(!initialIsLastPage);

  const pageRef = useRef(0);
  const paramsKeyRef = useRef(params.toString());
  const abortControllerRef = useRef<AbortController | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    const currentParamsKey = params.toString();

    if (paramsKeyRef.current === currentParamsKey && items === initialItems) {
      return;
    }

    paramsKeyRef.current = currentParamsKey;
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const query = new URLSearchParams(params);
    query.set('page', '0');
    query.set('size', String(size));

    setIsLoading(true);

    fetch(`${endpoint}?${query}`, { signal: controller.signal })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.payload?.content) {
          setItems(data.payload.content);
          setHasMore(!(data.payload.last ?? data.payload.content.length < size));
          pageRef.current = 0;
        }
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, params, size]);

  const fetchNextPage = useCallback(() => {
    if (isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const nextPage = pageRef.current + 1;

    const query = new URLSearchParams(params);
    query.set('page', String(nextPage));
    query.set('size', String(size));

    fetch(`${endpoint}?${query}`, { signal: controller.signal })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.payload?.content) {
          setItems((prev) => [...prev, ...data.payload.content]);
          setHasMore(!(data.payload.last ?? data.payload.content.length < size));
          pageRef.current = nextPage;
        }
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      })
      .finally(() => {
        setIsLoadingMore(false);
        isLoadingMoreRef.current = false;
      });
  }, [endpoint, params, size]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMoreRef.current && !isLoading) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, isLoading]);

  return { items, isLoading, isLoadingMore, hasMore, sentinelRef };
}
