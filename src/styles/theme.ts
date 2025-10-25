export const theme = {
  colors: {
    primary: {
      main: '#4A6741',       // Verde campo
      light: '#6B8E5A',      // Verde campo claro
      lighter: '#8BA572',    // Verde campo muito claro
      dark: '#3A5233',       // Verde campo escuro
    },
    secondary: {
      main: '#8B4513',       // Marrom terra
      light: '#A0622D',      // Marrom terra claro
      lighter: '#B87A47',    // Marrom terra muito claro
      dark: '#704209',       // Marrom terra escuro
    },
    accent: {
      main: '#7CB342',       // Verde folha
      light: '#9CCC65',      // Verde folha claro
      lighter: '#AED581',    // Verde folha muito claro
      dark: '#558B2F',       // Verde folha escuro
    },
    warning: {
      main: '#FF8F00',       // Laranja colheita
      light: '#FFB74D',      // Laranja colheita claro
      lighter: '#FFCC02',    // Laranja colheita muito claro
      dark: '#F57C00',       // Laranja colheita escuro
    },
    danger: {
      main: '#D84315',       // Vermelho terra
      light: '#FF7043',      // Vermelho terra claro
      lighter: '#FF8A65',    // Vermelho terra muito claro
      dark: '#BF360C',       // Vermelho terra escuro
    },
    success: {
      main: '#7CB342',       // Verde folha (mesmo do accent)
      light: '#9CCC65',
      lighter: '#AED581',
      dark: '#558B2F',
    },
    info: {
      main: '#5D8AA8',       // Azul céu rural
      light: '#81A9C4',
      lighter: '#A5C8DD',
      dark: '#456B7A',
    },
    neutral: {
      50: '#FBF8F5',         // Off-white cremoso
      100: '#F5E6D3',        // Bege natural muito claro
      200: '#E8D5BA',        // Bege natural claro
      300: '#D4C4A1',        // Bege natural
      400: '#B8A888',        // Bege natural escuro
      500: '#9C8C6F',        // Marrom claro
      600: '#807056',        // Marrom médio
      700: '#64543D',        // Marrom escuro
      800: '#483824',        // Marrom muito escuro
      900: '#2C1C0B',        // Marrom quase preto
    },
    grey: {
      50: '#FBF8F5',
      100: '#F5E6D3',
      200: '#E8D5BA',
      300: '#D4C4A1',
      400: '#B8A888',
      500: '#9C8C6F',
      600: '#807056',
      700: '#64543D',
      800: '#483824',
      900: '#2C1C0B',
    },
    text: {
      primary: '#2C1C0B',    // Marrom muito escuro
      secondary: '#64543D',   // Marrom escuro
      disabled: '#B8A888',    // Bege natural escuro
      hint: '#9C8C6F',       // Marrom claro
    },
    background: {
      default: '#F5E6D3',    // Bege natural cremoso
      paper: '#FFFFFF',      // Branco puro para contraste
      card: '#FFFFFF',       // Branco puro para cards
      accent: '#FBF8F5',     // Off-white para seções especiais
    },
    border: {
      main: '#E8D5BA',       // Bege natural claro
      light: '#F5E6D3',      // Bege natural muito claro
      dark: '#D4C4A1',       // Bege natural
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '6px',              // Mais arredondado
    md: '12px',             // Mais arredondado
    lg: '18px',             // Mais arredondado
    xl: '24px',             // Mais arredondado
  },
  shadows: {
    sm: '0 2px 8px rgba(44, 28, 11, 0.08), 0 1px 4px rgba(44, 28, 11, 0.12)',
    md: '0 4px 12px rgba(44, 28, 11, 0.10), 0 2px 6px rgba(44, 28, 11, 0.08)',
    lg: '0 8px 24px rgba(44, 28, 11, 0.12), 0 4px 12px rgba(44, 28, 11, 0.06)',
    xl: '0 16px 32px rgba(44, 28, 11, 0.15), 0 8px 16px rgba(44, 28, 11, 0.08)',
  },
  fonts: {
    primary: '"Nunito", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    monospace: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
  // Utilitários para media queries
  mediaQueries: {
    xs: '@media (max-width: 599px)',
    sm: '@media (min-width: 600px)',
    md: '@media (min-width: 960px)',
    lg: '@media (min-width: 1280px)',
    xl: '@media (min-width: 1920px)',
    mobile: '@media (max-width: 768px)',
    tablet: '@media (min-width: 769px) and (max-width: 1023px)',
    desktop: '@media (min-width: 1024px)',
    maxSm: '@media (max-width: 767px)',
    maxMd: '@media (max-width: 959px)',
    maxLg: '@media (max-width: 1279px)',
  },
};

export type Theme = typeof theme;
