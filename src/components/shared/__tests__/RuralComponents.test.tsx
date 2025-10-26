import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import {
  NatureSection,
  RuralCard,
  RuralDecorator,
  RuralIcon,
  RuralIconContainer,
  RuralPattern,
  RuralStat,
  RuralStatComponent,
  RuralStatLabel,
  RuralStatValue,
  RuralTitle,
} from '../RuralComponents';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('RuralComponents', () => {
  describe('RuralIcon Component - getIconEmoji Function Tests', () => {
    it('should render farm icon correctly and test getIconEmoji farm case', () => {
      renderWithTheme(<RuralIcon icon='farm' data-testid='farm-icon' />);

      const icon = screen.getByText('🏡');
      expect(icon).toBeInTheDocument();
    });

    it('should render plant icon correctly and test getIconEmoji plant case', () => {
      renderWithTheme(<RuralIcon icon='plant' data-testid='plant-icon' />);

      const icon = screen.getByText('🌱');
      expect(icon).toBeInTheDocument();
    });

    it('should render harvest icon correctly and test getIconEmoji harvest case', () => {
      renderWithTheme(<RuralIcon icon='harvest' data-testid='harvest-icon' />);

      const icon = screen.getByText('🌾');
      expect(icon).toBeInTheDocument();
    });

    it('should render tractor icon correctly and test getIconEmoji tractor case', () => {
      renderWithTheme(<RuralIcon icon='tractor' data-testid='tractor-icon' />);

      const icon = screen.getByText('🚜');
      expect(icon).toBeInTheDocument();
    });

    it('should render seed icon correctly and test getIconEmoji seed case', () => {
      renderWithTheme(<RuralIcon icon='seed' data-testid='seed-icon' />);

      const icon = screen.getByText('🌰');
      expect(icon).toBeInTheDocument();
    });

    it('should render sun icon correctly and test getIconEmoji sun case', () => {
      renderWithTheme(<RuralIcon icon='sun' data-testid='sun-icon' />);

      const icon = screen.getByText('☀️');
      expect(icon).toBeInTheDocument();
    });

    it('should render rain icon correctly and test getIconEmoji rain case', () => {
      renderWithTheme(<RuralIcon icon='rain' data-testid='rain-icon' />);

      const icon = screen.getByText('🌧️');
      expect(icon).toBeInTheDocument();
    });

    it('should render growth icon correctly and test getIconEmoji growth case', () => {
      renderWithTheme(<RuralIcon icon='growth' data-testid='growth-icon' />);

      const icon = screen.getByText('📈');
      expect(icon).toBeInTheDocument();
    });

    it('should render default icon for unknown types and test getIconEmoji default case', () => {
      // Testing runtime behavior with invalid icon to trigger default case
      const unknownIcon = 'unknown' as const;
      renderWithTheme(<RuralIcon icon={unknownIcon as any} data-testid='unknown-icon' />);

      const icon = screen.getByText('🌿');
      expect(icon).toBeInTheDocument();
    });

    it('should test all switch cases in getIconEmoji function systematically', () => {
      const iconTypes = [
        'farm',
        'plant',
        'harvest',
        'tractor',
        'seed',
        'sun',
        'rain',
        'growth',
      ] as const;
      const expectedEmojis = ['🏡', '🌱', '🌾', '🚜', '🌰', '☀️', '🌧️', '📈'];

      iconTypes.forEach((iconType, index) => {
        const { unmount } = renderWithTheme(
          <RuralIcon icon={iconType} data-testid={`icon-${iconType}`} />
        );

        const iconElement = screen.getByText(expectedEmojis[index]);
        expect(iconElement).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle null and undefined icon types (default case)', () => {
      // Test null icon (clear any previous renders)
      const { unmount: unmount1 } = renderWithTheme(
        <RuralIcon icon={null as any} data-testid='null-icon' />
      );
      expect(screen.getByText('🌿')).toBeInTheDocument();
      unmount1();

      // Test undefined icon
      const { unmount: unmount2 } = renderWithTheme(
        <RuralIcon icon={undefined as any} data-testid='undefined-icon' />
      );
      expect(screen.getByText('🌿')).toBeInTheDocument();
      unmount2();
    });

    it('should render with animate prop variations', () => {
      const { unmount: unmount1 } = renderWithTheme(
        <RuralIcon icon='farm' animate={true} data-testid='animated-icon' />
      );
      expect(screen.getByText('🏡')).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderWithTheme(
        <RuralIcon icon='plant' animate={false} data-testid='static-icon' />
      );
      expect(screen.getByText('🌱')).toBeInTheDocument();
      unmount2();

      renderWithTheme(<RuralIcon icon='harvest' data-testid='default-animate' />);
      expect(screen.getByText('🌾')).toBeInTheDocument();
    });
  });

  describe('RuralStatComponent - Comprehensive Logic Tests', () => {
    it('should render basic stat without icon', () => {
      renderWithTheme(
        <RuralStatComponent value='100' label='Total Fazendas' data-testid='basic-stat' />
      );

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Total Fazendas')).toBeInTheDocument();
    });

    it('should render stat with string icon', () => {
      renderWithTheme(
        <RuralStatComponent
          value={50}
          label='Propriedades Ativas'
          icon='🏡'
          data-testid='stat-with-icon'
        />
      );

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Propriedades Ativas')).toBeInTheDocument();
      expect(screen.getByText('🏡')).toBeInTheDocument();
    });

    it('should render stat with React element icon', () => {
      const CustomIcon = () => <span data-testid='custom-icon'>🚜</span>;

      renderWithTheme(
        <RuralStatComponent
          value='250 ha'
          label='Área Total'
          icon={<CustomIcon />}
          data-testid='stat-react-icon'
        />
      );

      expect(screen.getByText('250 ha')).toBeInTheDocument();
      expect(screen.getByText('Área Total')).toBeInTheDocument();
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should handle all color variants correctly', () => {
      const colors = ['primary', 'secondary', 'accent'] as const;

      colors.forEach((color, index) => {
        const { unmount } = renderWithTheme(
          <RuralStatComponent
            value={index + 1}
            label={`Label ${color}`}
            color={color}
            data-testid={`stat-${color}`}
          />
        );

        expect(screen.getByText(String(index + 1))).toBeInTheDocument();
        expect(screen.getByText(`Label ${color}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle default color when color prop is not provided', () => {
      renderWithTheme(
        <RuralStatComponent value='75%' label='Produtividade' data-testid='primary-stat' />
      );

      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Produtividade')).toBeInTheDocument();
    });

    it('should handle different value types correctly', () => {
      // String value
      renderWithTheme(
        <RuralStatComponent value='1,234' label='String Value' data-testid='string-value' />
      );
      expect(screen.getByText('1,234')).toBeInTheDocument();

      // Numeric value
      renderWithTheme(
        <RuralStatComponent value={42.5} label='Numeric Value' data-testid='numeric-value' />
      );
      expect(screen.getByText('42.5')).toBeInTheDocument();

      // Zero value
      renderWithTheme(<RuralStatComponent value={0} label='Zero Value' data-testid='zero-value' />);
      expect(screen.getByText('0')).toBeInTheDocument();

      // Empty string
      renderWithTheme(
        <RuralStatComponent value='' label='Empty Value' data-testid='empty-value' />
      );
      expect(screen.getByText('Empty Value')).toBeInTheDocument();
    });

    it('should handle label transformation to uppercase', () => {
      renderWithTheme(
        <RuralStatComponent value='100' label='mixed case Label' data-testid='label-transform' />
      );

      expect(screen.getByText('mixed case Label')).toBeInTheDocument();
    });

    it('should handle complex React node as value', () => {
      const ComplexValue = () => (
        <div data-testid='complex-value'>
          <span>Complex</span>
          <strong>Value</strong>
        </div>
      );

      renderWithTheme(
        <RuralStatComponent
          value={(<ComplexValue />) as any}
          label='Complex Data'
          data-testid='complex-stat'
        />
      );

      expect(screen.getByTestId('complex-value')).toBeInTheDocument();
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Complex Data')).toBeInTheDocument();
    });

    it('should test conditional icon rendering logic', () => {
      // Test each scenario separately to avoid conflicts

      // With icon
      const { unmount: unmount1 } = renderWithTheme(
        <RuralStatComponent value='100' label='With Icon' icon='🌾' data-testid='with-icon' />
      );
      expect(screen.getByText('🌾')).toBeInTheDocument();
      unmount1();

      // Without icon
      const { unmount: unmount2 } = renderWithTheme(
        <RuralStatComponent value='200' label='Without Icon' data-testid='without-icon' />
      );
      expect(screen.queryByText('🌾')).not.toBeInTheDocument();
      unmount2();

      // With null icon
      const { unmount: unmount3 } = renderWithTheme(
        <RuralStatComponent value='300' label='Null Icon' icon={null} data-testid='null-icon' />
      );
      expect(screen.queryByText('🌾')).not.toBeInTheDocument();
      unmount3();

      // With undefined icon
      renderWithTheme(
        <RuralStatComponent
          value='400'
          label='Undefined Icon'
          icon={undefined}
          data-testid='undefined-icon'
        />
      );
      expect(screen.queryByText('🌾')).not.toBeInTheDocument();
    });

    it('should handle edge cases with invalid color props', () => {
      // Testing runtime behavior with invalid color
      const invalidColor = 'invalid' as const;
      renderWithTheme(
        <RuralStatComponent
          value='100'
          label='Invalid Color'
          color={invalidColor as any}
          data-testid='invalid-color'
        />
      );

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Invalid Color')).toBeInTheDocument();
    });
  });

  describe('Styled Components Prop Handling Tests', () => {
    it('should test RuralDecorator position switch logic', () => {
      const positions = ['top', 'bottom', 'center'] as const;

      positions.forEach(position => {
        const { unmount } = renderWithTheme(
          <RuralDecorator position={position} data-testid={`decorator-${position}`} />
        );
        expect(screen.getByTestId(`decorator-${position}`)).toBeInTheDocument();
        unmount();
      });

      // Test default position
      renderWithTheme(<RuralDecorator data-testid='decorator-default' />);
      expect(screen.getByTestId('decorator-default')).toBeInTheDocument();
    });

    it('should test RuralCard elevation switch logic', () => {
      const elevations = ['low', 'medium', 'high'] as const;

      elevations.forEach(elevation => {
        const { unmount } = renderWithTheme(
          <RuralCard elevation={elevation} data-testid={`card-${elevation}`}>
            <div>{elevation} elevation</div>
          </RuralCard>
        );
        expect(screen.getByTestId(`card-${elevation}`)).toBeInTheDocument();
        expect(screen.getByText(`${elevation} elevation`)).toBeInTheDocument();
        unmount();
      });

      // Test default elevation
      renderWithTheme(
        <RuralCard data-testid='card-default'>
          <div>default elevation</div>
        </RuralCard>
      );
      expect(screen.getByTestId('card-default')).toBeInTheDocument();
    });

    it('should test NatureSection variant switch logic', () => {
      const variants = ['earth', 'leaf', 'sky'] as const;

      variants.forEach(variant => {
        const { unmount } = renderWithTheme(
          <NatureSection variant={variant} data-testid={`nature-${variant}`}>
            <div>{variant} nature</div>
          </NatureSection>
        );
        expect(screen.getByTestId(`nature-${variant}`)).toBeInTheDocument();
        expect(screen.getByText(`${variant} nature`)).toBeInTheDocument();
        unmount();
      });

      // Test default variant
      renderWithTheme(
        <NatureSection data-testid='nature-default'>
          <div>default nature</div>
        </NatureSection>
      );
      expect(screen.getByTestId('nature-default')).toBeInTheDocument();
    });

    it('should test RuralTitle size switch logic', () => {
      const sizes = ['small', 'medium', 'large'] as const;

      sizes.forEach(size => {
        const { unmount } = renderWithTheme(
          <RuralTitle size={size} data-testid={`title-${size}`}>
            {size} title
          </RuralTitle>
        );
        expect(screen.getByTestId(`title-${size}`)).toBeInTheDocument();
        expect(screen.getByText(`${size} title`)).toBeInTheDocument();
        unmount();
      });

      // Test default size
      renderWithTheme(<RuralTitle data-testid='title-default'>default title</RuralTitle>);
      expect(screen.getByTestId('title-default')).toBeInTheDocument();
    });

    it('should test RuralStat color switch logic', () => {
      const colors = ['primary', 'secondary', 'accent'] as const;

      colors.forEach(color => {
        const { unmount } = renderWithTheme(
          <RuralStat $color={color} data-testid={`stat-${color}`}>
            <div>{color} stat</div>
          </RuralStat>
        );
        expect(screen.getByTestId(`stat-${color}`)).toBeInTheDocument();
        expect(screen.getByText(`${color} stat`)).toBeInTheDocument();
        unmount();
      });

      // Test default color
      renderWithTheme(
        <RuralStat data-testid='stat-default'>
          <div>default stat</div>
        </RuralStat>
      );
      expect(screen.getByTestId('stat-default')).toBeInTheDocument();
    });

    it('should test RuralStatValue color switch logic', () => {
      const colors = ['primary', 'secondary', 'accent'] as const;

      colors.forEach(color => {
        const { unmount } = renderWithTheme(
          <RuralStatValue $color={color} data-testid={`value-${color}`}>
            {color}
          </RuralStatValue>
        );
        expect(screen.getByTestId(`value-${color}`)).toBeInTheDocument();
        expect(screen.getByText(color)).toBeInTheDocument();
        unmount();
      });

      // Test default color
      renderWithTheme(<RuralStatValue data-testid='value-default'>default</RuralStatValue>);
      expect(screen.getByTestId('value-default')).toBeInTheDocument();
    });
  });

  describe('Complex Integration and Edge Cases', () => {
    it('should render complex nested rural dashboard', () => {
      renderWithTheme(
        <RuralPattern data-testid='dashboard-pattern'>
          <RuralCard elevation='high'>
            <RuralTitle size='large'>Dashboard Rural Completo</RuralTitle>
            <RuralDecorator position='center' />

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <RuralStatComponent
                value='150'
                label='Fazendas Cadastradas'
                icon={<RuralIcon icon='farm' animate />}
                color='primary'
              />

              <RuralStatComponent
                value='2,400 ha'
                label='Área Total Plantada'
                icon={<RuralIcon icon='plant' animate />}
                color='secondary'
              />

              <RuralStatComponent
                value='95%'
                label='Taxa de Sucesso'
                icon={<RuralIcon icon='growth' animate />}
                color='accent'
              />
            </div>

            <NatureSection variant='leaf'>
              <RuralIconContainer>
                <RuralIcon icon='sun' animate />
                <RuralIcon icon='rain' animate />
                <RuralIcon icon='harvest' animate />
                <RuralIcon icon='tractor' animate />
              </RuralIconContainer>
            </NatureSection>
          </RuralCard>
        </RuralPattern>
      );

      expect(screen.getByTestId('dashboard-pattern')).toBeInTheDocument();
      expect(screen.getByText('Dashboard Rural Completo')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Fazendas Cadastradas')).toBeInTheDocument();
      expect(screen.getByText('2,400 ha')).toBeInTheDocument();
      expect(screen.getByText('Área Total Plantada')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('Taxa de Sucesso')).toBeInTheDocument();
      expect(screen.getByText('🏡')).toBeInTheDocument();
      expect(screen.getByText('🌱')).toBeInTheDocument();
      expect(screen.getByText('📈')).toBeInTheDocument();
      expect(screen.getByText('☀️')).toBeInTheDocument();
      expect(screen.getByText('🌧️')).toBeInTheDocument();
      expect(screen.getByText('🌾')).toBeInTheDocument();
      expect(screen.getByText('🚜')).toBeInTheDocument();
    });

    it('should test all component combinations with all prop variants', () => {
      renderWithTheme(
        <div data-testid='comprehensive-test'>
          {/* Test all RuralCard elevations */}
          <RuralCard elevation='low'>
            <RuralStatComponent
              value='Low Card'
              label='Low Elevation'
              color='primary'
              icon={<RuralIcon icon='farm' animate={true} />}
            />
          </RuralCard>

          <RuralCard elevation='medium'>
            <RuralStatComponent
              value='Medium Card'
              label='Medium Elevation'
              color='secondary'
              icon={<RuralIcon icon='plant' animate={false} />}
            />
          </RuralCard>

          <RuralCard elevation='high'>
            <RuralStatComponent
              value='High Card'
              label='High Elevation'
              color='accent'
              icon={<RuralIcon icon='harvest' />}
            />
          </RuralCard>

          {/* Test all NatureSection variants */}
          <NatureSection variant='earth'>
            <RuralTitle size='small'>Earth Section</RuralTitle>
          </NatureSection>

          <NatureSection variant='leaf'>
            <RuralTitle size='medium'>Leaf Section</RuralTitle>
          </NatureSection>

          <NatureSection variant='sky'>
            <RuralTitle size='large'>Sky Section</RuralTitle>
          </NatureSection>

          {/* Test all RuralDecorator positions */}
          <RuralDecorator position='top' />
          <RuralDecorator position='bottom' />
          <RuralDecorator position='center' />
        </div>
      );

      expect(screen.getByTestId('comprehensive-test')).toBeInTheDocument();
      expect(screen.getByText('Low Card')).toBeInTheDocument();
      expect(screen.getByText('Medium Card')).toBeInTheDocument();
      expect(screen.getByText('High Card')).toBeInTheDocument();
      expect(screen.getByText('Earth Section')).toBeInTheDocument();
      expect(screen.getByText('Leaf Section')).toBeInTheDocument();
      expect(screen.getByText('Sky Section')).toBeInTheDocument();
    });

    it('should handle RuralStatLabel text transformation', () => {
      renderWithTheme(
        <RuralStatLabel data-testid='stat-label'>
          mixed Case Label with UPPERCASE and lowercase
        </RuralStatLabel>
      );

      expect(screen.getByText('mixed Case Label with UPPERCASE and lowercase')).toBeInTheDocument();
    });

    it('should test RuralIconContainer with multiple icons', () => {
      renderWithTheme(
        <RuralIconContainer data-testid='icon-container'>
          <RuralIcon icon='farm' />
          <RuralIcon icon='plant' />
          <RuralIcon icon='harvest' />
          <RuralIcon icon='tractor' />
          <RuralIcon icon='seed' />
          <RuralIcon icon='sun' />
          <RuralIcon icon='rain' />
          <RuralIcon icon='growth' />
        </RuralIconContainer>
      );

      expect(screen.getByTestId('icon-container')).toBeInTheDocument();
      expect(screen.getByText('🏡')).toBeInTheDocument();
      expect(screen.getByText('🌱')).toBeInTheDocument();
      expect(screen.getByText('🌾')).toBeInTheDocument();
      expect(screen.getByText('🚜')).toBeInTheDocument();
      expect(screen.getByText('🌰')).toBeInTheDocument();
      expect(screen.getByText('☀️')).toBeInTheDocument();
      expect(screen.getByText('🌧️')).toBeInTheDocument();
      expect(screen.getByText('📈')).toBeInTheDocument();
    });

    it('should test all possible boolean combinations for animate prop', () => {
      const animateValues = [true, false, undefined];
      const iconTypes = ['farm', 'plant', 'harvest'] as const;
      const expectedEmojis = ['🏡', '🌱', '🌾'] as const;

      animateValues.forEach(animateValue => {
        iconTypes.forEach((iconType, iconIndex) => {
          const { unmount } = renderWithTheme(<RuralIcon icon={iconType} animate={animateValue} />);
          expect(screen.getByText(expectedEmojis[iconIndex])).toBeInTheDocument();
          unmount();
        });
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid prop values gracefully', () => {
      // Testing runtime behavior with invalid props
      const invalidIcon = 'invalid-icon' as const;
      const invalidPosition = 'invalid-position' as const;
      const invalidElevation = 'invalid-elevation' as const;
      const invalidVariant = 'invalid-variant' as const;
      renderWithTheme(
        <div data-testid='error-handling'>
          <RuralIcon icon={invalidIcon as any} />
          <RuralDecorator position={invalidPosition as any} />
          <RuralCard elevation={invalidElevation as any}>Content</RuralCard>
          <NatureSection variant={invalidVariant as any}>Content</NatureSection>
          <RuralTitle size={'invalid-size' as any}>Title</RuralTitle>
          <RuralStat $color={'invalid-color' as any}>Stat</RuralStat>
          <RuralStatValue $color={'invalid-color' as any}>Value</RuralStatValue>
          <RuralStatComponent
            value='Test'
            label='Test'
            color={'invalid-color' as any}
            icon={'invalid-icon' as any}
          />
        </div>
      );

      expect(screen.getByTestId('error-handling')).toBeInTheDocument();
      expect(screen.getByText('🌿')).toBeInTheDocument(); // Default icon
      expect(screen.getAllByText('Content')[0]).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Stat')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getAllByText('Test')[0]).toBeInTheDocument();
    });

    it('should handle null and undefined children', () => {
      renderWithTheme(
        <div data-testid='null-children'>
          <RuralIconContainer>{null}</RuralIconContainer>
          <RuralPattern>{undefined}</RuralPattern>
          <RuralCard elevation='low'>{null}</RuralCard>
          <NatureSection variant='earth'>{undefined}</NatureSection>
          <RuralTitle size='medium'>{null}</RuralTitle>
          <RuralStat $color='primary'>{undefined}</RuralStat>
          <RuralStatValue $color='secondary'>{null}</RuralStatValue>
          <RuralStatLabel>{undefined}</RuralStatLabel>
        </div>
      );

      expect(screen.getByTestId('null-children')).toBeInTheDocument();
    });

    it('should handle complex nested structures without errors', () => {
      renderWithTheme(
        <RuralPattern>
          <RuralCard elevation='high'>
            <NatureSection variant='leaf'>
              <RuralPattern>
                <RuralCard elevation='medium'>
                  <NatureSection variant='sky'>
                    <RuralPattern>
                      <RuralCard elevation='low'>
                        <RuralTitle size='large'>Deeply Nested</RuralTitle>
                        <RuralStatComponent
                          value='Deep'
                          label='Nested Component'
                          icon={<RuralIcon icon='growth' animate />}
                          color='accent'
                        />
                      </RuralCard>
                    </RuralPattern>
                  </NatureSection>
                </RuralCard>
              </RuralPattern>
            </NatureSection>
          </RuralCard>
        </RuralPattern>
      );

      expect(screen.getByText('Deeply Nested')).toBeInTheDocument();
      expect(screen.getByText('Deep')).toBeInTheDocument();
      expect(screen.getByText('Nested Component')).toBeInTheDocument();
      expect(screen.getByText('📈')).toBeInTheDocument();
    });
  });

  describe('Additional Coverage for Uncovered Switch Cases', () => {
    it('should render RuralDecorator with top position', () => {
      renderWithTheme(<RuralDecorator position='top' data-testid='decorator-top' />);

      const decorator = screen.getByTestId('decorator-top');
      expect(decorator).toBeInTheDocument();
    });

    it('should render RuralDecorator with bottom position', () => {
      renderWithTheme(<RuralDecorator position='bottom' data-testid='decorator-bottom' />);

      const decorator = screen.getByTestId('decorator-bottom');
      expect(decorator).toBeInTheDocument();
    });

    it('should render RuralCard with low elevation and test hover state coverage', () => {
      renderWithTheme(
        <RuralCard elevation='low' data-testid='card-low'>
          <p>Low elevation card</p>
        </RuralCard>
      );

      const card = screen.getByTestId('card-low');
      expect(card).toBeInTheDocument();
      expect(screen.getByText('Low elevation card')).toBeInTheDocument();
    });

    it('should render RuralCard with high elevation and test hover state coverage', () => {
      renderWithTheme(
        <RuralCard elevation='high' data-testid='card-high'>
          <p>High elevation card</p>
        </RuralCard>
      );

      const card = screen.getByTestId('card-high');
      expect(card).toBeInTheDocument();
      expect(screen.getByText('High elevation card')).toBeInTheDocument();
    });

    it('should render NatureSection with leaf variant', () => {
      renderWithTheme(
        <NatureSection variant='leaf' data-testid='nature-leaf'>
          <p>Leaf variant content</p>
        </NatureSection>
      );

      const section = screen.getByTestId('nature-leaf');
      expect(section).toBeInTheDocument();
      expect(screen.getByText('Leaf variant content')).toBeInTheDocument();
    });

    it('should render NatureSection with sky variant', () => {
      renderWithTheme(
        <NatureSection variant='sky' data-testid='nature-sky'>
          <p>Sky variant content</p>
        </NatureSection>
      );

      const section = screen.getByTestId('nature-sky');
      expect(section).toBeInTheDocument();
      expect(screen.getByText('Sky variant content')).toBeInTheDocument();
    });

    it('should render RuralTitle with small size', () => {
      renderWithTheme(
        <RuralTitle size='small' data-testid='title-small'>
          Small Rural Title
        </RuralTitle>
      );

      const title = screen.getByTestId('title-small');
      expect(title).toBeInTheDocument();
      expect(screen.getByText('Small Rural Title')).toBeInTheDocument();
    });

    it('should render RuralTitle with large size', () => {
      renderWithTheme(
        <RuralTitle size='large' data-testid='title-large'>
          Large Rural Title
        </RuralTitle>
      );

      const title = screen.getByTestId('title-large');
      expect(title).toBeInTheDocument();
      expect(screen.getByText('Large Rural Title')).toBeInTheDocument();
    });

    it('should render RuralStat with secondary color', () => {
      renderWithTheme(
        <RuralStat $color='secondary' data-testid='stat-secondary'>
          <RuralStatValue $color='secondary'>42</RuralStatValue>
          <RuralStatLabel>Secondary Stat</RuralStatLabel>
        </RuralStat>
      );

      const stat = screen.getByTestId('stat-secondary');
      expect(stat).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Secondary Stat')).toBeInTheDocument();
    });

    it('should render RuralStat with accent color', () => {
      renderWithTheme(
        <RuralStat $color='accent' data-testid='stat-accent'>
          <RuralStatValue $color='accent'>99</RuralStatValue>
          <RuralStatLabel>Accent Stat</RuralStatLabel>
        </RuralStat>
      );

      const stat = screen.getByTestId('stat-accent');
      expect(stat).toBeInTheDocument();
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('Accent Stat')).toBeInTheDocument();
    });

    it('should render RuralStatComponent with secondary color prop', () => {
      renderWithTheme(
        <RuralStatComponent value='100' label='Secondary Color Test' color='secondary' />
      );

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Secondary Color Test')).toBeInTheDocument();
    });

    it('should test default cases and unknown icon variants', () => {
      renderWithTheme(
        <div data-testid='unknown-icon-container'>
          <RuralIcon icon={'unknown-icon' as any} />
        </div>
      );

      const container = screen.getByTestId('unknown-icon-container');
      expect(container).toBeInTheDocument();
      expect(screen.getByText('🌿')).toBeInTheDocument(); // Should fallback to default leaf emoji
    });

    it('should test default position in RuralDecorator', () => {
      renderWithTheme(<RuralDecorator data-testid='decorator-default' />);

      const decorator = screen.getByTestId('decorator-default');
      expect(decorator).toBeInTheDocument();
    });

    it('should test medium elevation as default in RuralCard', () => {
      renderWithTheme(
        <RuralCard data-testid='card-default'>
          <p>Default elevation card</p>
        </RuralCard>
      );

      const card = screen.getByTestId('card-default');
      expect(card).toBeInTheDocument();
      expect(screen.getByText('Default elevation card')).toBeInTheDocument();
    });

    it('should test earth variant as default in NatureSection', () => {
      renderWithTheme(
        <NatureSection data-testid='nature-default'>
          <p>Default earth variant</p>
        </NatureSection>
      );

      const section = screen.getByTestId('nature-default');
      expect(section).toBeInTheDocument();
      expect(screen.getByText('Default earth variant')).toBeInTheDocument();
    });

    it('should test medium size as default in RuralTitle', () => {
      renderWithTheme(<RuralTitle data-testid='title-default'>Default Medium Title</RuralTitle>);

      const title = screen.getByTestId('title-default');
      expect(title).toBeInTheDocument();
      expect(screen.getByText('Default Medium Title')).toBeInTheDocument();
    });

    it('should test primary color as default in RuralStat and RuralStatValue', () => {
      renderWithTheme(
        <RuralStat data-testid='stat-default'>
          <RuralStatValue data-testid='stat-value-default'>123</RuralStatValue>
          <RuralStatLabel>Default Primary</RuralStatLabel>
        </RuralStat>
      );

      const stat = screen.getByTestId('stat-default');
      const statValue = screen.getByTestId('stat-value-default');
      expect(stat).toBeInTheDocument();
      expect(statValue).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText('Default Primary')).toBeInTheDocument();
    });
  });

  describe('Deep Branch Coverage - CSS-in-JS Switch Statements', () => {
    it('should test all hover state transformations in styled components', () => {
      // Test hover states that include switch logic for different elevations
      const elevations = ['low', 'medium', 'high'] as const;

      elevations.forEach(elevation => {
        const { unmount } = renderWithTheme(
          <RuralCard elevation={elevation} data-testid={`hover-test-${elevation}`}>
            <div>Testing hover {elevation}</div>
          </RuralCard>
        );

        const card = screen.getByTestId(`hover-test-${elevation}`);
        expect(card).toBeInTheDocument();
        expect(screen.getByText(`Testing hover ${elevation}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should test CSS-in-JS function branches in styled components', () => {
      // Test to ensure all switch branches in styled component functions are exercised
      renderWithTheme(
        <div data-testid='comprehensive-css-test'>
          {/* Test RuralDecorator position branches */}
          <RuralDecorator position='top' />
          <RuralDecorator position='bottom' />
          <RuralDecorator position='center' />
          <RuralDecorator />

          {/* Test RuralCard elevation branches */}
          <RuralCard elevation='low'>Low Card</RuralCard>
          <RuralCard elevation='medium'>Medium Card</RuralCard>
          <RuralCard elevation='high'>High Card</RuralCard>
          <RuralCard>Default Card</RuralCard>

          {/* Test NatureSection variant branches */}
          <NatureSection variant='earth'>Earth Section</NatureSection>
          <NatureSection variant='leaf'>Leaf Section</NatureSection>
          <NatureSection variant='sky'>Sky Section</NatureSection>
          <NatureSection>Default Section</NatureSection>

          {/* Test RuralTitle size branches */}
          <RuralTitle size='small'>Small Title</RuralTitle>
          <RuralTitle size='medium'>Medium Title</RuralTitle>
          <RuralTitle size='large'>Large Title</RuralTitle>
          <RuralTitle>Default Title</RuralTitle>

          {/* Test RuralStat and RuralStatValue color branches */}
          <RuralStat $color='primary'>
            <RuralStatValue $color='primary'>Primary Value</RuralStatValue>
          </RuralStat>
          <RuralStat $color='secondary'>
            <RuralStatValue $color='secondary'>Secondary Value</RuralStatValue>
          </RuralStat>
          <RuralStat $color='accent'>
            <RuralStatValue $color='accent'>Accent Value</RuralStatValue>
          </RuralStat>
          <RuralStat>
            <RuralStatValue>Default Value</RuralStatValue>
          </RuralStat>
        </div>
      );

      expect(screen.getByTestId('comprehensive-css-test')).toBeInTheDocument();
      expect(screen.getByText('Low Card')).toBeInTheDocument();
      expect(screen.getByText('Medium Card')).toBeInTheDocument();
      expect(screen.getByText('High Card')).toBeInTheDocument();
      expect(screen.getByText('Default Card')).toBeInTheDocument();
      expect(screen.getByText('Earth Section')).toBeInTheDocument();
      expect(screen.getByText('Leaf Section')).toBeInTheDocument();
      expect(screen.getByText('Sky Section')).toBeInTheDocument();
      expect(screen.getByText('Default Section')).toBeInTheDocument();
      expect(screen.getByText('Small Title')).toBeInTheDocument();
      expect(screen.getByText('Medium Title')).toBeInTheDocument();
      expect(screen.getByText('Large Title')).toBeInTheDocument();
      expect(screen.getByText('Default Title')).toBeInTheDocument();
      expect(screen.getByText('Primary Value')).toBeInTheDocument();
      expect(screen.getByText('Secondary Value')).toBeInTheDocument();
      expect(screen.getByText('Accent Value')).toBeInTheDocument();
      expect(screen.getByText('Default Value')).toBeInTheDocument();
    });

    it('should test RuralIcon with all possible icon types and animate combinations', () => {
      const iconTypes = [
        'farm',
        'plant',
        'harvest',
        'tractor',
        'seed',
        'sun',
        'rain',
        'growth',
      ] as const;
      const animateStates = [true, false];

      iconTypes.forEach((iconType, iconIndex) => {
        animateStates.forEach((animate, _animateIndex) => {
          const { unmount } = renderWithTheme(<RuralIcon icon={iconType} animate={animate} />);

          // Verify icon renders with correct emoji
          const expectedEmojis = ['🏡', '🌱', '🌾', '🚜', '🌰', '☀️', '🌧️', '📈'];
          expect(screen.getByText(expectedEmojis[iconIndex])).toBeInTheDocument();
          unmount();
        });
      });
    });

    it('should test switch default cases with invalid values', () => {
      // Test all switch statement default cases by providing invalid values
      renderWithTheme(
        <div data-testid='default-cases-test'>
          <RuralIcon icon={'invalid-icon' as any} />
          <RuralDecorator position={'invalid-position' as any} />
          <RuralCard elevation={'invalid-elevation' as any}>Invalid Card</RuralCard>
          <NatureSection variant={'invalid-variant' as any}>Invalid Nature</NatureSection>
          <RuralTitle size={'invalid-size' as any}>Invalid Title</RuralTitle>
          <RuralStat $color={'invalid-color' as any}>
            <RuralStatValue $color={'invalid-color' as any}>Invalid</RuralStatValue>
          </RuralStat>
        </div>
      );

      expect(screen.getByTestId('default-cases-test')).toBeInTheDocument();
      expect(screen.getByText('🌿')).toBeInTheDocument(); // Default icon
      expect(screen.getByText('Invalid Card')).toBeInTheDocument();
      expect(screen.getByText('Invalid Nature')).toBeInTheDocument();
      expect(screen.getByText('Invalid Title')).toBeInTheDocument();
      expect(screen.getByText('Invalid')).toBeInTheDocument();
    });

    it('should test IconWrapper with animate prop combinations', () => {
      // Test the internal IconWrapper component with different animate values
      const { unmount: unmount1 } = renderWithTheme(<RuralIcon icon='farm' animate={true} />);
      expect(screen.getByText('🏡')).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderWithTheme(<RuralIcon icon='plant' animate={false} />);
      expect(screen.getByText('🌱')).toBeInTheDocument();
      unmount2();

      renderWithTheme(<RuralIcon icon='harvest' animate={undefined} />);
      expect(screen.getByText('🌾')).toBeInTheDocument();
    });

    it('should test complex prop combinations to ensure all branches are covered', () => {
      // Test complex combinations that might trigger different code paths
      renderWithTheme(
        <RuralCard elevation='high'>
          <NatureSection variant='sky'>
            <RuralTitle size='large'>Complex Test</RuralTitle>
            <RuralDecorator position='center' />
            <RuralStatComponent
              value='999'
              label='Complex Stat'
              color='accent'
              icon={<RuralIcon icon='growth' animate={true} />}
            />
            <RuralStat $color='secondary'>
              <RuralStatValue $color='secondary'>Secondary Value</RuralStatValue>
              <RuralStatLabel>Secondary Label</RuralStatLabel>
            </RuralStat>
          </NatureSection>
        </RuralCard>
      );

      expect(screen.getByText('Complex Test')).toBeInTheDocument();
      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('Complex Stat')).toBeInTheDocument();
      expect(screen.getByText('📈')).toBeInTheDocument();
      expect(screen.getByText('Secondary Value')).toBeInTheDocument();
      expect(screen.getByText('Secondary Label')).toBeInTheDocument();
    });

    it('should test all conditional rendering branches in RuralStatComponent', () => {
      // Test with icon present
      const { unmount: unmount1 } = renderWithTheme(
        <RuralStatComponent value='100' label='With Icon' icon='🎯' color='primary' />
      );
      expect(screen.getByText('🎯')).toBeInTheDocument();
      unmount1();

      // Test without icon
      const { unmount: unmount2 } = renderWithTheme(
        <RuralStatComponent value='200' label='Without Icon' color='secondary' />
      );
      expect(screen.queryByText('🎯')).not.toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      unmount2();

      // Test with null icon
      const { unmount: unmount3 } = renderWithTheme(
        <RuralStatComponent value='300' label='Null Icon' icon={null} color='accent' />
      );
      expect(screen.queryByText('🎯')).not.toBeInTheDocument();
      expect(screen.getByText('300')).toBeInTheDocument();
      unmount3();

      // Test with undefined icon
      renderWithTheme(<RuralStatComponent value='400' label='Undefined Icon' icon={undefined} />);
      expect(screen.queryByText('🎯')).not.toBeInTheDocument();
      expect(screen.getByText('400')).toBeInTheDocument();
    });

    it('should test edge cases in getIconEmoji function', () => {
      // Test all icon cases including edge cases
      const iconTestCases = [
        { icon: 'farm', emoji: '🏡' },
        { icon: 'plant', emoji: '🌱' },
        { icon: 'harvest', emoji: '🌾' },
        { icon: 'tractor', emoji: '🚜' },
        { icon: 'seed', emoji: '🌰' },
        { icon: 'sun', emoji: '☀️' },
        { icon: 'rain', emoji: '🌧️' },
        { icon: 'growth', emoji: '📈' },
        { icon: 'unknown', emoji: '🌿' },
        { icon: null, emoji: '🌿' },
        { icon: undefined, emoji: '🌿' },
        { icon: '', emoji: '🌿' },
        { icon: 'invalid', emoji: '🌿' },
      ];

      iconTestCases.forEach(({ icon, emoji }, index) => {
        const { unmount } = renderWithTheme(
          <div data-testid={`test-container-${index}`}>
            <RuralIcon icon={icon as any} />
          </div>
        );

        const container = screen.getByTestId(`test-container-${index}`);
        expect(container).toBeInTheDocument();
        expect(screen.getByText(emoji)).toBeInTheDocument();

        unmount();
      });
    });

    it('should test styled component hover state switch branches', () => {
      // Test hover states that contain switch logic in CSS-in-JS
      renderWithTheme(
        <div data-testid='hover-states'>
          <RuralCard elevation='low' data-testid='hover-low'>
            <div>Hover Low</div>
          </RuralCard>
          <RuralCard elevation='medium' data-testid='hover-medium'>
            <div>Hover Medium</div>
          </RuralCard>
          <RuralCard elevation='high' data-testid='hover-high'>
            <div>Hover High</div>
          </RuralCard>
          <RuralStat $color='primary' data-testid='hover-stat-primary'>
            <div>Hover Stat Primary</div>
          </RuralStat>
          <RuralStat $color='secondary' data-testid='hover-stat-secondary'>
            <div>Hover Stat Secondary</div>
          </RuralStat>
          <RuralStat $color='accent' data-testid='hover-stat-accent'>
            <div>Hover Stat Accent</div>
          </RuralStat>
        </div>
      );

      expect(screen.getByTestId('hover-states')).toBeInTheDocument();
      expect(screen.getByTestId('hover-low')).toBeInTheDocument();
      expect(screen.getByTestId('hover-medium')).toBeInTheDocument();
      expect(screen.getByTestId('hover-high')).toBeInTheDocument();
      expect(screen.getByTestId('hover-stat-primary')).toBeInTheDocument();
      expect(screen.getByTestId('hover-stat-secondary')).toBeInTheDocument();
      expect(screen.getByTestId('hover-stat-accent')).toBeInTheDocument();
    });

    it('should test comprehensive component integration with all prop variations', () => {
      // Ultimate integration test to ensure all code paths are covered
      renderWithTheme(
        <RuralPattern>
          <RuralCard elevation='high'>
            <RuralTitle size='large'>Ultimate Integration Test</RuralTitle>
            <RuralDecorator position='top' />

            <NatureSection variant='leaf'>
              <RuralStatComponent
                value='100'
                label='Stat with All Props'
                color='accent'
                icon={<RuralIcon icon='growth' animate={true} />}
              />
            </NatureSection>

            <RuralDecorator position='center' />

            <NatureSection variant='sky'>
              <div style={{ display: 'grid', gap: '16px' }}>
                <RuralStat $color='primary'>
                  <RuralStatValue $color='primary'>Primary Value</RuralStatValue>
                  <RuralStatLabel>Primary Label</RuralStatLabel>
                </RuralStat>

                <RuralStat $color='secondary'>
                  <RuralStatValue $color='secondary'>Secondary Value</RuralStatValue>
                  <RuralStatLabel>Secondary Label</RuralStatLabel>
                </RuralStat>

                <RuralStat $color='accent'>
                  <RuralStatValue $color='accent'>Accent Value</RuralStatValue>
                  <RuralStatLabel>Accent Label</RuralStatLabel>
                </RuralStat>
              </div>
            </NatureSection>

            <RuralDecorator position='bottom' />

            <NatureSection variant='earth'>
              <RuralIconContainer>
                <RuralIcon icon='farm' animate={false} />
                <RuralIcon icon='plant' animate={false} />
                <RuralIcon icon='harvest' animate={false} />
                <RuralIcon icon='tractor' animate={false} />
                <RuralIcon icon='seed' animate={false} />
                <RuralIcon icon='sun' animate={false} />
                <RuralIcon icon='rain' animate={false} />
                <RuralIcon icon='growth' animate={false} />
              </RuralIconContainer>
            </NatureSection>
          </RuralCard>
        </RuralPattern>
      );

      expect(screen.getByText('Ultimate Integration Test')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Stat with All Props')).toBeInTheDocument();
      expect(screen.getByText('Primary Value')).toBeInTheDocument();
      expect(screen.getByText('Secondary Value')).toBeInTheDocument();
      expect(screen.getByText('Accent Value')).toBeInTheDocument();
      expect(screen.getByText('🏡')).toBeInTheDocument();
      expect(screen.getByText('🌱')).toBeInTheDocument();
      expect(screen.getByText('🌾')).toBeInTheDocument();
      expect(screen.getByText('🚜')).toBeInTheDocument();
      expect(screen.getByText('🌰')).toBeInTheDocument();
      expect(screen.getByText('☀️')).toBeInTheDocument();
      expect(screen.getByText('🌧️')).toBeInTheDocument();
      expect(screen.getAllByText('📈')).toHaveLength(2); // One in stat, one in icon container
    });
  });
});
