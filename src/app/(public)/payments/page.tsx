import { ThemeCard, ThemeHeading, ThemePage, ThemeText } from "@/components/ui/ThemeComponents";

// Серверный компонент страницы истории покупок
export default function PaymentsPage() {
  return (
    <ThemePage className="min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <ThemeHeading level={1} className="text-3xl mb-8 text-center">
          📊 История покупок
        </ThemeHeading>
        
        <ThemeCard className="text-center py-16 space-y-6">
          <div className="text-6xl opacity-50">
            🛒
          </div>
          
          <ThemeHeading level={2} className="text-2xl">
            Пока здесь пусто
          </ThemeHeading>
          
          <ThemeText variant="secondary" className="text-lg max-w-md mx-auto">
            Ваши покупки будут отображаться здесь после совершения первых транзакций
          </ThemeText>
          
          <ThemeText variant="muted" className="text-sm">
            Функционал истории покупок находится в разработке
          </ThemeText>
        </ThemeCard>
      </div>
    </ThemePage>
  );
}

// Метаданные страницы для SEO
export const metadata = {
  title: "История покупок - Stars",
  description: "Просмотр истории ваших покупок и транзакций",
};
