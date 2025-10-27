import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const PageContainer = styled.div`
  max-width: 1000px;
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
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

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FormSection = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.neutral[200]};
`;

export const SectionTitle = styled.h2`
  color: ${theme.colors.primary.main};
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  border-bottom: 2px solid ${theme.colors.primary.light};
  padding-bottom: 0.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  color: ${theme.colors.neutral[700]};
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
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

  &:disabled {
    background: ${theme.colors.neutral[100]};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.neutral[500]};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${theme.colors.primary.lighter}40;
  }

  &:disabled {
    background: ${theme.colors.neutral[100]};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.neutral[500]};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.neutral[200]};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SafrasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SafraCard = styled.div`
  background: ${theme.colors.neutral[50]};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${theme.shadows.sm};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

export const SafraInfo = styled.div`
  flex: 1;

  h4 {
    color: ${theme.colors.primary.main};
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: ${theme.colors.neutral[700]};
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
  }

  small {
    color: ${theme.colors.neutral[500]};
    font-size: 0.85rem;
  }
`;

export const SafraActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: stretch;

    > * {
      flex: 1;
    }
  }
`;

export const AddSafraButton = styled.button`
  background: ${theme.colors.success.main};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${theme.colors.success.dark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: ${theme.colors.neutral[600]};
  font-style: italic;
  padding: 2rem;
  background: ${theme.colors.neutral[50]};
  border: 2px dashed ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
`;
