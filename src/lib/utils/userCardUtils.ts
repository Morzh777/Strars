import { IUserCard, IGetUserCardsOptions } from "@/types/User. types";
import prisma from "@/utils/prisma";

// Универсальная функция для получения карточек пользователей
export const getUserCards = async (options: IGetUserCardsOptions = {}): Promise<{ cards: IUserCard[]; totalUsers: number }> => {
  const {
    limit,
    offset = 0,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    activeOnly = true
  } = options;

  try {
    const whereClause = activeOnly ? { isActive: true } : undefined;

    // Выполняем оба запроса параллельно в транзакции
    const [users, totalUsers] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [orderBy]: orderDirection },
        select: {
          name: true,
          email: true,
          image: true,
          description: true,
          tags: true,
          starsCount: true,
          maxStars: true,
        },
      }),
      prisma.user.count({
        where: whereClause,
      })
    ]);

    // Рассчитываем динамический globalRank для каждого пользователя
    const cardsWithRank = await Promise.all(
      users.map(async (user, index) => {
        let globalRank: number;

        if (orderBy === 'starsCount' && orderDirection === 'desc') {
          // При сортировке по звездам позиция = смещение + индекс + 1
          globalRank = offset + index + 1;
        } else {
          // Для других сортировок рассчитываем реальную позицию по звездам
          const usersWithMoreStars = await prisma.user.count({
            where: {
              ...(activeOnly ? { isActive: true } : {}),
              starsCount: {
                gt: user.starsCount || 0
              }
            }
          });
          globalRank = usersWithMoreStars + 1;
        }

        return {
          name: user.name || 'Пользователь',
          username: user.email?.split('@')[0] || 'user',
          avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=3b82f6&color=fff`,
          description: user.description || 'Участник сообщества STARS',
          tags: user.tags || '#STARS #Участник ⭐',
          starsCount: user.starsCount || 0,
          maxStars: user.maxStars || 5000,
          globalRank,
        };
      })
    );

    return { cards: cardsWithRank, totalUsers };
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return { cards: [], totalUsers: 0 };
  }
};

