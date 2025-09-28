import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface UIState {
  // Модальные окна
  isLoginOpen: boolean
  isRegistrationOpen: boolean
  
  // Навигация
  isMenuOpen: boolean
  
  // Видимость паролей
  isLoginPasswordVisible: boolean
  isRegistrationPasswordVisible: boolean
  
  // Действия для модальных окон
  openLogin: () => void
  closeLogin: () => void
  closeRegistration: () => void
  
  // Переключение между модалками
  switchToRegistration: () => void
  switchToLogin: () => void
  
  // Действия для навигации
  toggleMenu: () => void
  
  // Действия для видимости паролей
  toggleLoginPasswordVisibility: () => void
  toggleRegistrationPasswordVisibility: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    subscribeWithSelector((set) => ({
      // Начальное состояние
      isLoginOpen: false,
      isRegistrationOpen: false,
      isMenuOpen: false,
      isLoginPasswordVisible: false,
      isRegistrationPasswordVisible: false,
      
      // Действия для логина
      openLogin: () => set({ isLoginOpen: true, isRegistrationOpen: false }, false, 'openLogin'),
      closeLogin: () => set({ isLoginOpen: false }, false, 'closeLogin'),
      
      // Действия для регистрации
      closeRegistration: () => set({ isRegistrationOpen: false }, false, 'closeRegistration'),
      
      // Переключение между модалками
      switchToRegistration: () => set({ 
        isLoginOpen: false, 
        isRegistrationOpen: true 
      }, false, 'switchToRegistration'),
      
      switchToLogin: () => set({ 
        isRegistrationOpen: false, 
        isLoginOpen: true 
      }, false, 'switchToLogin'),
      
      // Действия для меню
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen }), false, 'toggleMenu'),
      
      // Действия для видимости паролей
      toggleLoginPasswordVisibility: () => set((state) => ({ 
        isLoginPasswordVisible: !state.isLoginPasswordVisible 
      }), false, 'toggleLoginPasswordVisibility'),
      
      toggleRegistrationPasswordVisibility: () => set((state) => ({ 
        isRegistrationPasswordVisible: !state.isRegistrationPasswordVisible 
      }), false, 'toggleRegistrationPasswordVisibility'),
    })),
    {
      name: 'ui-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)
