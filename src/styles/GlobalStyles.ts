import styled, { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.background.default};
    color: ${theme.colors.text.primary};
    line-height: 1.6;
  }

  code {
    font-family: ${theme.fonts.monospace};
  }

  #root {
    min-height: 100vh;
  }

  /* Scrollbar personalizada com tema rural */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.accent};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary.light};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary.main};
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

export const Card = styled.div`
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const Title = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

export const Button = styled.button`
  background-color: ${theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${theme.colors.primary.dark};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${theme.colors.grey[400]};
    cursor: not-allowed;
    transform: none;
  }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid ${theme.colors.grey[200]};
  border-top: 4px solid ${theme.colors.primary.main};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: ${theme.spacing.lg} auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled.div`
  background-color: ${theme.colors.danger.lighter}20;
  color: ${theme.colors.danger.dark};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.danger.light};
  margin-bottom: ${theme.spacing.lg};
`;

export const SuccessMessage = styled.div`
  background-color: ${theme.colors.success.lighter}20;
  color: ${theme.colors.success.dark};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.success.light};
  margin-bottom: ${theme.spacing.lg};
`;
