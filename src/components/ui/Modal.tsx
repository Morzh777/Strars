"use client";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size: "sm" | "md" | "lg" | "xl";
}

export default function CustomModal({ isOpen, onClose, title, children, size }: ModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={size} 
      placement="center"
      classNames={{
        backdrop: "bg-black/30 backdrop-blur-md"
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </ModalHeader>
        <ModalBody>
            {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
