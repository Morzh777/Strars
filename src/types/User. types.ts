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


