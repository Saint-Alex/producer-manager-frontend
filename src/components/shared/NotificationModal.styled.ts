import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translate(-50%, -60%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
`;

export const NotificationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const NotificationContainer = styled.div<{
  type: 'success' | 'error' | 'info' | 'warning';
}>`
  background: white;
  border-radius: 12px;
  padding: 32px;
  min-width: 400px;
  max-width: 500px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${slideIn} 0.3s ease-out;
  text-align: center;
  border-top: 4px solid
    ${({ type }) => {
      switch (type) {
        case 'success':
          return '#10b981';
        case 'error':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        case 'info':
          return '#3b82f6';
        default:
          return '#6b7280';
      }
    }};

  @media (max-width: 480px) {
    min-width: 320px;
    margin: 20px;
    padding: 24px;
  }
`;

export const NotificationIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  line-height: 1;
`;

export const NotificationTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
`;

export const NotificationMessage = styled.div`
  color: #4b5563;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;

  strong {
    color: #1f2937;
    font-weight: 600;
  }
`;

export const NotificationButton = styled.button<{
  type: 'success' | 'error' | 'info' | 'warning';
}>`
  background-color: ${({ type }) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  }};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px
      ${({ type }) => {
        switch (type) {
          case 'success':
            return 'rgba(16, 185, 129, 0.3)';
          case 'error':
            return 'rgba(239, 68, 68, 0.3)';
          case 'warning':
            return 'rgba(245, 158, 11, 0.3)';
          case 'info':
            return 'rgba(59, 130, 246, 0.3)';
          default:
            return 'rgba(107, 114, 128, 0.3)';
        }
      }};
  }
`;
