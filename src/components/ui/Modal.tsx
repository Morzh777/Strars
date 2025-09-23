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
        backdrop: "bg-black/30 backdrop-blur-md",
        base: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
        header: "border-b border-gray-200 dark:border-gray-800",
        body: "py-6",
        closeButton: "hover:bg-gray-100 dark:hover:bg-gray-800"
      }}
    >
      <ModalContent>
        <ModalHeader className="text-gray-900 dark:text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
        </ModalHeader>
        <ModalBody>
            {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
