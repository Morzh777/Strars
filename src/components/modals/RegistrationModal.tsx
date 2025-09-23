"use client";

import RegistrationForm from "@/components/forms/RegistrationForm";
import CustomModal from "@/components/ui/Modal";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onOpenLogin,
}: RegistrationModalProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Регистрация" size="md">
      <RegistrationForm onClose={onClose} onOpenLogin={onOpenLogin} />
    </CustomModal>
  );
};

