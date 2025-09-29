import { UserCard } from "@/types/userCard";
import prisma from "@/utils/prisma";

// Мок-данные для разработки
const mockUserCards: UserCard[] = [
  {
    name: "Наташа Рачева",
    username: "natasha_racheva",
    avatar: "https://heroui.com/avatars/avatar-1.png",
    description: "Главный специалист ПИК реновация. Улучшаю городскую среду! 🏗️",
    tags: "#ПИК #Реновация #Инженер ⭐",
    starsCount: 1500,
    maxStars: 5000,
    globalRank: 12,
  },
  {
    name: "Алексей Морозов",
    username: "alex_morozov",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    description: "Senior Frontend Developer в Яндексе. Создаю крутые интерфейсы! 💻",
    tags: "#Frontend #React #TypeScript ⚡",
    starsCount: 2800,
    maxStars: 5000,
    globalRank: 5,
  },
  {
    name: "Мария Петрова",
    username: "maria_petrova",
    avatar: "https://heroui.com/avatars/avatar-3.png",
    description: "UX/UI Designer в Тинькофф. Делаю продукты удобными и красивыми! 🎨",
    tags: "#Design #UX #Figma 🎯",
    starsCount: 2200,
    maxStars: 5000,
    globalRank: 8,
  },
];

// Функция для получения всех пользователей (для главной страницы)
export const getAllUserCards = async (): Promise<UserCard[]> => {
  if (process.env.NODE_ENV === "development") {
    return mockUserCards;
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        name: true,
        email: true,
        image: true,
        description: true,
        tags: true,
        starsCount: true,
        maxStars: true,
        globalRank: true,
      },
    });

    // Transform User data to UserCard format
    const cards: UserCard[] = users.map(user => ({
      name: user.name || 'Пользователь',
      username: user.email?.split('@')[0] || 'user',
      avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=3b82f6&color=fff`,
      description: user.description || 'Участник сообщества STARS',
      tags: user.tags || '#STARS #Участник ⭐',
      starsCount: user.starsCount || 0,
      maxStars: user.maxStars || 5000,
      globalRank: user.globalRank || 0,
    }));

    return cards;
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return mockUserCards;
  }
};

// Функция для получения топ-3 пользователей (для страницы логина)
export const getLoginUserCards = async (): Promise<UserCard[]> => {
  if (process.env.NODE_ENV === "development") {
    return mockUserCards;
  }

  try {
    const users = await prisma.user.findMany({ 
      take: 3, 
      orderBy: { createdAt: 'desc' }, 
      select: { 
        name: true, 
        email: true, 
        image: true, 
        description: true, 
        tags: true, 
        starsCount: true, 
        maxStars: true, 
        globalRank: true 
      } 
    });

    const cards: UserCard[] = users.map((user, index) => ({
      name: user.name || 'Пользователь',
      username: user.email?.split('@')[0] || 'user',
      avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=3b82f6&color=fff`,
      description: user.description || "Участник сообщества STARS",
      tags: user.tags || "#STARS #Участник ⭐",
      starsCount: user.starsCount || Math.floor(Math.random() * 3000) + 1000,
      maxStars: user.maxStars || 5000,
      globalRank: user.globalRank || index + 1,
    }));

    return cards;
  } catch (error) {
    console.error('Error fetching login user cards:', error);
    return mockUserCards;
  }
};
