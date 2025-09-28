import {Button as HeroUIButton, ButtonProps} from "@heroui/react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export default function Button({ children, color = "default", ...props }: CustomButtonProps) {
  return (
    <HeroUIButton color={color} {...props}>
      {children}
    </HeroUIButton>
  );
}
