'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserCard } from '@/types/userCard';

interface UseInfiniteScrollOptions {
  initialLimit?: number;
  orderBy?: 'createdAt' | 'starsCount' | 'globalRank';
  orderDirection?: 'asc' | 'desc';
}

interface UseInfiniteScrollReturn {
  cards: UserCard[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  totalUsers: number;
  loadMore: () => void;
  refresh: () => void;
}

export function useInfiniteScroll({
  initialLimit = 25,
  orderBy = 'starsCount',
  orderDirection = 'desc'
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchCards = useCallback(async (currentOffset: number, isRefresh = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/users?limit=${initialLimit}&offset=${currentOffset}&orderBy=${orderBy}&orderDirection=${orderDirection}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }

      const result = await response.json();
      const newCards = result.data || [];
      
      // Обновляем totalUsers из meta
      if (result.meta?.totalUsers) {
        setTotalUsers(result.meta.totalUsers);
      }
      
      if (isRefresh) {
        setCards(newCards);
        setOffset(newCards.length);
      } else {
        setCards(prev => [...prev, ...newCards]);
        setOffset(prev => prev + newCards.length);
      }
      
      // Проверяем есть ли еще данные
      setHasMore(result.meta?.hasMore ?? newCards.length === initialLimit);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [initialLimit, orderBy, orderDirection, loading]);

  // Загрузка первой порции данных
  useEffect(() => {
    fetchCards(0, true);
  }, [orderBy, orderDirection]); // Перезагружаем при изменении сортировки

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchCards(offset);
    }
  }, [fetchCards, offset, loading, hasMore]);

  const refresh = useCallback(() => {
    setOffset(0);
    fetchCards(0, true);
  }, [fetchCards]);

  return {
    cards,
    loading,
    hasMore,
    error,
    totalUsers,
    loadMore,
    refresh
  };
}
