"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import AuthModal from "@/components/modals/AuthModal";
import RegistrationModal from "@/components/modals/RegistrationModal";
import Button from "@/components/ui/Button";
import GlobalLoader from "@/components/ui/GlobalLoader";
import { ThemePage } from "@/components/ui/ThemeComponents";
import UserCard from "@/components/ui/UserCard";
import { useLoadingStore } from "@/stores/useLoadingStore";
import { useUIStore } from "@/stores/useUIStore";

import type { LoginUserCard } from "../api/login-cards/route";





// Страница входа с описанием сайта
export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userCards, setUserCards] = useState<LoginUserCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  
  // Получаем данные карточек из API
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        setIsLoadingCards(true);
        const response = await fetch('/api/login-cards');
        const cards = await response.json();
        setUserCards(cards);
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
  
  // Если пользователь уже авторизован - редиректим на главную
  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("✅ User is authenticated, redirecting to home");
      router.push("/");
    }
  }, [status, session, router]);
  
  const { 
    isLoginOpen, 
    isRegistrationOpen,
    openLogin,
    closeLogin,
    closeRegistration,
    switchToLogin,
    switchToRegistration
  } = useUIStore();

  const { setGlobalLoading } = useLoadingStore();
  
  // Управляем глобальным лоадером
  useEffect(() => {
    if (status === "loading" || isLoadingCards) {
      setGlobalLoading(true);
    } else {
      setGlobalLoading(false);
    }
  }, [status, isLoadingCards, setGlobalLoading]);

  return (
    <ThemePage className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden gap-4">
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
        {userCards.map((card, index) => {
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
              />
            </div>
          );
        })}
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
      
      <GlobalLoader />
    </ThemePage>
  );
}
