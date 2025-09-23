
import { ThemeCard, ThemeHeading, ThemePage, ThemeText } from "@/components/ui/ThemeComponents";

export default function Public() {
  return (
    <ThemePage className="flex flex-col items-center justify-center min-h-screen p-8">
      <ThemeCard className="max-w-md w-full text-center space-y-6">
        <ThemeHeading level={1} className="text-4xl">
          STAR⭐
        </ThemeHeading>
        <ThemeText variant="secondary" className="text-lg">
          Покажи всем свою индивидуальность
        </ThemeText>
        <ThemeText variant="muted" className="text-sm">
          Добро пожаловать в социальную сеть нового поколения
        </ThemeText>
      </ThemeCard>
    </ThemePage>
  );
}