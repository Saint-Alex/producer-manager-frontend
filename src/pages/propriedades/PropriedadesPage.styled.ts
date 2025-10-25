import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 90px 2rem 2rem; /* 70px header height + 20px spacing + 2rem sides */
  min-height: 100vh;
  background: ${theme.colors.background.default};

  @media (max-width: 768px) {
    padding: 80px 2rem 2rem; /* 60px header height + 20px spacing + 2rem sides */
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const BackButton = styled.button`
  background: transparent;
  border: 2px solid ${theme.colors.secondary.main};
  color: ${theme.colors.secondary.main};
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.secondary.main};
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.primary.main};
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: left;
  }
`;

export const ContentSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PropriedadeCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.neutral[200]};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const PropriedadeName = styled.h2`
  color: ${theme.colors.primary.main};
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid ${theme.colors.primary.light};
  padding-bottom: 0.5rem;
`;

export const PropriedadeInfo = styled.div`
  margin-bottom: 1.5rem;

  p {
    margin: 0.5rem 0;
    color: ${theme.colors.neutral[700]};
    font-size: 0.95rem;
    line-height: 1.4;

    strong {
      color: ${theme.colors.neutral[900]};
      font-weight: 600;
    }
  }
`;

export const PropriedadeActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: stretch;

    > * {
      flex: 1;
    }
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.neutral[600]};
  padding: 3rem;
  grid-column: 1 / -1;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.danger.main};
  padding: 3rem;
  background: ${theme.colors.danger.light};
  border: 1px solid ${theme.colors.danger.main};
  border-radius: ${theme.borderRadius.md};
  grid-column: 1 / -1;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.neutral[600]};
  padding: 3rem;
  background: ${theme.colors.neutral[50]};
  border: 2px dashed ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  grid-column: 1 / -1;
`;
