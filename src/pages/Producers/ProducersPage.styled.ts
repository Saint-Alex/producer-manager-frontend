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

export const PageTitle = styled.h1`
  color: ${theme.colors.primary.main};
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${theme.colors.primary.lighter}40;
  }

  &::placeholder {
    color: ${theme.colors.neutral[500]};
  }

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
  }
`;

export const FilterButton = styled.button`
  background: white;
  border: 2px solid ${theme.colors.neutral[300]};
  color: ${theme.colors.neutral[700]};
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    border-color: ${theme.colors.primary.main};
    color: ${theme.colors.primary.main};
    transform: translateY(-1px);
  }

  &.active {
    background: ${theme.colors.primary.main};
    border-color: ${theme.colors.primary.main};
    color: white;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ContentSection = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.neutral[200]};
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  background: ${theme.colors.primary.lighter};
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${theme.colors.neutral[200]};

  h2 {
    color: ${theme.colors.primary.main};
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  p {
    color: ${theme.colors.neutral[600]};
    margin: 0.5rem 0 0;
    font-size: 1rem;
  }
`;

export const SectionContent = styled.div`
  padding: 2rem;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.neutral[200]};
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary.main};
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  color: ${theme.colors.neutral[600]};
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.neutral[600]};
  padding: 3rem;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.danger.main};
  padding: 3rem;
  background: ${theme.colors.danger.light};
  border: 1px solid ${theme.colors.danger.main};
  border-radius: ${theme.borderRadius.md};
  margin: 1rem 0;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.neutral[600]};
  padding: 3rem;
  background: ${theme.colors.neutral[50]};
  border: 2px dashed ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};

  h3 {
    color: ${theme.colors.neutral[700]};
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
  }
`;
