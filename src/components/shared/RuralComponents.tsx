import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

// Animação sutil para ícones
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Container para ícones rurais
export const RuralIconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 ${theme.spacing.sm};
  animation: ${float} 3s ease-in-out infinite;
`;

// Elementos decorativos
export const RuralDecorator = styled.div<{ position?: 'top' | 'bottom' | 'center' }>`
  position: relative;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    ${theme.colors.accent.main} 25%,
    ${theme.colors.primary.main} 50%,
    ${theme.colors.secondary.main} 75%,
    transparent 100%
  );
  margin: ${({ position }) => {
    switch (position) {
      case 'top': return `0 0 ${theme.spacing.lg} 0`;
      case 'bottom': return `${theme.spacing.lg} 0 0 0`;
      default: return `${theme.spacing.md} 0`;
    }
  }};

  &::before, &::after {
    content: '🌾';
    position: absolute;
    top: -8px;
    font-size: 16px;
    color: ${theme.colors.accent.main};
  }

  &::before {
    left: 0;
    transform: translateX(-50%);
  }

  &::after {
    right: 0;
    transform: translateX(50%);
  }
`;

// Padrão de fundo sutil
export const RuralPattern = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 2px 2px, ${theme.colors.primary.main}08 1px, transparent 0),
      radial-gradient(circle at 8px 8px, ${theme.colors.accent.main}06 1px, transparent 0);
    background-size: 20px 20px, 40px 40px;
    pointer-events: none;
    z-index: -1;
  }
`;

// Card com temática rural
export const RuralCard = styled.div<{ elevation?: 'low' | 'medium' | 'high' }>`
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  border: 2px solid ${theme.colors.border.light};
  position: relative;
  overflow: hidden;

  box-shadow: ${({ elevation = 'medium' }) => {
    switch (elevation) {
      case 'low': return theme.shadows.sm;
      case 'high': return theme.shadows.lg;
      default: return theme.shadows.md;
    }
  }};

  transition: all 0.3s ease;

  /* Borda superior decorativa */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
      ${theme.colors.primary.main} 0%,
      ${theme.colors.accent.main} 50%,
      ${theme.colors.secondary.main} 100%
    );
  }

  /* Padrão de textura sutil */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 1px 1px, ${theme.colors.primary.main}04 1px, transparent 0);
    background-size: 24px 24px;
    pointer-events: none;
    z-index: 0;
  }

  /* Conteúdo fica acima da textura */
  > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ elevation = 'medium' }) => {
    switch (elevation) {
      case 'low': return theme.shadows.md;
      case 'high': return theme.shadows.xl;
      default: return theme.shadows.lg;
    }
  }};
    border-color: ${theme.colors.primary.light};
  }
`;

// Seção com fundo inspirado na natureza
export const NatureSection = styled.div<{ variant?: 'earth' | 'leaf' | 'sky' }>`
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  position: relative;

  background: ${({ variant = 'earth' }) => {
    switch (variant) {
      case 'leaf':
        return `linear-gradient(135deg, ${theme.colors.accent.lighter}15, ${theme.colors.accent.main}08)`;
      case 'sky':
        return `linear-gradient(135deg, ${theme.colors.info.lighter}15, ${theme.colors.info.main}08)`;
      default:
        return `linear-gradient(135deg, ${theme.colors.background.accent}, ${theme.colors.neutral[50]})`;
    }
  }};

  border: 1px solid ${({ variant = 'earth' }) => {
    switch (variant) {
      case 'leaf': return theme.colors.accent.light;
      case 'sky': return theme.colors.info.light;
      default: return theme.colors.border.main;
    }
  }};
`;

// Título com decoração rural
export const RuralTitle = styled.h2<{ size?: 'small' | 'medium' | 'large' }>`
  color: ${theme.colors.primary.main};
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeight.semibold};
  text-align: center;
  position: relative;
  margin-bottom: ${theme.spacing.lg};

  font-size: ${({ size = 'medium' }) => {
    switch (size) {
      case 'small': return theme.fontSize.xl;
      case 'large': return theme.fontSize['4xl'];
      default: return theme.fontSize['2xl'];
    }
  }};

  /* Linha decorativa embaixo do título */
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.primary.main});
    border-radius: 2px;
  }
`;

// Componente de ícones rurais
interface RuralIconProps {
  icon: 'farm' | 'plant' | 'harvest' | 'tractor' | 'seed' | 'sun' | 'rain' | 'growth';
  animate?: boolean;
}

export const RuralIcon: React.FC<RuralIconProps> = ({ icon, animate = false }) => {
  const getIconEmoji = (icon: string) => {
    switch (icon) {
      case 'farm': return '🏡';
      case 'plant': return '🌱';
      case 'harvest': return '🌾';
      case 'tractor': return '🚜';
      case 'seed': return '🌰';
      case 'sun': return '☀️';
      case 'rain': return '🌧️';
      case 'growth': return '📈';
      default: return '🌿';
    }
  };

  const IconWrapper = styled.span<{ $animate: boolean }>`
    display: inline-block;
    animation: ${({ $animate }) => $animate ? `${float} 2s ease-in-out infinite` : 'none'};
  `;

  return (
    <IconWrapper $animate={animate}>
      {getIconEmoji(icon)}
    </IconWrapper>
  );
};

// Componente de estatística rural
interface RuralStatProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
}

export const RuralStat = styled.div<{ $color?: 'primary' | 'secondary' | 'accent' }>`
  text-align: center;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  border: 2px solid ${({ $color = 'primary' }) => {
    switch ($color) {
      case 'secondary': return theme.colors.secondary.light;
      case 'accent': return theme.colors.accent.light;
      default: return theme.colors.primary.light;
    }
  }};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

export const RuralStatValue = styled.div<{ $color?: 'primary' | 'secondary' | 'accent' }>`
  font-size: ${theme.fontSize['3xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${({ $color = 'primary' }) => {
    switch ($color) {
      case 'secondary': return theme.colors.secondary.main;
      case 'accent': return theme.colors.accent.main;
      default: return theme.colors.primary.main;
    }
  }};
  margin-bottom: ${theme.spacing.xs};
`;

export const RuralStatLabel = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const RuralStatComponent: React.FC<RuralStatProps> = ({
  value,
  label,
  icon,
  color = 'primary'
}) => (
  <RuralStat $color={color}>
    {icon && <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>{icon}</div>}
    <RuralStatValue $color={color}>{value}</RuralStatValue>
    <RuralStatLabel>{label}</RuralStatLabel>
  </RuralStat>
);
