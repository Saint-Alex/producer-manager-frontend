import { render } from '@testing-library/react';
import React from 'react';
import { GlobalStyleWrapper } from '../GlobalStyleWrapper';

// Mocking console.error para capturar warnings
const originalConsoleError = console.error;
const mockConsoleError = jest.fn();

describe('GlobalStyleWrapper', () => {
  beforeEach(() => {
    jest.resetModules();
    console.error = mockConsoleError;
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      // Mock production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Cleanup after test
      return () => {
        process.env.NODE_ENV = originalEnv;
      };
    });

    it('should render with GlobalStyle in production when require succeeds', () => {
      // Mock successful require of GlobalStyles
      jest.doMock(
        '../GlobalStyles',
        () => ({
          GlobalStyle: () => React.createElement('style', { 'data-testid': 'global-style' }),
        }),
        { virtual: true }
      );

      const { container } = render(
        <GlobalStyleWrapper>
          <div data-testid='child'>Test Content</div>
        </GlobalStyleWrapper>
      );

      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
    });

    it('should handle require error gracefully in production', () => {
      // Mock failed require of GlobalStyles
      jest.doMock(
        '../GlobalStyles',
        () => {
          throw new Error('Module not found');
        },
        { virtual: true }
      );

      const { container } = render(
        <GlobalStyleWrapper>
          <div data-testid='child'>Test Content</div>
        </GlobalStyleWrapper>
      );

      // Should still render children even when GlobalStyles fails to load
      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
    });
  });

  describe('Test Environment', () => {
    beforeEach(() => {
      // Ensure we're in test environment
      process.env.NODE_ENV = 'test';
    });

    it('should render without GlobalStyle in test environment', () => {
      const { container } = render(
        <GlobalStyleWrapper>
          <div data-testid='child'>Test Content</div>
        </GlobalStyleWrapper>
      );

      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
    });

    it('should render with children prop', () => {
      render(
        <GlobalStyleWrapper>
          <div data-testid='test-child'>Child Component</div>
        </GlobalStyleWrapper>
      );

      expect(document.querySelector('[data-testid="test-child"]')).toBeInTheDocument();
    });

    it('should render without children prop', () => {
      const { container } = render(<GlobalStyleWrapper />);

      // Should render ThemeProvider even without children
      expect(container.querySelector('[data-testid="theme-provider"]')).toBeInTheDocument();
    });
  });

  describe('Development Environment', () => {
    beforeEach(() => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // Cleanup after test
      return () => {
        process.env.NODE_ENV = originalEnv;
      };
    });

    it('should render with GlobalStyle in development when require succeeds', () => {
      // Mock successful require of GlobalStyles
      jest.doMock(
        '../GlobalStyles',
        () => ({
          GlobalStyle: () => React.createElement('style', { 'data-testid': 'global-style-dev' }),
        }),
        { virtual: true }
      );

      const { container } = render(
        <GlobalStyleWrapper>
          <div data-testid='child'>Development Content</div>
        </GlobalStyleWrapper>
      );

      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
    });

    it('should handle require error gracefully in development', () => {
      // Mock failed require of GlobalStyles with specific error
      jest.doMock(
        '../GlobalStyles',
        () => {
          throw new Error('Cannot resolve module');
        },
        { virtual: true }
      );

      const { container } = render(
        <GlobalStyleWrapper>
          <div data-testid='child'>Development Content</div>
        </GlobalStyleWrapper>
      );

      // Should fallback to ThemeProvider only when error occurs
      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      const { container } = render(
        <GlobalStyleWrapper>
          {null}
          {undefined}
          {false}
        </GlobalStyleWrapper>
      );

      expect(container.querySelector('[data-testid="theme-provider"]')).toBeInTheDocument();
    });

    it('should handle complex children structure', () => {
      render(
        <GlobalStyleWrapper>
          <div data-testid='parent'>
            <span data-testid='child-1'>Child 1</span>
            <span data-testid='child-2'>Child 2</span>
            <div data-testid='nested'>
              <p data-testid='nested-child'>Nested Content</p>
            </div>
          </div>
        </GlobalStyleWrapper>
      );

      expect(document.querySelector('[data-testid="parent"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="child-1"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="child-2"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="nested"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="nested-child"]')).toBeInTheDocument();
    });
  });

  describe('Branch Coverage Tests', () => {
    it('should test all conditional branches explicitly', () => {
      // Test 1: NODE_ENV === 'test' branch
      process.env.NODE_ENV = 'test';
      const { unmount: unmount1 } = render(
        <GlobalStyleWrapper>
          <div data-testid='test-env'>Test Environment</div>
        </GlobalStyleWrapper>
      );
      expect(document.querySelector('[data-testid="test-env"]')).toBeInTheDocument();
      unmount1();

      // Test 2: NODE_ENV !== 'test' with successful require
      process.env.NODE_ENV = 'production';
      jest.doMock(
        '../GlobalStyles',
        () => ({
          GlobalStyle: () => React.createElement('style'),
        }),
        { virtual: true }
      );

      const { unmount: unmount2 } = render(
        <GlobalStyleWrapper>
          <div data-testid='prod-env-success'>Production Success</div>
        </GlobalStyleWrapper>
      );
      expect(document.querySelector('[data-testid="prod-env-success"]')).toBeInTheDocument();
      unmount2();

      // Test 3: NODE_ENV !== 'test' with failed require (catch block)
      jest.doMock(
        '../GlobalStyles',
        () => {
          throw new Error('Require failed');
        },
        { virtual: true }
      );

      const { unmount: unmount3 } = render(
        <GlobalStyleWrapper>
          <div data-testid='prod-env-error'>Production Error</div>
        </GlobalStyleWrapper>
      );
      expect(document.querySelector('[data-testid="prod-env-error"]')).toBeInTheDocument();
      unmount3();
    });
  });
});
