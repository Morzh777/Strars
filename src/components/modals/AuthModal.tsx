"use client";

import AuthForm from "@/components/forms/AuthForm";
import CustomModal from "@/components/ui/Modal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegistration?: () => void;
}

export default function AuthModal({ isOpen, onClose, onOpenRegistration }: AuthModalProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Вход" size="md">
      <AuthForm onClose={onClose} onOpenRegistration={onOpenRegistration} />
    </CustomModal>
  );
}
