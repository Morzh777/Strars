import { ThemeCard, ThemeHeading, ThemePage, ThemeText } from "@/components/ui/ThemeComponents";

// Серверный компонент страницы настроек
export default function SettingsPage() {
  return (
    <ThemePage className="min-h-screen p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <ThemeHeading level={1} className="text-3xl mb-8 text-center">
          ⚙️ Мои настройки
        </ThemeHeading>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Профиль */}
          <ThemeCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">👤</div>
              <ThemeHeading level={2} className="text-xl">
                Профиль
              </ThemeHeading>
            </div>
            
            <ThemeText variant="secondary" className="mb-4">
              Управление личной информацией
            </ThemeText>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Имя пользователя</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Email</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2">
                <ThemeText>Дата регистрации</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
            </div>
          </ThemeCard>

          {/* Безопасность */}
          <ThemeCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🔒</div>
              <ThemeHeading level={2} className="text-xl">
                Безопасность
              </ThemeHeading>
            </div>
            
            <ThemeText variant="secondary" className="mb-4">
              Настройки безопасности аккаунта
            </ThemeText>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Смена пароля</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Двухфакторная аутентификация</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2">
                <ThemeText>Активные сессии</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
            </div>
          </ThemeCard>

          {/* Уведомления */}
          <ThemeCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🔔</div>
              <ThemeHeading level={2} className="text-xl">
                Уведомления
              </ThemeHeading>
            </div>
            
            <ThemeText variant="secondary" className="mb-4">
              Настройки уведомлений
            </ThemeText>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Email уведомления</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Push уведомления</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2">
                <ThemeText>SMS уведомления</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
            </div>
          </ThemeCard>

          {/* Приватность */}
          <ThemeCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🛡️</div>
              <ThemeHeading level={2} className="text-xl">
                Приватность
              </ThemeHeading>
            </div>
            
            <ThemeText variant="secondary" className="mb-4">
              Настройки приватности
            </ThemeText>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Публичный профиль</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-divider">
                <ThemeText>Показывать статистику</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
              <div className="flex justify-between items-center py-2">
                <ThemeText>Доступ к данным</ThemeText>
                <ThemeText variant="muted">Недоступно</ThemeText>
              </div>
            </div>
          </ThemeCard>
        </div>

        {/* Информационное сообщение */}
        <ThemeCard className="mt-8 text-center py-8">
          <div className="text-4xl opacity-50 mb-4">
            🚧
          </div>
          
          <ThemeHeading level={2} className="text-xl mb-3">
            Функционал в разработке
          </ThemeHeading>
          
          <ThemeText variant="secondary" className="max-w-md mx-auto">
            Страница настроек находится в активной разработке. 
            Скоро здесь появится возможность настраивать профиль, 
            безопасность и уведомления.
          </ThemeText>
        </ThemeCard>
      </div>
    </ThemePage>
  );
}

// Метаданные страницы для SEO
export const metadata = {
  title: "Мои настройки - Stars",
  description: "Управление настройками профиля, безопасности и уведомлений",
};
