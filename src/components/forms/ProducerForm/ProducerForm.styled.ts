import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const FormContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.md};
  }

  ${theme.mediaQueries.xs} {
    padding: ${theme.spacing.sm};
  }
`;

export const FormCard = styled.div`
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.md};
  border: 2px solid ${theme.colors.border.light};
  position: relative;

  ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.md};
  }

  ${theme.mediaQueries.xs} {
    padding: ${theme.spacing.lg};
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

export const FormTitle = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.xxl};
  text-align: center;
  text-shadow: 0 2px 4px rgba(74, 103, 65, 0.1);

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize['2xl']};
    margin-bottom: ${theme.spacing.xl};
  }

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize.xl};
    margin-bottom: ${theme.spacing.lg};
  }

  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;

  @media ${({ theme }) => theme.mediaQueries.mobile} {
    margin-bottom: 1.5rem;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media ${({ theme }) => theme.mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.border.light};

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize.lg};
    margin-bottom: ${theme.spacing.sm};
  }

  ${theme.mediaQueries.xs} {
    font-size: ${theme.fontSize.md};
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};

  ${theme.mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize.xs};
  }
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${({ $hasError }) => ($hasError ? '#D84315' : '#E8D5BA')};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'Nunito', 'Source Sans Pro', sans-serif;
  transition: all 0.3s ease;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#D84315' : '#4A6741')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? '#D8431520' : '#4A674120')};
  }

  &:disabled {
    background-color: #f5e6d3;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #64543d;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
  }
`;

export const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${({ $hasError }) => ($hasError ? '#D84315' : '#E8D5BA')};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'Nunito', 'Source Sans Pro', sans-serif;
  transition: all 0.3s ease;
  background-color: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#D84315' : '#4A6741')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? '#D8431520' : '#4A674120')};
  }

  &:disabled {
    background-color: #f5e6d3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
  }
`;

export const Textarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${({ $hasError }) => ($hasError ? '#D84315' : '#E8D5BA')};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'Nunito', 'Source Sans Pro', sans-serif;
  background-color: #ffffff;
  color: #2c1c0b;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#D84315' : '#4A6741')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? '#D8431520' : '#4A674120')};
  }

  &:disabled {
    background-color: #f5e6d3;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #64543d;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
  }
`;

export const ErrorMessage = styled.span`
  color: ${theme.colors.danger.main};
  font-size: ${theme.fontSize.xs};
  margin-top: ${theme.spacing.xs};
  font-weight: ${theme.fontWeight.medium};

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize.xs};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xxl};

  ${theme.mediaQueries.mobile} {
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.xl};
    flex-direction: column-reverse;
  }

  ${theme.mediaQueries.xs} {
    gap: ${theme.spacing.xs};
    margin-top: ${theme.spacing.lg};
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.paper}CC;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.lg};
  z-index: 10;

  ${theme.mediaQueries.mobile} {
    border-radius: ${theme.borderRadius.md};
  }

  ${theme.mediaQueries.xs} {
    border-radius: ${theme.borderRadius.sm};
  }
`;
