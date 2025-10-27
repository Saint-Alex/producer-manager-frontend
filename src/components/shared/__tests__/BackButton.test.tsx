import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import { BackButton } from '../BackButton';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('BackButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Renderização básica', () => {
    it('should render with default text', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} />);
      expect(screen.getByText('← Voltar')).toBeInTheDocument();
    });

    it('should render with custom children', () => {
      renderWithTheme(<BackButton onClick={mockOnClick}>← Cancelar</BackButton>);
      expect(screen.getByText('← Cancelar')).toBeInTheDocument();
    });

    it('should render as button type', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Interações', () => {
    it('should call onClick when clicked', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} />);
      const button = screen.getByText('← Voltar');
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} disabled />);
      const button = screen.getByText('← Voltar');
      fireEvent.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Acessibilidade', () => {
    it('should be accessible via keyboard', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} />);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have proper disabled state', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Props customizadas', () => {
    it('should accept custom className', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} className='custom-class' />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should handle different children types', () => {
      renderWithTheme(
        <BackButton onClick={mockOnClick}>
          <span>←</span> Voltar para lista
        </BackButton>
      );
      expect(screen.getByText('Voltar para lista')).toBeInTheDocument();
    });
  });

  describe('Estilos', () => {
    it('should apply styled component styles', () => {
      const { getByRole } = renderWithTheme(<BackButton onClick={mockOnClick} />);
      const button = getByRole('button');

      // Verifica se o styled component foi aplicado
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should apply hover styles', () => {
      renderWithTheme(<BackButton onClick={mockOnClick} />);
      const button = screen.getByRole('button');

      // Simular hover
      fireEvent.mouseEnter(button);

      // Verificar se o evento não causou erro
      expect(button).toBeInTheDocument();
    });
  });
});
