import { ThemeCard, ThemeHeading, ThemePage, ThemeText } from "@/components/ui/ThemeComponents";

// Серверный компонент страницы личного рейтинга
export default function RatingPage() {
  // Заглушка данных текущего пользователя
  const currentUser = {
    name: "Текущий пользователь",
    stars: 8750,
    rank: 5,
    isActive: true,
    dailyActivity: 6,
    weeklyActivity: 42,
    monthlyActivity: 180,
    totalActivity: 1250,
    joinDate: "15 января 2024",
    achievements: [
      { name: "Первые шаги", description: "Получил первые 100 звезд", earned: true },
      { name: "Активный пользователь", description: "7 дней активности подряд", earned: true },
      { name: "Звездный охотник", description: "Собрал 1000 звезд", earned: true },
      { name: "Мастер активности", description: "30 дней активности подряд", earned: false },
      { name: "Легенда", description: "Собрал 10000 звезд", earned: false },
    ]
  };

  return (
    <ThemePage className="min-h-screen p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <ThemeHeading level={1} className="text-4xl mb-8 text-center">
          🏆 Мой рейтинг
        </ThemeHeading>
        
        <ThemeText variant="secondary" className="text-center mb-8 max-w-2xl mx-auto">
          Ваш личный рейтинг и статистика активности. 
          Получайте звезды за ежедневную активность и выполнение заданий.
        </ThemeText>

        {/* Основная информация пользователя */}
        <ThemeCard className="p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-grow">
              <ThemeHeading level={2} className="text-2xl mb-2">
                {currentUser.name}
              </ThemeHeading>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏅</span>
                  <ThemeText className="font-semibold">
                    Место #{currentUser.rank}
                  </ThemeText>
                </div>
                
                {currentUser.isActive ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Активен сегодня
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Неактивен
                  </span>
                )}
              </div>
              
              <ThemeText variant="muted">
                Участник с {currentUser.joinDate}
              </ThemeText>
            </div>
          </div>
          
          {/* Полоса прогресса звезд */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <ThemeText className="font-semibold">⭐ Звезды</ThemeText>
              <ThemeText variant="muted">
                {currentUser.stars.toLocaleString()} / 10,000
              </ThemeText>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${(currentUser.stars / 10000) * 100}%` }}
              ></div>
            </div>
          </div>
        </ThemeCard>

        {/* Статистика активности */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ThemeCard className="p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <ThemeHeading level={2} className="text-2xl mb-1">
              {currentUser.dailyActivity}
            </ThemeHeading>
            <ThemeText variant="secondary">Сегодня</ThemeText>
          </ThemeCard>
          
          <ThemeCard className="p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <ThemeHeading level={2} className="text-2xl mb-1">
              {currentUser.weeklyActivity}
            </ThemeHeading>
            <ThemeText variant="secondary">За неделю</ThemeText>
          </ThemeCard>
          
          <ThemeCard className="p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <ThemeHeading level={2} className="text-2xl mb-1">
              {currentUser.monthlyActivity}
            </ThemeHeading>
            <ThemeText variant="secondary">За месяц</ThemeText>
          </ThemeCard>
          
          <ThemeCard className="p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <ThemeHeading level={2} className="text-2xl mb-1">
              {currentUser.stars.toLocaleString()}
            </ThemeHeading>
            <ThemeText variant="secondary">Всего звезд</ThemeText>
          </ThemeCard>
        </div>

        {/* Достижения */}
        <ThemeCard className="p-6 mb-8">
          <ThemeHeading level={2} className="text-2xl mb-6 flex items-center gap-2">
            <span>🏆</span>
            Достижения
          </ThemeHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border transition-all ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${achievement.earned ? '' : 'opacity-30'}`}>
                    {achievement.earned ? '🏆' : '🔒'}
                  </div>
                  
                  <div className="flex-grow">
                    <ThemeText className={`font-semibold ${achievement.earned ? '' : 'text-gray-500'}`}>
                      {achievement.name}
                    </ThemeText>
                    <ThemeText variant="muted" className="text-sm">
                      {achievement.description}
                    </ThemeText>
                  </div>
                  
                  {achievement.earned && (
                    <div className="text-green-500 text-sm font-semibold">
                      ✓ Получено
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ThemeCard>

        {/* Информация о системе */}
        <ThemeCard className="p-6">
          <ThemeHeading level={2} className="text-xl mb-4">
            📋 Как работает рейтинг
          </ThemeHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ThemeHeading level={3} className="text-lg mb-3 flex items-center gap-2">
                <span>⭐</span>
                Звезды
              </ThemeHeading>
              <ul className="space-y-2 text-sm text-default-600">
                <li>• Получаются за выполнение заданий</li>
                <li>• Накапливаются и не сгорают</li>
                <li>• Основной показатель рейтинга</li>
                <li>• До 10 звезд в день за активность</li>
              </ul>
            </div>
            
            <div>
              <ThemeHeading level={3} className="text-lg mb-3 flex items-center gap-2">
                <span>🏆</span>
                Достижения
              </ThemeHeading>
              <ul className="space-y-2 text-sm text-default-600">
                <li>• Разблокируются при выполнении условий</li>
                <li>• Дают бонусные звезды</li>
                <li>• Показывают ваш прогресс</li>
                <li>• Мотивируют к активности</li>
              </ul>
            </div>
          </div>
        </ThemeCard>

        {/* Информационное сообщение */}
        <ThemeCard className="mt-8 text-center py-8">
          <div className="text-4xl opacity-50 mb-4">
            🚧
          </div>
          
          <ThemeHeading level={2} className="text-xl mb-3">
            Функционал в разработке
          </ThemeHeading>
          
          <ThemeText variant="secondary" className="max-w-md mx-auto">
            Система рейтинга находится в активной разработке. 
            Скоро здесь появится возможность просматривать детальную статистику 
            и сравнивать результаты с другими пользователями.
          </ThemeText>
        </ThemeCard>
      </div>
    </ThemePage>
  );
}

// Метаданные страницы для SEO
export const metadata = {
  title: "Мой рейтинг - Stars",
  description: "Личный рейтинг и статистика активности пользователя",
};
