export interface AppUser {
  id: string;
  name: string;
  avatar?: string; // UI avatar URL
  image?: string; // NextAuth image field
  starsCount?: number;
}

export interface UserProfileProps {
  user: AppUser;
  onLogout: () => void;
}

export interface UserCardSkeletonProps {
  className?: string;
}

export interface IUserCard {
  name: string;
  username: string;
  avatar: string;
  description: string;
  tags: string;
  starsCount: number;
  maxStars: number;
  globalRank: number;
}

export interface IGetUserCardsOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'starsCount' | 'globalRank';
  orderDirection?: 'asc' | 'desc';
  activeOnly?: boolean;
}

// ===== ТИПЫ РЕЙТИНГА =====

// Базовый интерфейс для рейтинга пользователя
export interface UserRating {
  id: string;
  name: string;
  stars: number;
  rank: number;
  isActive: boolean;
  dailyActivity: number;
  weeklyActivity: number;
  monthlyActivity: number;
  totalActivity: number;
  joinDate: string;
  avatar?: string;
}

// Достижение пользователя
export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  progress?: number; // 0-100 для незавершенных достижений
  reward?: number; // бонусные звезды за получение
}

// Статистика активности пользователя
export interface UserActivityStats {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
  streak: number; // текущая серия дней активности
  longestStreak: number; // самая длинная серия
}

// Полный профиль рейтинга пользователя (для страницы /rating)
export interface UserRatingProfile extends UserRating {
  achievements: UserAchievement[];
  activityStats: UserActivityStats;
  nextRankStars?: number; // сколько звезд до следующего ранга
  rankProgress?: number; // прогресс до следующего ранга (0-100)
}

// Опции для запросов рейтинга
export interface GetRatingOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'stars' | 'rank' | 'dailyActivity' | 'weeklyActivity';
  orderDirection?: 'asc' | 'desc';
  activeOnly?: boolean;
  minStars?: number;
  maxStars?: number;
}

// Ответ API для получения рейтинга
export interface RatingResponse {
  users: UserRating[];
  total: number;
  hasMore: boolean;
  currentUserRank?: number;
}

// Ответ API для личного рейтинга
export interface PersonalRatingResponse {
  profile: UserRatingProfile;
  globalRank: number;
  totalUsers: number;
}

