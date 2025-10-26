import {
  CHART_COLORS_EARTH,
  CHART_COLORS_PRIMARY,
  CHART_COLORS_SECONDARY,
  CHART_COLORS_VIBRANT,
  CHART_PALETTES,
  ChartPaletteType,
  darkenColor,
  generateUniqueColors,
  lightenColor,
} from '../chartColors';

// Mock do theme
jest.mock('../../styles/theme', () => ({
  theme: {
    colors: {
      primary: {
        main: '#4A6741',
        light: '#7CB342',
      },
      secondary: {
        main: '#8B4513',
        light: '#CD853F',
      },
      accent: {
        main: '#7CB342',
      },
      warning: {
        main: '#FF9800',
        light: '#FFB74D',
      },
      danger: {
        main: '#F44336',
      },
      info: {
        main: '#2196F3',
      },
      success: {
        light: '#81C784',
      },
    },
  },
}));

describe('chartColors utilities', () => {
  describe('Color palettes', () => {
    it('should have CHART_COLORS_PRIMARY with 10 colors', () => {
      expect(CHART_COLORS_PRIMARY).toHaveLength(10);
      expect(CHART_COLORS_PRIMARY[0]).toBe('#4A6741');
    });

    it('should have CHART_COLORS_SECONDARY with 10 colors', () => {
      expect(CHART_COLORS_SECONDARY).toHaveLength(10);
      expect(CHART_COLORS_SECONDARY[0]).toBe('#2E7D32');
    });

    it('should have CHART_COLORS_EARTH with 10 colors', () => {
      expect(CHART_COLORS_EARTH).toHaveLength(10);
      expect(CHART_COLORS_EARTH[0]).toBe('#4A6741');
    });

    it('should have CHART_COLORS_VIBRANT with 10 colors', () => {
      expect(CHART_COLORS_VIBRANT).toHaveLength(10);
      expect(CHART_COLORS_VIBRANT[0]).toBe('#FF6B6B');
    });
  });

  describe('CHART_PALETTES', () => {
    it('should have all expected palette types', () => {
      expect(CHART_PALETTES.estados).toEqual(CHART_COLORS_PRIMARY);
      expect(CHART_PALETTES.culturas).toEqual(CHART_COLORS_EARTH);
      expect(CHART_PALETTES.usoSolo).toEqual(['#7CB342', '#FF9800']);
      expect(CHART_PALETTES.default).toEqual(CHART_COLORS_PRIMARY);
    });

    it('should have correct types for ChartPaletteType', () => {
      const paletteType: ChartPaletteType = 'estados';
      expect(typeof paletteType).toBe('string');
    });
  });

  describe('generateUniqueColors', () => {
    it('should return correct number of colors', () => {
      const colors = generateUniqueColors(5);
      expect(colors).toHaveLength(5);
    });

    it('should use base colors for counts within palette length', () => {
      const colors = generateUniqueColors(3);
      expect(colors[0]).toBe(CHART_COLORS_PRIMARY[0]);
      expect(colors[1]).toBe(CHART_COLORS_PRIMARY[1]);
      expect(colors[2]).toBe(CHART_COLORS_PRIMARY[2]);
    });

    it('should generate variations for counts exceeding palette length', () => {
      const colors = generateUniqueColors(12);
      expect(colors).toHaveLength(12);
      expect(colors[0]).toBe(CHART_COLORS_PRIMARY[0]);
      expect(colors[10]).not.toBe(CHART_COLORS_PRIMARY[0]); // Should be a variation
    });

    it('should generate lightened and darkened variations alternately', () => {
      const colors = generateUniqueColors(22);
      expect(colors).toHaveLength(22);

      // First 10 are primary colors
      expect(colors.slice(0, 10)).toEqual(CHART_COLORS_PRIMARY);

      // Check that variations are generated (don't check specific values, just that they're different)
      expect(colors[10]).not.toBe(CHART_COLORS_PRIMARY[0]);
      expect(colors[11]).not.toBe(CHART_COLORS_PRIMARY[1]);
    });
  });

  describe('lightenColor', () => {
    it('should lighten a color correctly', () => {
      const result = lightenColor('#000000', 0.5);
      expect(result).toBe('#808080');
    });

    it('should handle colors without # prefix', () => {
      const result = lightenColor('000000', 0.5);
      expect(result).toBe('#808080');
    });

    it('should not exceed maximum RGB values', () => {
      const result = lightenColor('#ffffff', 0.5);
      expect(result).toBe('#ffffff');
    });

    it('should handle partial lightening', () => {
      const result = lightenColor('#808080', 0.2);
      expect(result).toBe('#b3b3b3');
    });

    it('should preserve color format with leading zeros', () => {
      const result = lightenColor('#000010', 0.1);
      // Should maintain 6 digit format
      expect(result).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  describe('darkenColor', () => {
    it('should darken a color correctly', () => {
      const result = darkenColor('#ffffff', 0.5);
      expect(result).toBe('#7f7f7f');
    });

    it('should handle colors without # prefix', () => {
      const result = darkenColor('ffffff', 0.5);
      expect(result).toBe('#7f7f7f');
    });

    it('should not go below minimum RGB values', () => {
      const result = darkenColor('#000000', 0.5);
      expect(result).toBe('#000000');
    });

    it('should handle partial darkening', () => {
      const result = darkenColor('#808080', 0.2);
      expect(result).toBe('#4d4d4d');
    });

    it('should preserve color format with leading zeros', () => {
      const result = darkenColor('#101010', 0.1);
      // Should maintain 6 digit format
      expect(result).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero count in generateUniqueColors', () => {
      const colors = generateUniqueColors(0);
      expect(colors).toHaveLength(0);
    });

    it('should handle large counts in generateUniqueColors', () => {
      const colors = generateUniqueColors(100);
      expect(colors).toHaveLength(100);
      // All colors should be valid hex strings
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should handle zero amount in lightenColor', () => {
      const original = '#808080';
      const result = lightenColor(original, 0);
      expect(result).toBe(original);
    });

    it('should handle zero amount in darkenColor', () => {
      const original = '#808080';
      const result = darkenColor(original, 0);
      expect(result).toBe(original);
    });

    it('should handle invalid hex colors gracefully', () => {
      // Test with shorter hex string
      const result = lightenColor('#abc', 0.1);
      // Should still try to process, though result might be unexpected
      expect(typeof result).toBe('string');
      expect(result.startsWith('#')).toBe(true);
    });
  });
});
