import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../styles/theme';
import Header from '../Header';

const renderWithRouter = (component: React.ReactNode, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </MemoryRouter>
  );
};

const renderWithBrowserRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  describe('Rendering', () => {
    it('should render the logo with correct text', () => {
      renderWithRouter(<Header />);

      const logo = screen.getByRole('link', { name: /cadastro de produtores rurais/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('href', '/');
    });

    it('should render all navigation links', () => {
      renderWithRouter(<Header />);

      expect(screen.getByRole('link', { name: /ir para dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ir para produtores/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ir para culturas/i })).toBeInTheDocument();
    });

    it('should render mobile menu button', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });
      expect(mobileButton).toBeInTheDocument();
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href attributes', () => {
      renderWithRouter(<Header />);

      expect(screen.getByRole('link', { name: /ir para dashboard/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /ir para produtores/i })).toHaveAttribute(
        'href',
        '/producers'
      );
      expect(screen.getByRole('link', { name: /ir para culturas/i })).toHaveAttribute(
        'href',
        '/culturas'
      );
    });

    it('should highlight active dashboard link when on home page', () => {
      renderWithRouter(<Header />, ['/']);

      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      expect(dashboardLink).toHaveAttribute('data-active', 'true');
    });

    it('should highlight active producers link when on producers page', () => {
      renderWithRouter(<Header />, ['/producers']);

      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      expect(producersLink).toHaveAttribute('data-active', 'true');
    });

    it('should highlight active cultures link when on cultures page', () => {
      renderWithRouter(<Header />, ['/culturas']);

      const culturesLink = screen.getByRole('link', { name: /ir para culturas/i });
      expect(culturesLink).toHaveAttribute('data-active', 'true');
    });

    it('should highlight producers link when on producer subpages', () => {
      renderWithRouter(<Header />, ['/producer-register']);

      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      expect(producersLink).toHaveAttribute('data-active', 'true');
    });

    it('should not highlight any link when on unrelated page', () => {
      renderWithRouter(<Header />, ['/some-other-page']);

      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      const culturesLink = screen.getByRole('link', { name: /ir para culturas/i });

      expect(dashboardLink).toHaveAttribute('data-active', 'false');
      expect(producersLink).toHaveAttribute('data-active', 'false');
      expect(culturesLink).toHaveAttribute('data-active', 'false');
    });

    it('should not highlight dashboard when on non-root path', () => {
      renderWithRouter(<Header />, ['/random-path']);

      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      expect(dashboardLink).toHaveAttribute('data-active', 'false');
    });

    it('should handle complex path matching', () => {
      renderWithRouter(<Header />, ['/culturas/some-sub-page']);

      const culturesLink = screen.getByRole('link', { name: /ir para culturas/i });
      expect(culturesLink).toHaveAttribute('data-active', 'true');
    });
  });

  describe('Mobile Menu Functionality', () => {
    it('should toggle mobile menu when button is clicked', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });

      // Initially closed
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
      expect(mobileButton).toHaveTextContent('☰');

      // Click to open
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
      expect(mobileButton).toHaveTextContent('✕');
      expect(screen.getByRole('button', { name: /fechar menu/i })).toBeInTheDocument();

      // Click to close
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
      expect(mobileButton).toHaveTextContent('☰');
    });

    it('should close mobile menu when navigation link is clicked', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });
      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });

      // Open menu
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');

      // Click navigation link
      fireEvent.click(dashboardLink);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should close mobile menu when logo is clicked', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });
      const logo = screen.getByRole('link', { name: /cadastro de produtores rurais/i });

      // Open menu
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');

      // Click logo
      fireEvent.click(logo);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithRouter(<Header />);

      expect(screen.getByRole('button', { name: /abrir menu/i })).toHaveAttribute(
        'aria-label',
        'Abrir menu'
      );
      expect(screen.getByRole('link', { name: /ir para dashboard/i })).toHaveAttribute(
        'aria-label',
        'Ir para Dashboard'
      );
      expect(screen.getByRole('link', { name: /ir para produtores/i })).toHaveAttribute(
        'aria-label',
        'Ir para Produtores'
      );
      expect(screen.getByRole('link', { name: /ir para culturas/i })).toHaveAttribute(
        'aria-label',
        'Ir para Culturas'
      );
    });

    it('should update aria-label when mobile menu state changes', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });

      fireEvent.click(mobileButton);
      expect(screen.getByRole('button', { name: /fechar menu/i })).toHaveAttribute(
        'aria-label',
        'Fechar menu'
      );
    });

    it('should have proper heading structure', () => {
      renderWithRouter(<Header />);

      // Header should be a semantic header element
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Navigation Behavior', () => {
    it('should work with browser router navigation', () => {
      renderWithBrowserRouter(<Header />);

      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render navigation elements correctly', () => {
      renderWithRouter(<Header />);

      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();

      // Check if all nav items are present
      const navLinks = screen.getAllByRole('link');
      expect(navLinks).toHaveLength(4); // Logo + 3 nav links
    });
  });

  describe('Theme Integration', () => {
    it('should render with theme provider', () => {
      renderWithRouter(<Header />);

      // Component should render without throwing errors when wrapped with ThemeProvider
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Enhanced Branch Coverage Tests', () => {
    it('should test all branches of isActive function', () => {
      // Test exact root path match (path === '/' && location.pathname === '/')
      renderWithRouter(<Header />, ['/']);
      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      expect(dashboardLink).toHaveAttribute('data-active', 'true');
    });

    it("should test non-root path matching branch (path !== '/' && location.pathname.startsWith(path))", () => {
      // Test producers path matching
      renderWithRouter(<Header />, ['/producers/some-id']);
      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      expect(producersLink).toHaveAttribute('data-active', 'true');
    });

    it('should test false branch for non-matching paths', () => {
      renderWithRouter(<Header />, ['/random-path']);

      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      const culturesLink = screen.getByRole('link', { name: /ir para culturas/i });

      expect(dashboardLink).toHaveAttribute('data-active', 'false');
      expect(producersLink).toHaveAttribute('data-active', 'false');
      expect(culturesLink).toHaveAttribute('data-active', 'false');
    });

    it('should test root path NOT matching when on different path', () => {
      // This tests the first condition being false when path === '/' but location.pathname !== '/'
      renderWithRouter(<Header />, ['/some-other-path']);
      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      expect(dashboardLink).toHaveAttribute('data-active', 'false');
    });

    it('should test exact path matching for cultures', () => {
      renderWithRouter(<Header />, ['/culturas']);
      const culturesLink = screen.getByRole('link', { name: /ir para culturas/i });
      expect(culturesLink).toHaveAttribute('data-active', 'true');
    });

    it('should test path prefix matching for cultures with subpath', () => {
      renderWithRouter(<Header />, ['/culturas/edit/123']);
      const culturesLink = screen.getByRole('link', { name: /ir para culturas/i });
      expect(culturesLink).toHaveAttribute('data-active', 'true');
    });

    it('should test producer path variations to cover all branches', () => {
      // Test producer-register path
      renderWithRouter(<Header />, ['/producer-register']);
      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      expect(producersLink).toHaveAttribute('data-active', 'true');
    });

    it('should test path that starts with producer but is different', () => {
      renderWithRouter(<Header />, ['/producer-something-else']);
      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      expect(producersLink).toHaveAttribute('data-active', 'true');
    });

    it('should test conditional mobile menu icon rendering', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });

      // Test the ternary operator for icon text (isMobileMenuOpen ? '✕' : '☰')
      expect(mobileButton).toHaveTextContent('☰'); // closed state

      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveTextContent('✕'); // open state

      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveTextContent('☰'); // closed state again
    });

    it('should test conditional mobile menu aria-label', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });

      // Test the ternary operator for aria-label (isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu')
      expect(mobileButton).toHaveAttribute('aria-label', 'Abrir menu'); // closed state

      fireEvent.click(mobileButton);
      expect(screen.getByRole('button', { name: /fechar menu/i })).toHaveAttribute(
        'aria-label',
        'Fechar menu'
      ); // open state
    });

    it('should test all navigation links to ensure full isActive coverage', () => {
      // Test each navigation link individually to cover all isActive function calls

      // Dashboard on root
      const { unmount: unmount1 } = renderWithRouter(<Header />, ['/']);
      expect(screen.getByRole('link', { name: /ir para dashboard/i })).toHaveAttribute(
        'data-active',
        'true'
      );
      expect(screen.getByRole('link', { name: /ir para produtores/i })).toHaveAttribute(
        'data-active',
        'false'
      );
      expect(screen.getByRole('link', { name: /ir para culturas/i })).toHaveAttribute(
        'data-active',
        'false'
      );
      unmount1();

      // Producers page
      const { unmount: unmount2 } = renderWithRouter(<Header />, ['/producers']);
      expect(screen.getByRole('link', { name: /ir para dashboard/i })).toHaveAttribute(
        'data-active',
        'false'
      );
      expect(screen.getByRole('link', { name: /ir para produtores/i })).toHaveAttribute(
        'data-active',
        'true'
      );
      expect(screen.getByRole('link', { name: /ir para culturas/i })).toHaveAttribute(
        'data-active',
        'false'
      );
      unmount2();

      // Cultures page
      renderWithRouter(<Header />, ['/culturas']);
      expect(screen.getByRole('link', { name: /ir para dashboard/i })).toHaveAttribute(
        'data-active',
        'false'
      );
      expect(screen.getByRole('link', { name: /ir para produtores/i })).toHaveAttribute(
        'data-active',
        'false'
      );
      expect(screen.getByRole('link', { name: /ir para culturas/i })).toHaveAttribute(
        'data-active',
        'true'
      );
    });

    it('should test edge cases for isActive function coverage', () => {
      // Test case where path is not '/' and doesn't start with the checked path
      renderWithRouter(<Header />, ['/completely-different']);

      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });
      const producersLink = screen.getByRole('link', { name: /ir para produtores/i });
      const culturesLink = screen.getByRole('link', { name: /ir para culturas/i });

      // All should be false
      expect(dashboardLink).toHaveAttribute('data-active', 'false');
      expect(producersLink).toHaveAttribute('data-active', 'false');
      expect(culturesLink).toHaveAttribute('data-active', 'false');
    });

    it('should test toggleMobileMenu function coverage', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });

      // Test initial state
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');

      // Test toggle to open (setIsMobileMenuOpen(!isMobileMenuOpen) with false -> true)
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');

      // Test toggle to close (setIsMobileMenuOpen(!isMobileMenuOpen) with true -> false)
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should test closeMobileMenu function coverage', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });
      const dashboardLink = screen.getByRole('link', { name: /ir para dashboard/i });

      // Open menu first
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');

      // Test closeMobileMenu via navigation link click (setIsMobileMenuOpen(false))
      fireEvent.click(dashboardLink);
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should test all ternary operators in styled components', () => {
      renderWithRouter(<Header />);

      const mobileButton = screen.getByRole('button', { name: /abrir menu/i });

      // Test initial state (all ternary operators should use false branch)
      expect(mobileButton).toHaveTextContent('☰'); // isMobileMenuOpen ? '✕' : '☰'
      expect(mobileButton).toHaveAttribute('aria-label', 'Abrir menu'); // isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false'); // Navigation $isOpen should be false

      // Test opened state (all ternary operators should use true branch)
      fireEvent.click(mobileButton);
      expect(mobileButton).toHaveTextContent('✕'); // isMobileMenuOpen ? '✕' : '☰'
      expect(mobileButton).toHaveAttribute('aria-label', 'Fechar menu'); // isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true'); // Navigation $isOpen should be true
    });
  });
});
