"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/modals/AuthModal";
import RegistrationModal from "@/components/modals/RegistrationModal";
import Button from "@/components/ui/Button";
import { ThemePage } from "@/components/ui/ThemeComponents";
import UserCard from "@/components/ui/UserCard";
import UserCardSkeleton from "@/components/ui/UserCardSkeleton";
import { useUIStore } from "@/stores/useUIStore";
import type { IUserCard } from "@/types/User. types";

// Страница входа с описанием сайта
export default function LoginPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userCards, setUserCards] = useState<IUserCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Получаем данные карточек из API
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        setIsLoadingCards(true);
        const response = await fetch('/api/users?limit=3&orderBy=createdAt&orderDirection=desc');
        const result = await response.json();
        setUserCards(result.data || result); // Поддерживаем оба формата
        setTotalUsers(result.meta?.totalUsers || 0); // Сохраняем totalUsers
      } catch (error) {
        console.error('❌ Error fetching user cards:', error);
      } finally {
        setIsLoadingCards(false);
      }
    };

    fetchUserCards();
  }, []);
  
  // Автопереключение карточек каждые 4 секунды
  useEffect(() => {
    if (userCards.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % userCards.length);
    }, 4000);   
    
    return () => clearInterval(interval);
  }, [userCards.length]);
  
  // Middleware уже обрабатывает редирект авторизованных пользователей
  
  const { 
    isLoginOpen, 
    isRegistrationOpen,
    openLogin,
    closeLogin,
    closeRegistration,
    switchToLogin,
    switchToRegistration
  } = useUIStore();

  // Показываем скелетон пока загружаются карточки

  return (
    <ThemePage className="flex flex-col items-center justify-center min-h-screen pt-20 pb-24 px-4 overflow-hidden gap-4">
      {/* Заголовок */}
      <div className="w-full max-w-[380px] mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
          STARS
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Покажи свою индивидуальность
        </p>
      </div>
      
      {/* Слайдер карточек пользователей */}
      <div className="relative w-full max-w-[380px] h-[230px]">
        {isLoadingCards ? (
          // Показываем скелетон во время загрузки
          <UserCardSkeleton className="absolute inset-0" />
        ) : (
          userCards.map((card, index) => {
          const offset = index - currentCardIndex;
          const isActive = index === currentCardIndex;

          return (
            <div
              key={card.name}
              className={`absolute inset-0 transition-all duration-500 ease-in-out cursor-pointer ${
                isActive
                  ? "z-30 scale-100 opacity-100"
                  : offset === 1 || (offset === -2 && userCards.length === 3)
                    ? "z-20 scale-95 opacity-60 translate-x-8"
                    : offset === -1 || (offset === 2 && userCards.length === 3)
                      ? "z-20 scale-95 opacity-60 -translate-x-8"
                      : "z-10 scale-90 opacity-30"
              }`}
              onClick={() => setCurrentCardIndex(index)}
            >
              <UserCard
                name={card.name}
                username={card.username}
                avatar={card.avatar}
                description={card.description}
                tags={card.tags}
                starsCount={card.starsCount}
                maxStars={card.maxStars}
                globalRank={card.globalRank}
                totalUsers={totalUsers}
              />
            </div>
          );
        }))}
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-[380px]">
        <Button 
          color="primary" 
          size="lg"
          onPress={switchToRegistration}
          className="font-semibold w-full"
        >
          Создать аккаунт
        </Button>
        
        <Button 
          color="default" 
          size="lg"
          onPress={openLogin}
          className="font-semibold w-full"
        >
          Войти
        </Button>
      </div>
      
      {/* Модальные окна */}
      <AuthModal 
        isOpen={isLoginOpen} 
        onClose={closeLogin} 
        onOpenRegistration={switchToRegistration}
      />
      <RegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={closeRegistration} 
        onOpenLogin={switchToLogin}
      />
      
    </ThemePage>
  );
}
