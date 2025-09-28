
import { redirect } from "next/navigation";

import { ThemeCard, ThemeHeading, ThemePage, ThemeText } from "@/components/ui/ThemeComponents";
import { auth } from "@/lib/auth";

// Серверный компонент главной страницы
export default async function Home() {
  // Проверяем авторизацию на сервере
  const session = await auth();
  
  // Если пользователь не авторизован - редиректим на логин
  if (!session?.user) {
    redirect('/login');
  }
  return (
    <ThemePage className="flex flex-col items-center justify-center min-h-screen p-8">
      <ThemeCard className="max-w-md w-full text-center space-y-6">
        <ThemeHeading level={1} className="text-4xl">
          STAR⭐
        </ThemeHeading>
        <ThemeText variant="secondary" className="text-lg">
          Добро пожаловать, {session.user.name}!
        </ThemeText>
        <ThemeText variant="muted" className="text-sm">
          Вы успешно авторизованы в социальной сети нового поколения
        </ThemeText>
        <ThemeText variant="muted" className="text-xs">
          Email: {session.user.email}
        </ThemeText>
      </ThemeCard>
    </ThemePage>
  );
}