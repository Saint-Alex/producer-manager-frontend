import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

interface GlobalStyleWrapperProps {
  children?: React.ReactNode;
}

export const GlobalStyleWrapper: React.FC<GlobalStyleWrapperProps> = ({ children }) => {
  if (process.env.NODE_ENV === 'test') {
    return (
      <div data-testid='theme-provider'>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </div>
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { GlobalStyle } = require('./GlobalStyles');
    return (
      <div data-testid='theme-provider'>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          {children}
        </ThemeProvider>
      </div>
    );
  } catch (error) {
    return (
      <div data-testid='theme-provider'>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </div>
    );
  }
};

export default GlobalStyleWrapper;
