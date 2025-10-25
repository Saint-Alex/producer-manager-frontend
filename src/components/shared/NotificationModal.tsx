import React from 'react';
import {
  NotificationOverlay,
  NotificationContainer,
  NotificationIcon,
  NotificationTitle,
  NotificationMessage,
  NotificationButton,
} from './NotificationModal.styled';

export interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  buttonText?: string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
  buttonText = 'OK',
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <NotificationOverlay onClick={handleOverlayClick}>
      <NotificationContainer type={type}>
        <NotificationIcon>{getIcon()}</NotificationIcon>
        <NotificationTitle>{title}</NotificationTitle>
        <NotificationMessage dangerouslySetInnerHTML={{ __html: message }} />
        <NotificationButton type={type} onClick={onClose}>
          {buttonText}
        </NotificationButton>
      </NotificationContainer>
    </NotificationOverlay>
  );
};
