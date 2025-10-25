import React from 'react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalIcon,
  ModalMessage,
  ModalActions,
  ModalButton,
} from './ConfirmModal.styled';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalCloseButton onClick={onCancel}>×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <ModalIcon variant={variant}>{getIcon()}</ModalIcon>
          <ModalMessage dangerouslySetInnerHTML={{ __html: message }} />
        </ModalBody>

        <ModalActions>
          <ModalButton variant='secondary' onClick={onCancel}>
            {cancelText}
          </ModalButton>
          <ModalButton variant={variant} onClick={onConfirm}>
            {confirmText}
          </ModalButton>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmModal;
