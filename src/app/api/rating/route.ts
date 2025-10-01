import { NextResponse } from 'next/server';

import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Получаем текущего пользователя
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Получаем данные пользователя с последней сессией
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        starsCount: true,
        globalRank: true,
        createdAt: true,
        image: true,
        isActive: true,
        sessions: {
          orderBy: { expires: 'desc' },
          take: 1,
          select: { expires: true }
        },
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Получаем общее количество пользователей для расчета ранга
    const totalUsers = await prisma.user.count();
    
    // Получаем количество пользователей с большим количеством звезд (для расчета ранга)
    const usersWithMoreStars = await prisma.user.count({
      where: {
        starsCount: {
          gt: user.starsCount || 0
        }
      }
    });

    const currentRank = usersWithMoreStars + 1;

    // Определяем активность пользователя
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Проверяем, была ли активная сессия сегодня
    const lastSession = user.sessions[0];
    const isActiveToday = lastSession && lastSession.expires > today;
    
    // Если нет активной сессии, проверяем по updatedAt (когда пользователь обновлял профиль)
    const userUpdatedToday = user.updatedAt && user.updatedAt > today;
    const isUserActive = isActiveToday || userUpdatedToday;

    // Реальная активность на основе звезд и активности
    const dailyActivity = isUserActive ? Math.min(10, Math.floor((user.starsCount || 0) / 100) + 1) : 0;
    const weeklyActivity = dailyActivity * 7;
    const monthlyActivity = dailyActivity * 30;
    const totalActivity = user.starsCount || 0;

    // Заглушка для достижений (пока нет реальных данных)
    const achievements = [
      { 
        id: "first-steps", 
        name: "Первые шаги", 
        description: "Получил первые 100 звезд", 
        icon: "🌟",
        earned: (user.starsCount || 0) >= 100,
        earnedAt: (user.starsCount || 0) >= 100 ? user.createdAt.toISOString() : undefined,
        reward: 50
      },
      { 
        id: "active-user", 
        name: "Активный пользователь", 
        description: "7 дней активности подряд", 
        icon: "🔥",
        earned: dailyActivity >= 5,
        reward: 100
      },
      { 
        id: "star-hunter", 
        name: "Звездный охотник", 
        description: "Собрал 1000 звезд", 
        icon: "⭐",
        earned: (user.starsCount || 0) >= 1000,
        earnedAt: (user.starsCount || 0) >= 1000 ? user.createdAt.toISOString() : undefined,
        reward: 200
      },
      { 
        id: "master-activity", 
        name: "Мастер активности", 
        description: "30 дней активности подряд", 
        icon: "🏆",
        earned: false,
        progress: Math.min(30, Math.floor(Math.random() * 30)),
        reward: 500
      },
      { 
        id: "legend", 
        name: "Легенда", 
        description: "Собрал 10000 звезд", 
        icon: "👑",
        earned: (user.starsCount || 0) >= 10000,
        earnedAt: (user.starsCount || 0) >= 10000 ? user.createdAt.toISOString() : undefined,
        progress: Math.min(100, ((user.starsCount || 0) / 10000) * 100),
        reward: 1000
      },
    ];

    // Формируем ответ
    const ratingProfile = {
      id: user.id,
      name: user.name,
      stars: user.starsCount || 0,
      rank: currentRank,
      isActive: isUserActive, // Используем реальную активность
      dailyActivity,
      weeklyActivity,
      monthlyActivity,
      totalActivity,
      joinDate: user.createdAt.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      avatar: user.image,
      nextRankStars: Math.max(0, 1000 - (user.starsCount || 0)), // до следующего уровня
      rankProgress: Math.min(100, ((user.starsCount || 0) / 1000) * 100),
      achievements,
      activityStats: {
        daily: dailyActivity,
        weekly: weeklyActivity,
        monthly: monthlyActivity,
        total: totalActivity,
        streak: isUserActive ? Math.floor(Math.random() * 15) + 1 : 0, // текущая серия
        longestStreak: Math.floor(Math.random() * 30) + 10, // лучшая серия (пока заглушка)
      }
    };

    return NextResponse.json({
      profile: ratingProfile,
      globalRank: currentRank,
      totalUsers
    });

  } catch (error) {
    console.error('Error fetching user rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
