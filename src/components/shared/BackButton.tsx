import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export interface BackButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const StyledBackButton = styled.button`
  background: transparent;
  border: 2px solid ${theme.colors.secondary.main};
  color: ${theme.colors.secondary.main};
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${theme.colors.secondary.main};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.sm};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.secondary.lighter}40;
  }

  ${theme.mediaQueries.mobile} {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
`;

/**
 * Componente BackButton padronizado para voltar/cancelar ações
 *
 * @param children - Conteúdo do botão (padrão: "← Voltar")
 * @param onClick - Função chamada ao clicar
 * @param className - Classes CSS adicionais
 * @param disabled - Se o botão está desabilitado
 */
export const BackButton: React.FC<BackButtonProps> = ({
  children = '← Voltar',
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <StyledBackButton type='button' onClick={onClick} className={className} disabled={disabled}>
      {children}
    </StyledBackButton>
  );
};

export default BackButton;
