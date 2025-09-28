
import prisma from "@/utils/prisma";

export interface LoginUserCard {
  name: string;
  username: string;
  avatar: string;
  description: string;
  tags: string;
  starsCount: number;
  maxStars: number;
  globalRank: number;
}

// Мок-данные для разработки
const mockLoginUserCards: LoginUserCard[] = [
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

// Серверная функция для получения карточек пользователей
const getLoginUserCards = async (): Promise<LoginUserCard[]> => 
  process.env.NODE_ENV === "development" ? mockLoginUserCards : 
  await prisma.user.findMany({ 
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
    })
    .then(users => users.map((user, index) => ({
      name: user.name || 'Пользователь',
      username: user.email?.split('@')[0] || 'user',
      avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=3b82f6&color=fff`,
      description: user.description || "Участник сообщества STARS",
      tags: user.tags || "#STARS #Участник ⭐",
      starsCount: user.starsCount || Math.floor(Math.random() * 3000) + 1000,
      maxStars: user.maxStars || 5000,
      globalRank: user.globalRank || index + 1,
    })))
    .catch(() => mockLoginUserCards);

export async function GET() {
  try {
    const cards = await getLoginUserCards();
    return Response.json(cards);
  } catch (error) {
    console.error("❌ API Error:", error);
    return Response.json(mockLoginUserCards);
  }
}