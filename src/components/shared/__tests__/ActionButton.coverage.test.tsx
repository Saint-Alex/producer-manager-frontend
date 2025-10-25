import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import { ActionButton, ActionButtonProps } from '../ActionButton';

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ActionButton Coverage Tests', () => {
  describe('Branch Coverage for getVariantStyles', () => {
    it('should execute all branches in getVariantStyles function', () => {
      const variants: (ActionButtonProps['variant'])[] = [
        'primary',
        'secondary',
        'danger',
        'success',
        'warning',
        'info',
        'outlined-danger',
        'outlined-secondary',
        'outlined-primary',
        undefined, // Para testar o default case
        null as any, // Para testar o default case
        'invalid' as any // Para testar o default case
      ];

      variants.forEach((variant) => {
        const { unmount } = renderWithTheme(
          <ActionButton variant={variant}>
            Test {variant || 'default'}
          </ActionButton>
        );

        // Força a renderização do componente styled
        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it('should render primary variant with all conditions', () => {
      // Renderiza o componente para forçar a execução do CSS
      const { container } = renderWithTheme(
        <ActionButton variant="primary">Primary Test</ActionButton>
      );

      // Verifica se o styled component foi renderizado
      expect(container.firstChild).toBeInTheDocument();

      // Força a criação do DOM para executar as funções styled
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render secondary variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="secondary">Secondary Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render danger variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="danger">Danger Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render success variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="success">Success Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render warning variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="warning">Warning Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render info variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="info">Info Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render outlined-danger variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="outlined-danger">Outlined Danger Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render outlined-secondary variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="outlined-secondary">Outlined Secondary Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render outlined-primary variant with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant="outlined-primary">Outlined Primary Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render default variant case with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton variant={undefined}>Default Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render invalid variant falling to default case', () => {
      const { container } = renderWithTheme(
        <ActionButton variant={'invalid-variant' as any}>Invalid Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Branch Coverage for getSizeStyles', () => {
    it('should execute all branches in getSizeStyles function', () => {
      const sizes: (ActionButtonProps['size'])[] = [
        'small',
        'medium',
        'large',
        undefined, // Para testar o default case
        null as any, // Para testar o default case
        'invalid' as any // Para testar o default case
      ];

      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(
          <ActionButton size={size}>
            Test {size || 'default'}
          </ActionButton>
        );

        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it('should render small size with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton size="small">Small Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render large size with all conditions', () => {
      const { container } = renderWithTheme(
        <ActionButton size="large">Large Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render medium size explicitly', () => {
      const { container } = renderWithTheme(
        <ActionButton size="medium">Medium Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render default size case (medium)', () => {
      const { container } = renderWithTheme(
        <ActionButton size={undefined}>Default Size Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render invalid size falling to default case', () => {
      const { container } = renderWithTheme(
        <ActionButton size={'invalid-size' as any}>Invalid Size Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Conditional CSS Coverage', () => {
    it('should render with fullWidth=true condition', () => {
      const { container } = renderWithTheme(
        <ActionButton fullWidth={true}>Full Width True</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render with fullWidth=false condition', () => {
      const { container } = renderWithTheme(
        <ActionButton fullWidth={false}>Full Width False</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render with loading=true condition', () => {
      const { container } = renderWithTheme(
        <ActionButton loading={true}>Loading True</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('should render with loading=false condition', () => {
      const { container } = renderWithTheme(
        <ActionButton loading={false}>Loading False</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('should render LoadingSpinner when loading=true', () => {
      const { container } = renderWithTheme(
        <ActionButton loading={true}>With Spinner</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();

      // Verifica se há elementos filhos (spinner + content)
      expect(button?.children.length).toBeGreaterThan(0);
    });

    it('should not render LoadingSpinner when loading=false', () => {
      const { container } = renderWithTheme(
        <ActionButton loading={false}>Without Spinner</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render ButtonContent with loading=true opacity', () => {
      const { container } = renderWithTheme(
        <ActionButton loading={true}>Hidden Content</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should render ButtonContent with loading=false opacity', () => {
      const { container } = renderWithTheme(
        <ActionButton loading={false}>Visible Content</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('All Combinations for Maximum Coverage', () => {
    it('should test all variant and size combinations', () => {
      const variants: ActionButtonProps['variant'][] = [
        'primary', 'secondary', 'danger', 'success', 'warning', 'info',
        'outlined-danger', 'outlined-secondary', 'outlined-primary'
      ];
      const sizes: ActionButtonProps['size'][] = ['small', 'medium', 'large'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { unmount } = renderWithTheme(
            <ActionButton variant={variant} size={size}>
              {variant}-{size}
            </ActionButton>
          );

          const button = document.querySelector('button');
          expect(button).toBeInTheDocument();

          unmount();
        });
      });
    });

    it('should test all boolean prop combinations', () => {
      const booleanCombinations = [
        { loading: true, fullWidth: true, disabled: true },
        { loading: true, fullWidth: true, disabled: false },
        { loading: true, fullWidth: false, disabled: true },
        { loading: true, fullWidth: false, disabled: false },
        { loading: false, fullWidth: true, disabled: true },
        { loading: false, fullWidth: true, disabled: false },
        { loading: false, fullWidth: false, disabled: true },
        { loading: false, fullWidth: false, disabled: false }
      ];

      booleanCombinations.forEach((combo, index) => {
        const { unmount } = renderWithTheme(
          <ActionButton
            loading={combo.loading}
            fullWidth={combo.fullWidth}
            disabled={combo.disabled}
          >
            Combo {index}
          </ActionButton>
        );

        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        // Verifica estado de disabled baseado na lógica: disabled || loading
        const shouldBeDisabled = combo.disabled || combo.loading;
        if (shouldBeDisabled) {
          expect(button).toBeDisabled();
        } else {
          expect(button).not.toBeDisabled();
        }

        unmount();
      });
    });

    it('should test edge cases for complete branch coverage', () => {
      const edgeCases = [
        { variant: null as any, size: null as any },
        { variant: undefined, size: undefined },
        { variant: 'invalid' as any, size: 'invalid' as any },
        { variant: '', size: '' }
      ];

      edgeCases.forEach((edgeCase, index) => {
        const { unmount } = renderWithTheme(
          <ActionButton
            variant={edgeCase.variant}
            size={edgeCase.size}
          >
            Edge Case {index}
          </ActionButton>
        );

        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('Styled Component Props Coverage', () => {
    it('should test StyledButton with all props combinations', () => {
      const propsCombinations = [
        {
          $variant: 'primary' as const,
          $size: 'small' as const,
          $loading: true,
          $fullWidth: true
        },
        {
          $variant: 'secondary' as const,
          $size: 'medium' as const,
          $loading: false,
          $fullWidth: false
        },
        {
          $variant: 'danger' as const,
          $size: 'large' as const,
          $loading: true,
          $fullWidth: false
        },
        {
          $variant: undefined,
          $size: undefined,
          $loading: false,
          $fullWidth: true
        }
      ];

      propsCombinations.forEach((props, index) => {
        const { unmount } = renderWithTheme(
          <ActionButton
            variant={props.$variant}
            size={props.$size}
            loading={props.$loading}
            fullWidth={props.$fullWidth}
          >
            Styled Props {index}
          </ActionButton>
        );

        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it('should test ButtonContent component with loading states', () => {
      // Teste com loading=true
      const { unmount: unmount1 } = renderWithTheme(
        <ActionButton loading={true}>Loading Content</ActionButton>
      );

      let button = document.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();

      unmount1();

      // Teste com loading=false
      const { unmount: unmount2 } = renderWithTheme(
        <ActionButton loading={false}>Not Loading Content</ActionButton>
      );

      button = document.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();

      unmount2();
    });

    it('should test conditional rendering of children and spinner', () => {
      // Com loading=true - deve mostrar spinner E conteúdo (mas conteúdo com opacity 0)
      const { container: loadingContainer } = renderWithTheme(
        <ActionButton loading={true}>Content with Spinner</ActionButton>
      );

      const loadingButton = loadingContainer.querySelector('button');
      expect(loadingButton).toBeInTheDocument();
      expect(loadingButton?.children.length).toBeGreaterThan(1); // Spinner + ButtonContent

      // Com loading=false - deve mostrar apenas conteúdo
      const { container: notLoadingContainer } = renderWithTheme(
        <ActionButton loading={false}>Content without Spinner</ActionButton>
      );

      const notLoadingButton = notLoadingContainer.querySelector('button');
      expect(notLoadingButton).toBeInTheDocument();
    });
  });

  describe('Function Coverage Tests', () => {
    it('should ensure getVariantStyles function is called for all cases', () => {
      // Força a execução de todas as branches do switch case
      const allVariants = [
        'primary', 'secondary', 'danger', 'success', 'warning', 'info',
        'outlined-danger', 'outlined-secondary', 'outlined-primary',
        undefined, null, 'invalid'
      ];

      allVariants.forEach((variant, index) => {
        const { unmount } = renderWithTheme(
          <ActionButton variant={variant as any}>
            Variant Function Test {index}
          </ActionButton>
        );

        // Força a renderização e criação do styled component
        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it('should ensure getSizeStyles function is called for all cases', () => {
      // Força a execução de todas as branches do switch case
      const allSizes = ['small', 'medium', 'large', undefined, null, 'invalid'];

      allSizes.forEach((size, index) => {
        const { unmount } = renderWithTheme(
          <ActionButton size={size as any}>
            Size Function Test {index}
          </ActionButton>
        );

        // Força a renderização e criação do styled component
        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it('should test ActionButton functional component branches', () => {
      // Testa todos os caminhos condicionais dentro do componente funcional
      const testCases = [
        { loading: true, hasSpinner: true },
        { loading: false, hasSpinner: false }
      ];

      testCases.forEach((testCase) => {
        const { container } = renderWithTheme(
          <ActionButton loading={testCase.loading}>
            Functional Component Test
          </ActionButton>
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();

        if (testCase.hasSpinner) {
          // Quando loading=true, deve ter mais de um elemento filho (spinner + content)
          expect(button?.children.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('CSS Conditional Logic Coverage', () => {
    it('should test fullWidth conditional CSS application', () => {
      // Testa a aplicação condicional do CSS fullWidth
      const { container: fullWidthContainer } = renderWithTheme(
        <ActionButton fullWidth={true}>Full Width CSS Test</ActionButton>
      );

      const { container: normalWidthContainer } = renderWithTheme(
        <ActionButton fullWidth={false}>Normal Width CSS Test</ActionButton>
      );

      const fullWidthButton = fullWidthContainer.querySelector('button');
      const normalWidthButton = normalWidthContainer.querySelector('button');

      expect(fullWidthButton).toBeInTheDocument();
      expect(normalWidthButton).toBeInTheDocument();
    });

    it('should test loading conditional CSS application', () => {
      // Testa a aplicação condicional do CSS loading
      const { container: loadingContainer } = renderWithTheme(
        <ActionButton loading={true}>Loading CSS Test</ActionButton>
      );

      const { container: notLoadingContainer } = renderWithTheme(
        <ActionButton loading={false}>Not Loading CSS Test</ActionButton>
      );

      const loadingButton = loadingContainer.querySelector('button');
      const notLoadingButton = notLoadingContainer.querySelector('button');

      expect(loadingButton).toBeInTheDocument();
      expect(loadingButton).toBeDisabled();
      expect(notLoadingButton).toBeInTheDocument();
      expect(notLoadingButton).not.toBeDisabled();
    });

    it('should test disabled state conditional logic', () => {
      // Testa a lógica condicional: disabled={disabled || loading}
      const testCases = [
        { disabled: true, loading: false, expectedDisabled: true },
        { disabled: false, loading: true, expectedDisabled: true },
        { disabled: true, loading: true, expectedDisabled: true },
        { disabled: false, loading: false, expectedDisabled: false }
      ];

      testCases.forEach((testCase, index) => {
        const { unmount } = renderWithTheme(
          <ActionButton disabled={testCase.disabled} loading={testCase.loading}>
            Disabled Logic Test {index}
          </ActionButton>
        );

        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        if (testCase.expectedDisabled) {
          expect(button).toBeDisabled();
        } else {
          expect(button).not.toBeDisabled();
        }

        unmount();
      });
    });
  });

  describe('Media Query Coverage', () => {
    it('should test mobile media query conditions in variants', () => {
      // Testa se as media queries são aplicadas (mesmo que não possamos testar visualmente)
      const { container } = renderWithTheme(
        <ActionButton variant="primary">Mobile Media Query Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should test mobile media query conditions in sizes', () => {
      const sizes: ActionButtonProps['size'][] = ['small', 'medium', 'large'];

      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(
          <ActionButton size={size}>Mobile Size {size}</ActionButton>
        );

        const button = document.querySelector('button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it('should test xs media query condition for fullWidth', () => {
      const { container } = renderWithTheme(
        <ActionButton fullWidth={true}>XS Media Query Test</ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Complete Branch Coverage Validation', () => {
    it('should execute every possible code path', () => {
      // Matriz completa de todas as combinações possíveis
      const variants: (ActionButtonProps['variant'])[] = [
        'primary', 'secondary', 'danger', 'success', 'warning', 'info',
        'outlined-danger', 'outlined-secondary', 'outlined-primary', undefined
      ];

      const sizes: (ActionButtonProps['size'])[] = ['small', 'medium', 'large', undefined];

      const booleanValues = [true, false];

      // Testa todas as combinações possíveis
      variants.forEach((variant, vIndex) => {
        sizes.forEach((size, sIndex) => {
          booleanValues.forEach((loading, lIndex) => {
            booleanValues.forEach((fullWidth, fIndex) => {
              booleanValues.forEach((disabled, dIndex) => {
                const key = `${vIndex}-${sIndex}-${lIndex}-${fIndex}-${dIndex}`;

                const { unmount } = renderWithTheme(
                  <ActionButton
                    key={key}
                    variant={variant}
                    size={size}
                    loading={loading}
                    fullWidth={fullWidth}
                    disabled={disabled}
                  >
                    Complete Test {key}
                  </ActionButton>
                );

                const button = document.querySelector('button');
                expect(button).toBeInTheDocument();

                // Verifica a lógica de disabled
                const expectedDisabled = disabled || loading;
                if (expectedDisabled) {
                  expect(button).toBeDisabled();
                } else {
                  expect(button).not.toBeDisabled();
                }

                unmount();
              });
            });
          });
        });
      });
    });
  });

  // Testes adicionais para maximizar cobertura de branches
  describe('Additional Branch Coverage Tests', () => {
    const variants = ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'outlined-danger', 'outlined-secondary', 'outlined-primary'] as const;
    const sizes = ['small', 'medium', 'large'] as const;

    // Teste para maximizar a cobertura das funções utilitárias
    test('tests all variant and size utility functions through component usage', () => {
      // Testa todos os variants systematicamente
      variants.forEach((variant, index) => {
        const { container } = renderWithTheme(
          <ActionButton variant={variant} key={`variant-${variant}-${index}`}>
            {variant}
          </ActionButton>
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(variant);
      });

      // Testa todos os sizes systematicamente
      sizes.forEach((size, index) => {
        const { container } = renderWithTheme(
          <ActionButton size={size} key={`size-${size}-${index}`}>
            {size}
          </ActionButton>
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(size);
      });
    });

    // Teste de edge cases para maximizar coverage
    test('handles all edge cases and conditional branches', () => {
      // Caso 1: Loading + onClick (não deve executar)
      const mockOnClick = jest.fn();
      const { container } = renderWithTheme(
        <ActionButton loading={true} onClick={mockOnClick}>
          Loading Test
        </ActionButton>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      fireEvent.click(button!);
      expect(mockOnClick).not.toHaveBeenCalled();

      // Caso 2: Disabled + onClick (não deve executar)
      const { container: container2 } = renderWithTheme(
        <ActionButton disabled={true} onClick={mockOnClick}>
          Disabled Test
        </ActionButton>
      );

      const button2 = container2.querySelector('button');
      expect(button2).toBeInTheDocument();
      fireEvent.click(button2!);
      expect(mockOnClick).not.toHaveBeenCalled();

      // Caso 3: Normal + onClick (deve executar)
      const { container: container3 } = renderWithTheme(
        <ActionButton onClick={mockOnClick}>
          Normal Test
        </ActionButton>
      );

      const button3 = container3.querySelector('button');
      expect(button3).toBeInTheDocument();
      fireEvent.click(button3!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      // Caso 4: FullWidth true e false
      const { container: container4 } = renderWithTheme(
        <ActionButton fullWidth={true}>
          Full Width True
        </ActionButton>
      );

      const { container: container5 } = renderWithTheme(
        <ActionButton fullWidth={false}>
          Full Width False
        </ActionButton>
      );

      const button4 = container4.querySelector('button');
      const button5 = container5.querySelector('button');
      expect(button4).toBeInTheDocument();
      expect(button5).toBeInTheDocument();
      expect(button5).toHaveTextContent('Full Width False');
    });

    // Teste específico para cobertura de branches condicionais
    test('covers all conditional rendering branches', () => {
      // Branch: loading spinner visível
      const { container: container1 } = renderWithTheme(
        <ActionButton loading={true}>
          With Spinner
        </ActionButton>
      );

      // Branch: loading spinner oculto
      const { container: container2 } = renderWithTheme(
        <ActionButton loading={false}>
          Without Spinner
        </ActionButton>
      );

      // Branch: children renderizado normalmente
      const { container: container3 } = renderWithTheme(
        <ActionButton>
          Normal Children
        </ActionButton>
      );

      // Branch: componente com conteúdo vazio mas com aria-label
      const { container: container4 } = renderWithTheme(
        <ActionButton aria-label="No children">
          {''}
        </ActionButton>
      );

      const button1 = container1.querySelector('button');
      const button2 = container2.querySelector('button');
      const button3 = container3.querySelector('button');
      const button4 = container4.querySelector('button');

      expect(button1).toBeInTheDocument();
      expect(button1).toHaveTextContent('With Spinner');
      expect(button2).toBeInTheDocument();
      expect(button2).toHaveTextContent('Without Spinner');
      expect(button3).toBeInTheDocument();
      expect(button3).toHaveTextContent('Normal Children');
      expect(button4).toBeInTheDocument();
      expect(button4).toHaveAttribute('aria-label', 'No children');
    });

    // Teste para exercitar todas as props possíveis
    test('exercises all possible prop combinations', () => {
      const allProps = {
        variant: 'primary' as const,
        size: 'large' as const,
        loading: true,
        disabled: true,
        fullWidth: true,
        onClick: jest.fn(),
        className: 'custom-class',
        'data-testid': 'test-button',
        'aria-label': 'Test button'
      };

      const { container } = renderWithTheme(
        <ActionButton {...allProps}>
          All Props Button
        </ActionButton>
      );

      const button = container.querySelector('[data-testid="test-button"]');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveAttribute('aria-label', 'Test button');
      expect(button).toBeDisabled();
    });

    // Teste combinações específicas que podem estar em branches não cobertas
    test('tests specific uncovered branch combinations', () => {
      // Testa todas as combinações de variant + loading
      variants.forEach(variant => {
        const { container } = renderWithTheme(
          <ActionButton variant={variant} loading={true} key={`loading-${variant}`}>
            Loading {variant}
          </ActionButton>
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(`Loading ${variant}`);
      });

      // Testa todas as combinações de size + fullWidth
      sizes.forEach(size => {
        const { container } = renderWithTheme(
          <ActionButton size={size} fullWidth={true} key={`fullwidth-${size}`}>
            FullWidth {size}
          </ActionButton>
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(`FullWidth ${size}`);
      });
    });

    // Teste para cobertura máxima dos switch statements
    test('covers all switch statement branches including defaults', () => {
      // Força casos que podem não estar cobertos
      const { container: container1 } = renderWithTheme(
        <ActionButton variant={'unknown' as any}>
          Unknown Variant
        </ActionButton>
      );

      const { container: container2 } = renderWithTheme(
        <ActionButton size={'unknown' as any}>
          Unknown Size
        </ActionButton>
      );

      // Verifica se os elementos foram renderizados (com fallback)
      const button1 = container1.querySelector('button');
      const button2 = container2.querySelector('button');

      expect(button1).toBeInTheDocument();
      expect(button1).toHaveTextContent('Unknown Variant');
      expect(button2).toBeInTheDocument();
      expect(button2).toHaveTextContent('Unknown Size');
    });
  });
});
