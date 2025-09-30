"use client";

import {
  ThemeCard,
  ThemePage,
  ThemeText,
} from "@/components/ui/ThemeComponents";
import UserCard from "@/components/ui/UserCard";
import UserCardSkeleton from "@/components/ui/UserCardSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Клиентский компонент главной страницы с бесконечным скроллом
export default function Home() {
  const {
    cards,
    loading,
    hasMore,
    error,
    totalUsers,
    loadMore,
    refresh
  } = useInfiniteScroll({
    initialLimit: 25,
    orderBy: 'starsCount',
    orderDirection: 'desc'
  });

  // Intersection Observer для автозагрузки при скролле
  const loadMoreRef = useIntersectionObserver({
    onIntersect: loadMore,
    enabled: !loading && hasMore
  });

  if (error) {
    return (
      <ThemePage className="flex flex-col items-center justify-center min-h-screen pt-20 pb-24 px-4">
        <ThemeCard className="max-w-md w-full text-center space-y-6">
          <ThemeText className="text-red-500">
            ❌ Ошибка загрузки: {error}
          </ThemeText>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </ThemeCard>
      </ThemePage>
    );
  }

  return (
    <ThemePage className="flex flex-col items-center justify-start min-h-screen pt-20 pb-24 px-4">
      <div className="w-full space-y-6">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Рейтинг STARS</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Топ участников по количеству звезд
          </p>
        </div>

        {/* Список карточек */}
        <div className="space-y-6">
          {cards.map((card, index) => (
            <UserCard
              key={`${card.username}-${index}`}
              name={card.name}
              username={card.username}
              avatar={card.avatar}
              description={card.description}
              tags={card.tags}
              starsCount={card.starsCount}
              maxStars={card.maxStars}
              globalRank={card.globalRank}
              totalUsers={totalUsers}
            />
          ))}

          {/* Скелетоны во время загрузки */}
          {loading && cards.length === 0 && (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <UserCardSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          )}
        </div>

        {/* Индикатор для бесконечного скролла */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Загружаем еще...</span>
              </div>
            )}
          </div>
        )}
        {/* Пустое состояние */}
        {!loading && cards.length === 0 && !error && (
          <div className="text-center py-12">
            <ThemeText className="text-gray-500">
              😔 Пользователи не найдены
            </ThemeText>
          </div>
        )}
      </div>
    </ThemePage>
  );
}
