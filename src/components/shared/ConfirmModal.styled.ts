import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

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
    transform: translateY(-30px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(44, 28, 11, 0.4), rgba(74, 103, 65, 0.6));
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ModalContainer = styled.div`
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: ${slideIn} 0.4s ease-out;
  border: 2px solid ${theme.colors.border.light};
  position: relative;

  /* Borda superior decorativa */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.accent.main});
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.md};
  background: linear-gradient(135deg, ${theme.colors.background.accent}, ${theme.colors.neutral[50]});
  border-bottom: 2px solid ${theme.colors.border.light};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.primary.main};
  font-family: ${theme.fonts.primary};
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: 2px solid transparent;
  font-size: 24px;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease;
  font-weight: bold;

  &:hover {
    background: ${theme.colors.danger.lighter}20;
    color: ${theme.colors.danger.main};
    border-color: ${theme.colors.danger.light};
    transform: scale(1.1);
  }
`;

export const ModalBody = styled.div`
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${theme.colors.background.paper};
`;

export const ModalIcon = styled.div<{ variant: 'danger' | 'warning' | 'info' }>`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  border-radius: 50%;
  ${({ variant }) => {
    switch (variant) {
      case 'danger':
        return `
          background: ${theme.colors.danger.lighter}20;
          color: ${theme.colors.danger.main};
          border: 3px solid ${theme.colors.danger.light};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning.lighter}20;
          color: ${theme.colors.warning.main};
          border: 3px solid ${theme.colors.warning.light};
        `;
      case 'info':
        return `
          background: ${theme.colors.info.lighter}20;
          color: ${theme.colors.info.main};
          border: 3px solid ${theme.colors.info.light};
        `;
      default:
        return `
          background: ${theme.colors.warning.lighter}20;
          color: ${theme.colors.warning.main};
          border: 3px solid ${theme.colors.warning.light};
        `;
    }
  }}
  box-shadow: ${theme.shadows.sm};
`;

export const ModalMessage = styled.div`
  font-size: ${theme.fontSize.md};
  line-height: 1.6;
  color: ${theme.colors.text.secondary};
  white-space: pre-line;
  font-family: ${theme.fonts.primary};

  strong {
    color: ${theme.colors.text.primary};
    font-weight: ${theme.fontWeight.semibold};
  }

  ul {
    text-align: left;
    margin: ${theme.spacing.md} 0;
    padding-left: ${theme.spacing.lg};
  }

  li {
    margin: ${theme.spacing.xs} 0;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl} ${theme.spacing.xl};
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.background.accent}, ${theme.colors.neutral[50]});
  border-top: 2px solid ${theme.colors.border.light};
`;

export const ModalButton = styled.button<{
  variant: 'danger' | 'warning' | 'info' | 'secondary';
}>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  font-family: ${theme.fonts.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  position: relative;
  overflow: hidden;

  ${({ variant }) => {
    switch (variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, ${theme.colors.danger.main}, ${theme.colors.danger.dark});
          color: white;
          border-color: ${theme.colors.danger.main};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background: linear-gradient(135deg, ${theme.colors.danger.dark}, ${theme.colors.danger.main});
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active {
            transform: translateY(0);
          }
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, ${theme.colors.warning.main}, ${theme.colors.warning.dark});
          color: white;
          border-color: ${theme.colors.warning.main};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background: linear-gradient(135deg, ${theme.colors.warning.dark}, ${theme.colors.warning.main});
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'info':
        return `
          background: linear-gradient(135deg, ${theme.colors.info.main}, ${theme.colors.info.dark});
          color: white;
          border-color: ${theme.colors.info.main};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background: linear-gradient(135deg, ${theme.colors.info.dark}, ${theme.colors.info.main});
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.background.paper};
          color: ${theme.colors.text.secondary};
          border-color: ${theme.colors.border.dark};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background: ${theme.colors.neutral[100]};
            color: ${theme.colors.text.primary};
            border-color: ${theme.colors.primary.light};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
          color: white;
          border-color: ${theme.colors.primary.main};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background: linear-gradient(135deg, ${theme.colors.primary.dark}, ${theme.colors.primary.main});
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;
