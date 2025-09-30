import type { IUserCard } from './User. types';

export interface IInfiniteScrollOptions {
  initialLimit?: number;
  orderBy?: 'createdAt' | 'starsCount' | 'globalRank';
  orderDirection?: 'asc' | 'desc';
}

export interface IInfiniteScrollReturn {
  cards: IUserCard[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  totalUsers: number;
  loadMore: () => void;
  refresh: () => void;
}
