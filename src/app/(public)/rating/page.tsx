import { cookies } from 'next/headers';

import { ThemeCard, ThemeHeading, ThemePage, ThemeText } from "@/components/ui/ThemeComponents";
import type { PersonalRatingResponse } from "@/types/User. types";

// Серверный компонент страницы личного рейтинга
export default async function RatingPage() {
  // Получаем реальные данные рейтинга пользователя
  let ratingData: PersonalRatingResponse | null = null;
  
  try {
    const cookieStore = cookies();
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/rating`, {
      headers: {
        'Cookie': cookieStore.toString()
      }
    });
    
    if (response.ok) {
      ratingData = await response.json();
    }
  } catch (error) {
    console.error('Error fetching rating data:', error);
  }

  // Если не удалось загрузить данные, показываем заглушку
  if (!ratingData) {
    return (
      <ThemePage className="min-h-screen p-4 pt-16">
        <div className="max-w-4xl mx-auto">
          <ThemeCard className="p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <ThemeHeading level={1} className="text-2xl mb-4">
              Не удалось загрузить данные рейтинга
            </ThemeHeading>
            <ThemeText variant="secondary">
              Попробуйте обновить страницу или войти в систему заново
            </ThemeText>
          </ThemeCard>
        </div>
      </ThemePage>
    );
  }

  const currentUser = ratingData.profile;

  return (
    <ThemePage className="min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <ThemeHeading level={1} className="text-4xl mb-4 text-center">
          🏆 Мой рейтинг
        </ThemeHeading>
        
        <div className="text-center mb-8">
          <ThemeText variant="secondary" className="max-w-2xl mx-auto mb-4">
            Ваш личный рейтинг и статистика активности. 
            Получайте звезды за ежедневную активность и выполнение заданий.
          </ThemeText>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Место #{ratingData.globalRank} из {ratingData.totalUsers.toLocaleString()}
            </span>
          </div>
        </div>

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
                {currentUser.stars.toLocaleString()} {currentUser.nextRankStars ? `(+${currentUser.nextRankStars} до следующего уровня)` : ''}
              </ThemeText>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(100, currentUser.rankProgress || 0)}%` }}
              ></div>
            </div>
            {currentUser.rankProgress && (
              <div className="text-center mt-2">
                <ThemeText variant="muted" className="text-sm">
                  Прогресс до следующего уровня: {Math.round(currentUser.rankProgress)}%
                </ThemeText>
              </div>
            )}
          </div>
        </ThemeCard>

        {/* Статистика активности */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ThemeCard className="p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <ThemeHeading level={2} className="text-2xl mb-1">
              {currentUser.activityStats.daily}
            </ThemeHeading>
            <ThemeText variant="secondary">Сегодня</ThemeText>
          </ThemeCard>
          
          <ThemeCard className="p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <ThemeHeading level={2} className="text-2xl mb-1">
              {currentUser.activityStats.weekly}
            </ThemeHeading>
            <ThemeText variant="secondary">За неделю</ThemeText>
          </ThemeCard>
          
          <ThemeCard className="p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <ThemeHeading level={2} className="text-2xl mb-1">
              {currentUser.activityStats.monthly}
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

        {/* Серии активности */}
        <ThemeCard className="p-6 mb-8">
          <ThemeHeading level={2} className="text-xl mb-4 flex items-center gap-2">
            <span>🔥</span>
            Серии активности
          </ThemeHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <ThemeHeading level={3} className="text-2xl mb-1">
                {currentUser.activityStats.streak}
              </ThemeHeading>
              <ThemeText variant="secondary">Текущая серия</ThemeText>
              <ThemeText variant="muted" className="text-sm mt-1">
                дней подряд
              </ThemeText>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <ThemeHeading level={3} className="text-2xl mb-1">
                {currentUser.activityStats.longestStreak}
              </ThemeHeading>
              <ThemeText variant="secondary">Лучшая серия</ThemeText>
              <ThemeText variant="muted" className="text-sm mt-1">
                дней подряд
              </ThemeText>
            </div>
          </div>
        </ThemeCard>

        {/* Достижения */}
        <ThemeCard className="p-6 mb-8">
          <ThemeHeading level={2} className="text-2xl mb-6 flex items-center gap-2">
            <span>🏆</span>
            Достижения
          </ThemeHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border transition-all ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${achievement.earned ? '' : 'opacity-30'}`}>
                    {achievement.earned ? achievement.icon : '🔒'}
                  </div>
                  
                  <div className="flex-grow">
                    <ThemeText className={`font-semibold ${achievement.earned ? '' : 'text-gray-500'}`}>
                      {achievement.name}
                    </ThemeText>
                    <ThemeText variant="muted" className="text-sm">
                      {achievement.description}
                    </ThemeText>
                    
                    {/* Прогресс для незавершенных достижений */}
                    {!achievement.earned && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Прогресс</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    {achievement.earned ? (
                      <div className="text-green-500 text-sm font-semibold">
                        ✓ Получено
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        🔒 Заблокировано
                      </div>
                    )}
                    
                    {achievement.reward && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        +{achievement.reward} ⭐
                      </div>
                    )}
                  </div>
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
