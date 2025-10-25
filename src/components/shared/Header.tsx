import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
  border-bottom: 3px solid ${theme.colors.accent.main};
  box-shadow: ${theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${theme.colors.accent.main} 0%,
      ${theme.colors.secondary.main} 50%,
      ${theme.colors.accent.main} 100%
    );
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;

  ${theme.mediaQueries.mobile} {
    padding: 0 ${theme.spacing.md};
    height: 60px;
  }

  ${theme.mediaQueries.xs} {
    padding: 0 ${theme.spacing.sm};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  text-decoration: none;
  color: white;
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.xl};
  transition: all 0.3s ease;

  ${theme.mediaQueries.mobile} {
    font-size: ${theme.fontSize.lg};
  }

  &:hover {
    transform: scale(1.05);
    color: ${theme.colors.accent.lighter};
  }

  &::before {
    content: '🌾';
    font-size: ${theme.fontSize['2xl']};

    ${theme.mediaQueries.mobile} {
      font-size: ${theme.fontSize.xl};
    }
  }
`;

const Navigation = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  ${theme.mediaQueries.mobile} {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${theme.colors.primary.dark};
    flex-direction: column;
    gap: 0;
    padding: ${theme.spacing.md} 0;
    box-shadow: ${theme.shadows.lg};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-100%)')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: all 0.3s ease;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: white;
  text-decoration: none;
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  position: relative;
  transition: all 0.3s ease;

  ${theme.mediaQueries.mobile} {
    width: 100%;
    text-align: center;
    padding: ${theme.spacing.md};
    border-radius: 0;
    border-bottom: 1px solid ${theme.colors.primary.main}40;

    &:last-child {
      border-bottom: none;
    }
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    background: ${theme.colors.accent.main}30;
    color: ${theme.colors.accent.lighter};

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: ${theme.colors.accent.main};
      border-radius: 1px;

      ${theme.mediaQueries.mobile} {
        display: none;
      }
    }
  `}

  &:hover {
    background: ${theme.colors.primary.light}50;
    color: ${theme.colors.accent.lighter};
    transform: translateY(-2px);

    ${theme.mediaQueries.mobile} {
      transform: none;
      background: ${theme.colors.primary.main}50;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: ${theme.fontSize.xl};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.3s ease;

  ${theme.mediaQueries.mobile} {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: ${theme.colors.primary.light}50;
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid ${theme.colors.accent.main};
    outline-offset: 2px;
  }
`;

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to='/' onClick={closeMobileMenu}>
          Cadastro de Produtores Rurais
        </Logo>

        <Navigation $isOpen={isMobileMenuOpen}>
          <NavLink
            to='/'
            $isActive={isActive('/')}
            data-active={isActive('/')}
            onClick={closeMobileMenu}
            aria-label='Ir para Dashboard'
          >
            Dashboard
          </NavLink>
          <NavLink
            to='/producers'
            $isActive={isActive('/producer')}
            data-active={isActive('/producer')}
            onClick={closeMobileMenu}
            aria-label='Ir para Produtores'
          >
            Produtores
          </NavLink>
          <NavLink
            to='/culturas'
            $isActive={isActive('/culturas')}
            data-active={isActive('/culturas')}
            onClick={closeMobileMenu}
            aria-label='Ir para Culturas'
          >
            Culturas
          </NavLink>
        </Navigation>

        <MobileMenuButton
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
