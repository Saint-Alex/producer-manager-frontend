import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing.lg};

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.md};
  }

  ${theme.mediaQueries.xs} {
    padding: ${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.sm};
  }
`;

export const HomeCard = styled.div`
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border.light};
  position: relative;

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
  }

  ${theme.mediaQueries.xs} {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${theme.colors.primary.main} 0%,
      ${theme.colors.accent.main} 50%,
      ${theme.colors.secondary.main} 100%
    );
    border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;

    ${theme.mediaQueries.mobile} {
      height: 3px;
    }
  }
`;

export const HomeTitle = styled.h1`
  font-size: ${theme.fontSize['4xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  text-shadow: 0 2px 4px rgba(74, 103, 65, 0.1);

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize['3xl']};
    margin-bottom: ${theme.spacing.sm};
  }

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize['2xl']};
    line-height: 1.2;
  }

  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HomeDescription = styled.p`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.fontWeight.normal};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize.md};
    margin-bottom: ${theme.spacing.lg};
    padding: 0 ${theme.spacing.sm};
    line-height: 1.6;
  }

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize.sm};
    margin-bottom: ${theme.spacing.md};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing.lg};

  ${theme.mediaQueries.mobile} {
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
  }

  ${theme.mediaQueries.xs} {
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.xs};
  }
`;

export const HomeButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.sm};
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSize.sm};
  }

  ${theme.mediaQueries.xs} {
    width: 100%;
    max-width: 280px;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSize.md};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${theme.colors.neutral[400]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &::before {
      display: none;
    }
  }
`;

export const FeaturesSection = styled.div`
  margin-top: ${theme.spacing.xxl};
  padding: ${theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${theme.colors.background.accent} 0%,
    ${theme.colors.neutral[50]} 100%
  );
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.main};
  position: relative;

  ${theme.mediaQueries.mobile} {
    margin-top: ${theme.spacing.xl};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
  }

  ${theme.mediaQueries.xs} {
    margin-top: ${theme.spacing.lg};
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
      circle at 1px 1px,
      ${theme.colors.primary.main}15 1px,
      transparent 0
    );
    background-size: 20px 20px;
    border-radius: ${theme.borderRadius.lg};
    pointer-events: none;

    ${theme.mediaQueries.mobile} {
      background-size: 15px 15px;
    }
  }
`;

export const FeaturesTitle = styled.h3`
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.primary.main};
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.semibold};
  text-align: center;
  position: relative;
  z-index: 1;

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize.xl};
    margin-bottom: ${theme.spacing.md};
  }

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize.lg};
  }
`;

export const FeaturesList = styled.ul`
  color: ${theme.colors.text.secondary};
  line-height: 1.7;
  position: relative;
  z-index: 1;

  li {
    margin-bottom: ${theme.spacing.sm};
    padding-left: ${theme.spacing.md};
    position: relative;

    ${theme.mediaQueries.mobile} {
      font-size: ${theme.fontSize.sm};
      margin-bottom: ${theme.spacing.xs};
    }

    &::before {
      content: '🌾';
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`;

export const ProducersSection = styled.div`
  margin-top: ${theme.spacing.xxl};

  ${theme.mediaQueries.mobile} {
    margin-top: ${theme.spacing.xl};
  }

  ${theme.mediaQueries.xs} {
    margin-top: ${theme.spacing.lg};
  }
`;

export const ProducersTitle = styled.h2`
  font-size: ${theme.fontSize['3xl']};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  font-weight: ${theme.fontWeight.semibold};
  position: relative;

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize['2xl']};
    margin-bottom: ${theme.spacing.md};
  }

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize.xl};
  }

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

    ${theme.mediaQueries.mobile} {
      width: 60px;
      height: 2px;
    }
  }
`;

export const ProducersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};

  ${theme.mediaQueries.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: ${theme.spacing.md};
  }

  ${theme.mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
  }
`;

export const ProducerCard = styled.div`
  background: ${theme.colors.background.paper};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.3s ease;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.lg};
    min-height: 240px;
    border-radius: ${theme.borderRadius.md};
  }

  ${theme.mediaQueries.xs} {
    padding: ${theme.spacing.md};
    min-height: 200px;
    border-radius: ${theme.borderRadius.sm};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.accent.main});
    border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;

    ${theme.mediaQueries.mobile} {
      height: 3px;
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary.light};

    ${theme.mediaQueries.mobile} {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
  }
`;

export const ProducerName = styled.h3`
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.primary.main};
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize.lg};
  }

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize.md};
  }
`;

export const ProducerInfo = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: ${theme.spacing.md};

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize.xs};
  }

  p {
    margin: ${theme.spacing.xs} 0;
  }

  strong {
    color: ${theme.colors.text.primary};
    font-weight: ${theme.fontWeight.semibold};
  }
`;

export const ProducerActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 2px solid ${theme.colors.border.light};

  ${theme.mediaQueries.mobile} {
    flex-wrap: wrap;
    gap: ${theme.spacing.xs};
  }

  ${theme.mediaQueries.xs} {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSize.lg};
  background: ${theme.colors.background.accent};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.main};

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.xl};
    font-size: ${theme.fontSize.md};
  }

  ${theme.mediaQueries.xs} {
    padding: ${theme.spacing.lg};
    font-size: ${theme.fontSize.sm};
  }
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  color: ${theme.colors.danger.dark};
  background: linear-gradient(
    135deg,
    ${theme.colors.danger.lighter}20,
    ${theme.colors.danger.lighter}10
  );
  border: 2px solid ${theme.colors.danger.light};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.lg} 0;
  font-weight: ${theme.fontWeight.medium};

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
    margin: ${theme.spacing.md} 0;
  }
`;
