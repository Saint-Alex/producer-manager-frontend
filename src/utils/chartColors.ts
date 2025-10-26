// Paletas de cores únicas para gráficos
import { theme } from '../styles/theme';

// Paleta principal - cores sempre diferentes
export const CHART_COLORS_PRIMARY = [
  theme.colors.primary.main, // Verde campo
  theme.colors.secondary.main, // Marrom terra
  theme.colors.accent.main, // Verde folha
  theme.colors.warning.main, // Laranja colheita
  theme.colors.danger.main, // Vermelho terra
  theme.colors.info.main, // Azul céu rural
  theme.colors.success.light, // Verde folha claro
  theme.colors.primary.light, // Verde campo claro
  theme.colors.secondary.light, // Marrom terra claro
  theme.colors.warning.light, // Laranja colheita claro
];

// Paleta secundária para mais variedade
export const CHART_COLORS_SECONDARY = [
  '#2E7D32', // Verde escuro
  '#D84315', // Vermelho terra escuro
  '#1976D2', // Azul
  '#F57C00', // Laranja escuro
  '#7B1FA2', // Roxo
  '#388E3C', // Verde médio
  '#FBC02D', // Amarelo
  '#5D4037', // Marrom
  '#00796B', // Verde água
  '#E64A19', // Laranja avermelhado
];

// Paleta de tons terrosos (temática rural)
export const CHART_COLORS_EARTH = [
  '#4A6741', // Verde campo
  '#8B4513', // Marrom terra
  '#7CB342', // Verde folha
  '#CD853F', // Peru/Sandy Brown
  '#6B8E23', // Olive Drab
  '#D2691E', // Chocolate
  '#228B22', // Forest Green
  '#B8860B', // Dark Goldenrod
  '#A0522D', // Sienna
  '#556B2F', // Dark Olive Green
];

// Paleta vibrante para destacar dados importantes
export const CHART_COLORS_VIBRANT = [
  '#FF6B6B', // Coral
  '#4ECDC4', // Turquesa
  '#45B7D1', // Azul claro
  '#96CEB4', // Verde menta
  '#FECA57', // Amarelo suave
  '#FF9FF3', // Rosa
  '#54A0FF', // Azul royal
  '#5F27CD', // Roxo
  '#00D2D3', // Ciano
  '#FF9F43', // Laranja
];

// Função para gerar cores únicas baseadas no tema
export const generateUniqueColors = (count: number): string[] => {
  const baseColors = CHART_COLORS_PRIMARY;
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i < baseColors.length) {
      result.push(baseColors[i]);
    } else {
      // Gera variações das cores base
      const baseIndex = i % baseColors.length;
      const variation = Math.floor(i / baseColors.length);
      const baseColor = baseColors[baseIndex];

      // Cria variação da cor (mais clara ou mais escura)
      const modifiedColor =
        variation % 2 === 0 ? lightenColor(baseColor, 0.2) : darkenColor(baseColor, 0.2);

      result.push(modifiedColor);
    }
  }

  return result;
};

// Função auxiliar para clarear cor
export const lightenColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(amount * 255));
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(amount * 255));
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(amount * 255));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Função auxiliar para escurecer cor
export const darkenColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(amount * 255));
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(amount * 255));
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(amount * 255));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Paletas específicas para cada tipo de gráfico
export const CHART_PALETTES = {
  estados: CHART_COLORS_PRIMARY,
  culturas: CHART_COLORS_EARTH,
  usoSolo: [theme.colors.accent.main, theme.colors.warning.main] as string[], // Apenas 2 cores para uso do solo
  default: CHART_COLORS_PRIMARY,
} as const;

export type ChartPaletteType = keyof typeof CHART_PALETTES;
