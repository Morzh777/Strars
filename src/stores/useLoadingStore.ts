import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface LoadingState {
  // Глобальные состояния загрузки
  isGlobalLoading: boolean
  globalLoadingMessage: string
  
  // Специфичные состояния загрузки
  loadingStates: Record<string, boolean>
  loadingMessages: Record<string, string>
  
  // Действия для глобальной загрузки
  setGlobalLoading: (loading: boolean, message?: string) => void
  clearGlobalLoading: () => void
  
  // Действия для специфичной загрузки
  setLoading: (key: string, loading: boolean, message?: string) => void
  clearLoading: (key: string) => void
  isLoading: (key: string) => boolean
}

export const useLoadingStore = create<LoadingState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Начальное состояние
      isGlobalLoading: false,
      globalLoadingMessage: '',
      loadingStates: {},
      loadingMessages: {},
      
      // Глобальная загрузка
      setGlobalLoading: (loading: boolean, message = '') => 
        set({ 
          isGlobalLoading: loading, 
          globalLoadingMessage: message 
        }, false, 'setGlobalLoading'),
      
      clearGlobalLoading: () => 
        set({ 
          isGlobalLoading: false, 
          globalLoadingMessage: '' 
        }, false, 'clearGlobalLoading'),
      
      // Специфичная загрузка
      setLoading: (key: string, loading: boolean, message = '') =>
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading
          },
          loadingMessages: {
            ...state.loadingMessages,
            [key]: message
          }
        }), false, `setLoading:${key}`),
      
      clearLoading: (key: string) =>
        set((state) => {
          const newLoadingStates = { ...state.loadingStates }
          const newLoadingMessages = { ...state.loadingMessages }
          delete newLoadingStates[key]
          delete newLoadingMessages[key]
          
          return {
            loadingStates: newLoadingStates,
            loadingMessages: newLoadingMessages
          }
        }, false, `clearLoading:${key}`),
      
      // Геттеры
      isLoading: (key: string) => {
        const state = get()
        return state.loadingStates[key] || false
      },
      
    })),
    {
      name: 'loading-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

// Константы для ключей загрузки
export const LOADING_KEYS = {
  AUTH_LOGIN: 'auth.login',
  AUTH_REGISTER: 'auth.register',
  USER_PROFILE: 'user.profile',
  RATING_VOTE: 'rating.vote',
  RATING_PURCHASE: 'rating.purchase',
  POSTS_LOAD: 'posts.load',
  POSTS_CREATE: 'posts.create',
} as const

export type LoadingKey = typeof LOADING_KEYS[keyof typeof LOADING_KEYS]
