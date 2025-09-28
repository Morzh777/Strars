import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface AuthResult {
  success: boolean
  message: string
}

interface AuthState {
  // Результаты операций
  loginResult: AuthResult | null
  registrationResult: AuthResult | null
  
  // Состояния загрузки (интеграция с Loading store)
  isLoginSubmitting: boolean
  isRegistrationSubmitting: boolean
  
  // Действия для результатов
  setLoginResult: (result: AuthResult | null) => void
  setRegistrationResult: (result: AuthResult | null) => void
  
  // Действия для состояний загрузки
  setLoginSubmitting: (submitting: boolean) => void
  setRegistrationSubmitting: (submitting: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    subscribeWithSelector((set) => ({
      // Начальное состояние
      loginResult: null,
      registrationResult: null,
      isLoginSubmitting: false,
      isRegistrationSubmitting: false,
      
      // Результаты операций
      setLoginResult: (result: AuthResult | null) => 
        set({ loginResult: result }, false, 'setLoginResult'),
      
      setRegistrationResult: (result: AuthResult | null) => 
        set({ registrationResult: result }, false, 'setRegistrationResult'),
      
      // Состояния загрузки
      setLoginSubmitting: (submitting: boolean) => 
        set({ isLoginSubmitting: submitting }, false, 'setLoginSubmitting'),
      
      setRegistrationSubmitting: (submitting: boolean) => 
        set({ isRegistrationSubmitting: submitting }, false, 'setRegistrationSubmitting'),
    })),
    {
      name: 'auth-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)
