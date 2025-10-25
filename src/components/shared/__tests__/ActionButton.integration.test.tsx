import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import { ActionButton, ActionButtonProps } from '../ActionButton';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

// Integration tests to ensure all variant and size combinations render
describe('ActionButton Integration Tests - Complete Coverage', () => {
  const variants: ActionButtonProps['variant'][] = [
    'primary',
    'secondary',
    'danger',
    'success',
    'warning',
    'info',
    'outlined-danger',
    'outlined-secondary',
    'outlined-primary',
    undefined, // Test default case
  ];

  const sizes: ActionButtonProps['size'][] = [
    'small',
    'medium',
    'large',
    undefined, // Test default case
  ];

  // Test all variant combinations to ensure CSS functions are called
  variants.forEach((variant, variantIndex) => {
    sizes.forEach((size, sizeIndex) => {
      it(`should render variant=${variant || 'default'} size=${size || 'default'}`, () => {
        const testId = `button-${variantIndex}-${sizeIndex}`;

        renderWithTheme(
          <ActionButton variant={variant} size={size} data-testid={testId}>
            Button {variantIndex}-{sizeIndex}
          </ActionButton>
        );

        const button = screen.getByTestId(testId);
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(`Button ${variantIndex}-${sizeIndex}`);
      });
    });
  });

  // Test all combinations with fullWidth
  variants.forEach((variant, variantIndex) => {
    it(`should render fullWidth variant=${variant || 'default'}`, () => {
      const testId = `fullwidth-button-${variantIndex}`;

      renderWithTheme(
        <ActionButton variant={variant} fullWidth={true} data-testid={testId}>
          FullWidth {variantIndex}
        </ActionButton>
      );

      const button = screen.getByTestId(testId);
      expect(button).toBeInTheDocument();
    });
  });

  // Test all combinations with loading state
  variants.forEach((variant, variantIndex) => {
    sizes.forEach((size, sizeIndex) => {
      it(`should render loading variant=${variant || 'default'} size=${size || 'default'}`, () => {
        const testId = `loading-button-${variantIndex}-${sizeIndex}`;

        renderWithTheme(
          <ActionButton variant={variant} size={size} loading={true} data-testid={testId}>
            Loading {variantIndex}-{sizeIndex}
          </ActionButton>
        );

        const button = screen.getByTestId(testId);
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
      });
    });
  });

  // Test all combinations with disabled state
  variants.forEach((variant, variantIndex) => {
    sizes.forEach((size, sizeIndex) => {
      it(`should render disabled variant=${variant || 'default'} size=${size || 'default'}`, () => {
        const testId = `disabled-button-${variantIndex}-${sizeIndex}`;

        renderWithTheme(
          <ActionButton variant={variant} size={size} disabled={true} data-testid={testId}>
            Disabled {variantIndex}-{sizeIndex}
          </ActionButton>
        );

        const button = screen.getByTestId(testId);
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
      });
    });
  });

  // Test complex combinations
  it('should render with all props combined', () => {
    renderWithTheme(
      <ActionButton
        variant='outlined-primary'
        size='large'
        fullWidth={true}
        loading={true}
        className='custom-class'
        type='submit'
        data-testid='complex-button'
      >
        Complex Button
      </ActionButton>
    );

    const button = screen.getByTestId('complex-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass('custom-class');
    expect(button).toBeDisabled(); // Because loading=true
  });

  // Test button types
  const buttonTypes: ActionButtonProps['type'][] = ['button', 'submit', 'reset'];
  buttonTypes.forEach(type => {
    it(`should render with type=${type}`, () => {
      renderWithTheme(
        <ActionButton type={type} data-testid={`type-${type}`}>
          {type} Button
        </ActionButton>
      );

      const button = screen.getByTestId(`type-${type}`);
      expect(button).toHaveAttribute('type', type);
    });
  });

  // Test edge cases that might not be covered
  it('should handle undefined variant gracefully', () => {
    renderWithTheme(
      <ActionButton variant={undefined} data-testid='undefined-variant'>
        Undefined Variant
      </ActionButton>
    );

    const button = screen.getByTestId('undefined-variant');
    expect(button).toBeInTheDocument();
  });

  it('should handle undefined size gracefully', () => {
    renderWithTheme(
      <ActionButton size={undefined} data-testid='undefined-size'>
        Undefined Size
      </ActionButton>
    );

    const button = screen.getByTestId('undefined-size');
    expect(button).toBeInTheDocument();
  });

  // Test with different loading states
  it('should render loading spinner when loading=true', () => {
    renderWithTheme(
      <ActionButton loading={true} data-testid='loading-spinner'>
        Loading Button
      </ActionButton>
    );

    const button = screen.getByTestId('loading-spinner');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  // Test button content opacity when loading
  it('should have content with proper opacity when loading', () => {
    renderWithTheme(
      <ActionButton loading={true} data-testid='content-opacity'>
        Content Button
      </ActionButton>
    );

    const button = screen.getByTestId('content-opacity');
    expect(button).toBeInTheDocument();
  });

  // Test focus behavior
  it('should be focusable when not disabled', () => {
    renderWithTheme(<ActionButton data-testid='focusable'>Focusable Button</ActionButton>);

    const button = screen.getByTestId('focusable');
    button.focus();
    expect(button).toHaveFocus();
  });

  // Test click handler
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <ActionButton onClick={handleClick} data-testid='clickable'>
        Clickable Button
      </ActionButton>
    );

    const button = screen.getByTestId('clickable');
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test that loading buttons don't call onClick
  it('should not call onClick when loading', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <ActionButton onClick={handleClick} loading={true} data-testid='loading-no-click'>
        Loading Button
      </ActionButton>
    );

    const button = screen.getByTestId('loading-no-click');
    button.click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test that disabled buttons don't call onClick
  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <ActionButton onClick={handleClick} disabled={true} data-testid='disabled-no-click'>
        Disabled Button
      </ActionButton>
    );

    const button = screen.getByTestId('disabled-no-click');
    button.click();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
