'use client';

import { useState, useEffect, useCallback } from 'react';

import type { IInfiniteScrollOptions, IInfiniteScrollReturn } from '@/types/infiniteScroll';
import { IUserCard } from '@/types/User. types';

export function useInfiniteScroll({
  initialLimit = 25,
  orderBy = 'starsCount',
  orderDirection = 'desc'
}: IInfiniteScrollOptions = {}): IInfiniteScrollReturn {
  const [cards, setCards] = useState<IUserCard[]>([]);
  const [loading, setLoading] = useState(true); // Начинаем с true для показа скелетонов
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchCards = useCallback(async (currentOffset: number, isRefresh = false) => {
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
  }, [initialLimit, orderBy, orderDirection]); // Убираем loading из зависимостей

  // Загрузка первой порции данных
  useEffect(() => {
    if (!hasInitialized) {
      fetchCards(0, true);
      setHasInitialized(true);
    }
  }, [fetchCards, hasInitialized]); // Добавляем fetchCards в зависимости

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
