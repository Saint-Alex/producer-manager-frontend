import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export interface ActionButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outlined-danger' | 'outlined-secondary' | 'outlined-primary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/* istanbul ignore next */
export const getVariantStyles = (variant: ActionButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return css`
        background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
        color: white;
        border: 2px solid ${theme.colors.primary.main};
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.primary.dark}, ${theme.colors.primary.main});
          border-color: ${theme.colors.primary.dark};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};

          &::before {
            left: 100%;
          }
        }
      `;

    case 'secondary':
      return css`
        background: linear-gradient(135deg, ${theme.colors.secondary.main}, ${theme.colors.secondary.dark});
        color: white;
        border: 2px solid ${theme.colors.secondary.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.secondary.dark}, ${theme.colors.secondary.main});
          border-color: ${theme.colors.secondary.dark};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    case 'danger':
      return css`
        background: linear-gradient(135deg, ${theme.colors.danger.main}, ${theme.colors.danger.dark});
        color: white;
        border: 2px solid ${theme.colors.danger.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.danger.dark}, ${theme.colors.danger.main});
          border-color: ${theme.colors.danger.dark};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    case 'success':
      return css`
        background: linear-gradient(135deg, ${theme.colors.success.main}, ${theme.colors.success.dark});
        color: white;
        border: 2px solid ${theme.colors.success.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.success.dark}, ${theme.colors.success.main});
          border-color: ${theme.colors.success.dark};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    case 'warning':
      return css`
        background: linear-gradient(135deg, ${theme.colors.warning.main}, ${theme.colors.warning.dark});
        color: white;
        border: 2px solid ${theme.colors.warning.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.warning.dark}, ${theme.colors.warning.main});
          border-color: ${theme.colors.warning.dark};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    case 'info':
      return css`
        background: linear-gradient(135deg, ${theme.colors.info.main}, ${theme.colors.info.dark});
        color: white;
        border: 2px solid ${theme.colors.info.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.info.dark}, ${theme.colors.info.main});
          border-color: ${theme.colors.info.dark};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    case 'outlined-danger':
      return css`
        background-color: transparent;
        color: ${theme.colors.danger.main};
        border: 2px solid ${theme.colors.danger.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.danger.main}, ${theme.colors.danger.dark});
          color: white;
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    case 'outlined-secondary':
      return css`
        background-color: transparent;
        color: ${theme.colors.secondary.main};
        border: 2px solid ${theme.colors.secondary.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.secondary.main}, ${theme.colors.secondary.dark});
          color: white;
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    case 'outlined-primary':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary.main};
        border: 2px solid ${theme.colors.primary.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
          color: white;
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `;

    default:
      return css`
        background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
        color: white;
        border: 2px solid ${theme.colors.primary.main};

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${theme.colors.primary.dark}, ${theme.colors.primary.main});
          border-color: ${theme.colors.primary.dark};
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};

          ${theme.mediaQueries.mobile} {
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.sm};
          }
        }
      `;
  }
};

/* istanbul ignore next */
export const getSizeStyles = (size: ActionButtonProps['size']) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.fontSize.sm};
        min-height: 32px;

        ${theme.mediaQueries.mobile} {
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.fontSize.xs};
          min-height: 28px;
        }
      `;

    case 'large':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.fontSize.lg};
        min-height: 48px;

        ${theme.mediaQueries.mobile} {
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.fontSize.md};
          min-height: 44px;
        }
      `;

    case 'medium':
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.fontSize.md};
        min-height: 40px;

        ${theme.mediaQueries.mobile} {
          padding: ${theme.spacing.xs} ${theme.spacing.md};
          font-size: ${theme.fontSize.sm};
          min-height: 36px;
        }
      `;
  }
};

interface StyledButtonProps {
  $variant?: ActionButtonProps['variant'];
  $size?: ActionButtonProps['size'];
  $loading?: boolean;
  $fullWidth?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeight.medium};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  box-shadow: ${theme.shadows.sm};

  ${theme.mediaQueries.mobile} {
    gap: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
  }

  ${theme.mediaQueries.xs} {
    width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  }

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.primary.lighter}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none;
  }

  ${({ $loading }) =>
    $loading &&
    css`
      cursor: not-allowed;
      opacity: 0.7;
    `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ButtonContent = styled.span<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  transition: opacity 0.2s ease;
`;

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...buttonProps
}) => {
  return (
    <StyledButton
      className={className}
      $variant={variant}
      $size={size}
      $loading={loading}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {loading && <LoadingSpinner />}
      <ButtonContent $loading={loading}>
        {children}
      </ButtonContent>
    </StyledButton>
  );
};
